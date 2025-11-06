# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import trial_core as core

# ---------------------------------------------
# INITIALIZE FLASK APP
# ---------------------------------------------
app = Flask(__name__)
CORS(app)

# ---------------------------------------------
# SETUP DATABASE CONNECTIONS
# ---------------------------------------------
sql_conn, sql_cursor, mongo_client, mongo_db, bin_readings_collection = core.get_connections()
core.setup_databases(sql_cursor, sql_conn, bin_readings_collection, drop_existing=False)

# ---------------------------------------------
# AUTO-LOAD DATA IF EMPTY
# ---------------------------------------------
if bin_readings_collection.count_documents({}) == 0:
    print("⚠️ No bin data found in MongoDB. Loading from CSV...")
    core.load_data_from_csv(sql_cursor, sql_conn, bin_readings_collection)
    core.generate_system_alerts(sql_cursor, sql_conn)
else:
    print(f"✅ MongoDB already contains {bin_readings_collection.count_documents({})} records. Skipping CSV load.")

# ---------------------------------------------
# DASHBOARD ENDPOINT
# ---------------------------------------------
@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    """Return frontend-ready dashboard summary data."""
    summary = core.get_dashboard_summary(sql_cursor, bin_readings_collection)

    response = {
        "total_bins": summary.get("total_bins", 0) or summary.get("available_bins", 0),
        "full_bins": summary.get("full_bins", 0),
        "active_trucks": summary.get("active_trucks", 0),
        "total_trucks": summary.get("idle_trucks", 0) + summary.get("active_trucks", 0),
        "active_routes": summary.get("active_routes", 0),
        "alerts": summary.get("alerts", 3),
        "landfill_usage": summary.get("landfill_usage", 68),
    }

    return jsonify(response), 200


# ---------------------------------------------
# BINS ENDPOINT
# ---------------------------------------------
@app.route("/api/bins", methods=["GET"])
def bins():
    """Return standardized bin data for frontend."""
    raw_bins = list(bin_readings_collection.find({}, {"_id": 0}).limit(100))

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



# ---------------------------------------------
# TRUCKS ENDPOINT
# ---------------------------------------------
@app.route("/api/trucks", methods=["GET"])
def trucks():
    """Return all trucks and their status."""
    sql_cursor.execute("SELECT id, name, status FROM Trucks;")
    data = sql_cursor.fetchall()
    trucks_list = [{"id": t[0], "name": t[1], "status": t[2]} for t in data]
    return jsonify(trucks_list), 200


# ---------------------------------------------
# ALERTS ENDPOINT
# ---------------------------------------------
@app.route("/api/alerts", methods=["GET"])
def alerts():
    """Return recent system alerts."""
    sql_cursor.execute("""
        SELECT type, message, severity, timestamp 
        FROM MonitoringAlerts 
        ORDER BY timestamp DESC 
        LIMIT 10;
    """)
    data = sql_cursor.fetchall()
    alerts_list = [
        {"type": a[0], "message": a[1], "severity": a[2], "timestamp": str(a[3])}
        for a in data
    ]
    return jsonify(alerts_list), 200


# ---------------------------------------------
# LANDFILLS ENDPOINT
# ---------------------------------------------
@app.route("/api/landfills", methods=["GET"])
def landfills():
    """Return landfill capacity and usage."""
    sql_cursor.execute("""
        SELECT id, name, capacity_tons, used_tons
        FROM Landfills;
    """)
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


# ---------------------------------------------
# MONITORING ENDPOINT
# ---------------------------------------------
@app.route("/api/monitoring", methods=["GET"])
def monitoring():
    """Return live bin monitoring data."""
    pipeline = [
        {"$sort": {"time": -1}},
        {"$group": {"_id": "$serial", "latest": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$latest"}},
    ]
    data = list(bin_readings_collection.aggregate(pipeline))
    for d in data:
        d.pop("_id", None)
    return jsonify(data), 200


# ---------------------------------------------
# TRIGGER COLLECTION ENDPOINT
# ---------------------------------------------
@app.route("/api/collect", methods=["POST"])
def collect():
    """Trigger waste collection and route assignment."""
    bins = core.find_bins_for_collection(bin_readings_collection)
    if not bins:
        return jsonify({"message": "No bins need collection."}), 200

    truck = core.get_available_truck(sql_cursor)
    if not truck:
        return jsonify({"message": "No trucks available."}), 200

    route = core.create_optimized_route(bins)
    core.assign_truck_to_route(sql_cursor, sql_conn, truck[0], route)
    core.complete_route(sql_cursor, sql_conn, truck[0])

    return jsonify({"message": f"Truck {truck[1]} assigned and route completed."}), 200


# ---------------------------------------------
# HEALTH CHECK ENDPOINT
# ---------------------------------------------
@app.route("/", methods=["GET"])
def home():
    """Health check route."""
    return jsonify({"status": "Backend is running ✅"}), 200


# ---------------------------------------------
# MAIN EXECUTION
# ---------------------------------------------
if __name__ == "__main__":
    print("🚀 Starting Smart Waste Backend Server on http://localhost:5000")
    app.run(debug=True, port=5000)
