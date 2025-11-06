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
core.setup_databases(sql_cursor, sql_conn, bin_readings_collection)

# ---------------------------------------------
# API ROUTES
# ---------------------------------------------

@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    """Return dashboard summary data."""
    summary = core.get_dashboard_summary(sql_cursor, bin_readings_collection)
    return jsonify(summary), 200


@app.route("/api/bins", methods=["GET"])
def bins():
    """Return limited bin data."""
    bins_data = list(bin_readings_collection.find({}, {"_id": 0}).limit(100))
    return jsonify(bins_data), 200


@app.route("/api/trucks", methods=["GET"])
def trucks():
    """Return all trucks and their status."""
    sql_cursor.execute("SELECT id, name, status FROM Trucks;")
    data = sql_cursor.fetchall()
    trucks_list = [{"id": t[0], "name": t[1], "status": t[2]} for t in data]
    return jsonify(trucks_list), 200


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


@app.route("/", methods=["GET"])
def home():
    """Health check route."""
    return jsonify({"status": "Backend is running ✅"}), 200


# ---------------------------------------------
# RUN APP
# ---------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
