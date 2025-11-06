# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import trial_core as core
from datetime import datetime

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

    # Active routes (Routes table)
    sql_cursor.execute("SELECT COUNT(*) FROM Routes WHERE status='In Progress';")
    active_routes = (sql_cursor.fetchone() or (0,))[0]

    # Alerts count
    sql_cursor.execute("SELECT COUNT(*) FROM MonitoringAlerts;")
    alerts = (sql_cursor.fetchone() or (0,))[0]

    # Landfill usage (aggregate)
    sql_cursor.execute("SELECT COALESCE(SUM(used_tons),0), COALESCE(SUM(capacity_tons),0) FROM Landfills;")
    used, cap = sql_cursor.fetchone() or (0, 0)
    landfill_usage = round((used / cap) * 100, 2) if cap else 0

    # Total trucks
    sql_cursor.execute("SELECT COUNT(*) FROM Trucks;")
    total_trucks = (sql_cursor.fetchone() or (0,))[0]

    response = {
        "total_bins": summary.get("total_bins", 0) or summary.get("available_bins", 0),
        "full_bins": summary.get("full_bins", 0),
        "active_trucks": summary.get("active_trucks", 0),
        "total_trucks": total_trucks,
        "active_routes": active_routes,
        "alerts": alerts,
        "landfill_usage": landfill_usage,
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
# TRUCKS ENDPOINT (detailed fields)
# ---------------------------------------------
@app.route("/api/trucks", methods=["GET"])
def trucks():
    """Return all trucks with detailed fields for frontend."""
    sql_cursor.execute("""
        SELECT id, truck_number, name, driver_name, capacity, current_load, status
        FROM Trucks
        ORDER BY truck_number;
    """)
    rows = sql_cursor.fetchall()
    trucks_list = [{
        "id": r[0],
        "truck_number": r[1],
        "name": r[2],
        "driver_name": r[3],
        "capacity": r[4],
        "current_load": r[5],
        "status": r[6],
    } for r in rows]
    return jsonify(trucks_list), 200

# ---------------------------------------------
# ROUTES ENDPOINT
# ---------------------------------------------
@app.route("/api/routes", methods=["GET"])
def routes():
    """Return recent/scheduled routes for frontend."""
    sql_cursor.execute("""
        SELECT id, route_name, status, scheduled_date, distance_km, bin_sequence, truck_id
        FROM Routes
        ORDER BY scheduled_date DESC
        LIMIT 50;
    """)
    rows = sql_cursor.fetchall()
    routes_list = [{
        "id": r[0],
        "route_name": r[1],
        "status": r[2],
        "scheduled_date": r[3].isoformat() if r[3] else None,
        "distance_km": r[4],
        "bin_sequence": r[5],
        "truck_id": r[6],
    } for r in rows]
    return jsonify(routes_list), 200

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
        {"type": a[0], "message": a[1], "severity": a[2], "timestamp": a[3].isoformat() if a[3] else None}
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
    """Return latest reading per bin (live view)."""
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

    truck = core.get_available_truck(sql_cursor)  # (id, truck_number, name)
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
    return jsonify({"status": "Backend is running ✅"}), 200

# ---------------------------------------------
# MAIN EXECUTION
# ---------------------------------------------
if __name__ == "__main__":
    print("🚀 Starting Smart Waste Backend Server on http://localhost:5000")
    app.run(debug=True, port=5000)
