from flask import Flask, jsonify, request
from flask_cors import CORS
import trial_core as core

# -------------------------------------------------
# INITIALIZE FLASK APP
# -------------------------------------------------
app = Flask(__name__)
CORS(app)

# -------------------------------------------------
# SETUP DATABASE CONNECTIONS
# -------------------------------------------------
sql_conn, sql_cursor, mongo_client, mongo_db, bin_readings_collection = core.get_connections()
core.setup_databases(sql_cursor, sql_conn, bin_readings_collection, drop_existing=False)

# -------------------------------------------------
# AUTO-LOAD DATA IF EMPTY
# -------------------------------------------------
if bin_readings_collection.count_documents({}) == 0:
    print("⚠️ No bin data found in MongoDB. Loading from CSV...")
    core.load_data_from_csv(sql_cursor, sql_conn, bin_readings_collection)
    core.generate_system_alerts(sql_cursor, sql_conn)
else:
    print(f"✅ MongoDB already contains {bin_readings_collection.count_documents({})} records. Skipping CSV load.")


# -------------------------------------------------
# DASHBOARD ENDPOINT
# -------------------------------------------------
@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    """Return summary data for dashboard cards."""
    summary = core.get_dashboard_summary(sql_cursor, bin_readings_collection)

    response = {
        "total_bins": summary.get("total_bins", 0) or summary.get("available_bins", 0),
        "full_bins": summary.get("full_bins", 0),
        "active_trucks": summary.get("active_trucks", 0),
        "total_trucks": summary.get("idle_trucks", 0) + summary.get("active_trucks", 0),
        "active_routes": summary.get("active_trucks", 0),
        "alerts": summary.get("alerts", 3),
        "landfill_usage": summary.get("landfill_usage", 68),
    }
    return jsonify(response), 200


# -------------------------------------------------
# COLLECTION EFFICIENCY ENDPOINT
# -------------------------------------------------
@app.route("/api/efficiency", methods=["GET"])
def collection_efficiency():
    """Return collection efficiency trends for dashboard graph."""
    try:
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        efficiencies = [82, 91, 75, 96, 88, 79, 93]
        data = [{"day": d, "efficiency": e} for d, e in zip(days, efficiencies)]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# BINS ENDPOINT
# -------------------------------------------------
@app.route("/api/bins", methods=["GET"])
def bins():
    """Return standardized bin data for frontend."""
    pipeline = [
        {"$sort": {"time": -1}},
        {"$group": {"_id": "$serial", "latest": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$latest"}},
        {"$limit": 100}
    ]
    raw_bins = list(bin_readings_collection.aggregate(pipeline))

    formatted_bins = []
    for b in raw_bins:
        formatted_bins.append({
            "serial": b.get("serial"),
            "address": b.get("address"),
            "status": b.get("bin_status") or "Unknown",
            "fill_level": b.get("status_current_fill_level") or 0,
            "lat": b.get("lat"),
            "lon": b.get("lon"),
            "last_updated": b.get("time"),
        })

    return jsonify(formatted_bins), 200


# -------------------------------------------------
# TRUCKS ENDPOINT
# -------------------------------------------------
@app.route("/api/trucks", methods=["GET"])
def trucks():
    """Return all trucks and their status."""
    sql_cursor.execute("SELECT id, name, status FROM Trucks;")
    data = sql_cursor.fetchall()
    trucks_list = [{"id": t[0], "name": t[1], "status": t[2]} for t in data]
    return jsonify(trucks_list), 200


# -------------------------------------------------
# ALERTS ENDPOINT
# -------------------------------------------------
@app.route("/api/alerts", methods=["GET"])
def alerts():
    """Return recent system alerts."""
    sql_cursor.execute("""
        SELECT id, type, message, severity, timestamp 
        FROM MonitoringAlerts 
        ORDER BY timestamp DESC 
        LIMIT 10;
    """)
    data = sql_cursor.fetchall()
    alerts_list = [
        {"id": a[0], "type": a[1], "message": a[2], "severity": a[3], "timestamp": str(a[4])}
        for a in data
    ]
    return jsonify(alerts_list), 200


# -------------------------------------------------
# LANDFILLS ENDPOINT
# -------------------------------------------------
@app.route("/api/landfills", methods=["GET"])
def landfills():
    """Return landfill capacity and usage."""
    sql_cursor.execute("""
        CREATE TABLE IF NOT EXISTS Landfills (
            id SERIAL PRIMARY KEY,
            name TEXT,
            capacity_tons DOUBLE PRECISION,
            used_tons DOUBLE PRECISION
        );
    """)
    sql_conn.commit()

    sql_cursor.execute("SELECT id, name, capacity_tons, used_tons FROM Landfills;")
    data = sql_cursor.fetchall()

    if not data:
        sql_cursor.execute(
            "INSERT INTO Landfills (name, capacity_tons, used_tons) VALUES ('Central Landfill', 10000, 6800);"
        )
        sql_conn.commit()
        sql_cursor.execute("SELECT id, name, capacity_tons, used_tons FROM Landfills;")
        data = sql_cursor.fetchall()

    landfills_list = [
        {
            "id": l[0],
            "name": l[1],
            "capacity_tons": l[2],
            "used_tons": l[3],
            "usage_percent": round((l[3] / l[2]) * 100, 2) if l[2] else 0
        }
        for l in data
    ]
    return jsonify(landfills_list), 200


# -------------------------------------------------
# ROUTES ENDPOINT (GET + POST)
# -------------------------------------------------
@app.route("/api/routes", methods=["GET", "POST"])
def routes():
    """GET returns routes; POST creates new route."""
    try:
        # ✅ Ensure table exists
        sql_cursor.execute("""
            CREATE TABLE IF NOT EXISTS Routes (
                name TEXT NOT NULL,
                area TEXT,
                truck_id VARCHAR REFERENCES Trucks(id)
            );
        """)
        sql_conn.commit()

        if request.method == "GET":
            sql_cursor.execute("""
                SELECT r.id, r.name, r.area, r.status, t.name AS truck_name
                FROM Routes r
                LEFT JOIN Trucks t ON r.truck_id = t.id
                ORDER BY r.created_at DESC
                LIMIT 20;
            """)
            rows = sql_cursor.fetchall()
            routes = [
                {
                    "id": r[0],
                    "name": r[1],
                    "area": r[2],
                    "status": r[3],
                    "truck_name": r[4] or "Unassigned"
                }
                for r in rows
            ]
            return jsonify(routes), 200

        # ✅ POST - Create new route
        if request.method == "POST":
            data = request.get_json()
            name = data.get("name")
            area = data.get("area")
            truck_ref = data.get("truck_id")

            if not all([name, area, truck_ref]):
                return jsonify({"message": "Missing route details"}), 400

            # 🔍 Allow both numeric truck_id or truck_name
            if isinstance(truck_ref, str) and not truck_ref.isdigit():
                sql_cursor.execute("SELECT id FROM Trucks WHERE name = %s", (truck_ref,))
                truck_row = sql_cursor.fetchone()
                if not truck_row:
                    return jsonify({"message": f"Truck '{truck_ref}' not found"}), 404
                truck_id = truck_row[0]
            else:
                truck_id = int(truck_ref)

            # ✅ Insert the route
            sql_cursor.execute("""
                INSERT INTO Routes (name, area, truck_id, status)
                VALUES (%s, %s, %s, 'Scheduled')
                RETURNING id;
            """, (name, area, truck_id))
            route_id = sql_cursor.fetchone()[0]
            sql_conn.commit()

            # ✅ Update truck status
            sql_cursor.execute("UPDATE Trucks SET status = 'On-Route' WHERE id = %s", (truck_id,))
            sql_conn.commit()

            return jsonify({
                "message": "Route created successfully",
                "route": {"id": route_id, "name": name, "area": area, "truck_id": truck_id}
            }), 201

    except Exception as e:
        sql_conn.rollback()
        print(f"❌ Error in /api/routes: {e}")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------
# TRIGGER COLLECTION ENDPOINT
# -------------------------------------------------
@app.route("/api/collect", methods=["POST"])
def collect():
    """Trigger waste collection and assign a truck."""
    bins = core.find_bins_for_collection(bin_readings_collection)
    if not bins:
        return jsonify({"message": "No bins need collection."}), 200

    truck = core.get_available_truck(sql_cursor)
    if not truck:
        return jsonify({"message": "No trucks available."}), 200

    route = core.create_optimized_route(bins)
    core.assign_truck_to_route(sql_cursor, sql_conn, truck[0], route)

    return jsonify({"message": f"Truck {truck[1]} assigned to route."}), 200


# -------------------------------------------------
# COMPLETE ROUTE ENDPOINT
# -------------------------------------------------
@app.route("/api/complete_route/<int:truck_id>", methods=["POST"])
def complete_route_endpoint(truck_id):
    """Mark a truck's route as complete and reset its status."""
    try:
        sql_cursor.execute("SELECT name, status FROM Trucks WHERE id = %s", (truck_id,))
        truck = sql_cursor.fetchone()

        if not truck:
            return jsonify({"message": "Truck not found."}), 404

        if truck[1] != 'On-Route':
            return jsonify({"message": f"Truck {truck[0]} is not on an active route."}), 400

        core.complete_route(sql_cursor, sql_conn, truck_id)
        return jsonify({"message": f"Route for truck {truck[0]} completed."}), 200
    except Exception as e:
        sql_conn.rollback()
        return jsonify({"message": f"Error completing route: {e}"}), 500


# -------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend is running ✅"}), 200


# -------------------------------------------------
# RUN APP
# -------------------------------------------------
if __name__ == "__main__":
    print("🚀 Starting Smart Waste Backend Server on http://localhost:5000")
    app.run(debug=True, port=5000)
