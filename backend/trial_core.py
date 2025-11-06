# backend/trial_core.py
import psycopg2
import pandas as pd
from pymongo import MongoClient
from math import radians, sin, cos, sqrt, atan2
from datetime import datetime
import random, json

# -----------------------------------------------------------
# DATABASE CONNECTIONS
# -----------------------------------------------------------
def get_connections():
    try:
        sql_conn = psycopg2.connect(
            dbname="smart_waste",
            user="postgres",
            password="5484",
            host="localhost",
            port="5432"
        )
        sql_cursor = sql_conn.cursor()
        mongo_client = MongoClient("mongodb://localhost:27017/")
        mongo_db = mongo_client["smart_waste_db"]
        bin_readings_collection = mongo_db["bin_readings"]
        print("✅ Connected to PostgreSQL & MongoDB")
        return sql_conn, sql_cursor, mongo_client, mongo_db, bin_readings_collection
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        raise

# -----------------------------------------------------------
# DATABASE SETUP
# -----------------------------------------------------------
def setup_databases(sql_cursor, sql_conn, bin_readings_collection, drop_existing=True):
    """
    Create required tables and indexes.
    By default this will DROP existing tables (useful in dev). Set drop_existing=False to avoid drops.
    """
    if drop_existing:
        # WARNING: dropping tables will remove existing data
        sql_cursor.execute("DROP VIEW IF EXISTS DashboardSummary CASCADE;")
        sql_cursor.execute("DROP TABLE IF EXISTS TruckRoutes CASCADE;")
        sql_cursor.execute("DROP TABLE IF EXISTS Transactions CASCADE;")
        sql_cursor.execute("DROP TABLE IF EXISTS MonitoringAlerts CASCADE;")
        sql_cursor.execute("DROP TABLE IF EXISTS Landfills CASCADE;")
        sql_cursor.execute("DROP TABLE IF EXISTS Trucks CASCADE;")
        sql_cursor.execute("DROP TABLE IF EXISTS Bins CASCADE;")
        sql_conn.commit()
        print("⚠️ Dropped existing tables/views (drop_existing=True).")

    # Core structured tables
    sql_cursor.execute("""
        CREATE TABLE IF NOT EXISTS Bins (
            serial TEXT PRIMARY KEY,
            address TEXT,
            lat DOUBLE PRECISION,
            lon DOUBLE PRECISION,
            status TEXT DEFAULT 'Active'
        );
    """)
    sql_cursor.execute("""
        CREATE TABLE IF NOT EXISTS Trucks (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            status TEXT DEFAULT 'Idle'
        );
    """)
    sql_cursor.execute("""
        CREATE TABLE IF NOT EXISTS Landfills (
            id SERIAL PRIMARY KEY,
            name TEXT UNIQUE,
            capacity_tons FLOAT,
            used_tons FLOAT DEFAULT 0
        );
    """)
    sql_cursor.execute("""
        CREATE TABLE IF NOT EXISTS Transactions (
            id SERIAL PRIMARY KEY,
            truck_id INT REFERENCES Trucks(id) ON DELETE CASCADE,
            bins_collected INT,
            waste_weight FLOAT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    sql_cursor.execute("""
        CREATE TABLE IF NOT EXISTS MonitoringAlerts (
            id SERIAL PRIMARY KEY,
            type TEXT,
            message TEXT,
            severity TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # TruckRoutes table (route history)
    sql_cursor.execute("""
        CREATE TABLE IF NOT EXISTS TruckRoutes (
            id SERIAL PRIMARY KEY,
            truck_id INT REFERENCES Trucks(id) ON DELETE SET NULL,
            route JSONB,
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        );
    """)

    sql_conn.commit()

    # Sample trucks (insert if not exists)
    trucks = [("Truck-01",), ("Truck-02",), ("Truck-03",)]
    for t in trucks:
        sql_cursor.execute("""
            INSERT INTO Trucks (name)
            VALUES (%s)
            ON CONFLICT (name) DO NOTHING;
        """, t)

    # Sample landfills
    landfills = [
        ("Central Landfill", 10000, 4000),
        ("East Waste Facility", 8000, 2500)
    ]
    for l in landfills:
        sql_cursor.execute("""
            INSERT INTO Landfills (name, capacity_tons, used_tons)
            VALUES (%s, %s, %s)
            ON CONFLICT (name) DO NOTHING;
        """, l)

    # Indexes for performance
    sql_cursor.execute("CREATE INDEX IF NOT EXISTS idx_bins_status ON Bins(status);")
    sql_cursor.execute("CREATE INDEX IF NOT EXISTS idx_trucks_status ON Trucks(status);")
    sql_conn.commit()

    # Dashboard summary view (properly terminated)
    sql_cursor.execute("""
        CREATE OR REPLACE VIEW DashboardSummary AS
        SELECT 
            (SELECT COUNT(*) FROM Bins) AS total_bins,
            (SELECT COUNT(*) FROM Bins WHERE status='In-Service') AS active_bins,
            (SELECT COUNT(*) FROM Bins WHERE status='Active') AS available_bins,
            (SELECT COUNT(*) FROM Trucks WHERE status='On-Route') AS active_trucks,
            (SELECT COUNT(*) FROM Trucks WHERE status='Idle') AS idle_trucks;
    """)
    sql_conn.commit()

    # MongoDB indexes
    bin_readings_collection.create_index([("serial", 1), ("time", -1)])
    bin_readings_collection.create_index([("status_current_fill_level", -1)])
    print("✅ PostgreSQL tables, indexes & MongoDB indexes ready.")

# -----------------------------------------------------------
# DATA LOADING
# -----------------------------------------------------------
def load_data_from_csv(sql_cursor, sql_conn, bin_readings_collection, filepath="smart-bins-argyle-square.csv"):
    try:
        df = pd.read_csv(filepath)
        print(f"📄 Loaded {len(df)} records from CSV.")
    except FileNotFoundError:
        print(f"❌ File not found: {filepath}")
        return

    df.dropna(subset=["latlong", "serial"], inplace=True)
    df[["lat", "lon"]] = df["latlong"].str.split(", ", expand=True).astype(float)
    df["time"] = pd.to_datetime(df["time"])

    unique_bins = df[["serial", "address", "lat", "lon"]].drop_duplicates(subset=["serial"])

    # Clear Bins table and re-insert (development-friendly)
    sql_cursor.execute("DELETE FROM Bins;")
    for _, row in unique_bins.iterrows():
        sql_cursor.execute("""
            INSERT INTO Bins (serial, address, lat, lon)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (serial) DO NOTHING;
        """, (row["serial"], row["address"], row["lat"], row["lon"]))
    sql_conn.commit()

    # Populate MongoDB sensor readings
    bin_readings_collection.delete_many({})
    bin_readings_collection.insert_many(df.to_dict("records"))
    print("✅ Databases populated with bin and reading data.")

# -----------------------------------------------------------
# BIN + ROUTE LOGIC
# -----------------------------------------------------------
def find_bins_for_collection(bin_readings_collection, fill_level_threshold=80):
    pipeline = [
        {"$sort": {"time": -1}},
        {"$group": {"_id": "$serial", "latest": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$latest"}},
        {"$match": {
            "$or": [
                {"bin_status": "Full"},
                {"status_current_fill_level": {"$gte": fill_level_threshold}}
            ]
        }}
    ]
    bins = list(bin_readings_collection.aggregate(pipeline))
    print(f"♻️ {len(bins)} bins need collection.")
    return bins

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dLat, dLon = radians(lat2 - lat1), radians(lon2 - lon1)
    a = sin(dLat/2)**2 + cos(radians(lat1))*cos(radians(lat2))*sin(dLon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1-a))

def create_optimized_route(bins, start_location=(-37.80, 144.96)):
    if not bins:
        return []
    route, unvisited = [], bins.copy()
    curr_lat, curr_lon = start_location
    while unvisited:
        nearest = min(unvisited, key=lambda b: haversine(curr_lat, curr_lon, b["lat"], b["lon"]))
        route.append(nearest)
        curr_lat, curr_lon = nearest["lat"], nearest["lon"]
        unvisited.remove(nearest)
    print(f"🗺️ Optimized route created for {len(route)} bins.")
    return route

# -----------------------------------------------------------
# TRUCK + ALERT LOGIC
# -----------------------------------------------------------
def get_available_truck(sql_cursor):
    sql_cursor.execute("SELECT id, name FROM Trucks WHERE status='Idle' LIMIT 1;")
    return sql_cursor.fetchone()

def assign_truck_to_route(sql_cursor, sql_conn, truck_id, route):
    try:
        sql_cursor.execute("UPDATE Trucks SET status='On-Route' WHERE id=%s;", (truck_id,))
        for bin_doc in route:
            sql_cursor.execute("UPDATE Bins SET status='In-Service' WHERE serial=%s;", (bin_doc["serial"],))

        # Log transaction
        sql_cursor.execute("""
            INSERT INTO Transactions (truck_id, bins_collected, waste_weight)
            VALUES (%s, %s, %s)
        """, (truck_id, len(route), round(random.uniform(100, 400), 2)))

        # Log route in TruckRoutes
        sql_cursor.execute("""
            INSERT INTO TruckRoutes (truck_id, route)
            VALUES (%s, %s)
        """, (truck_id, json.dumps([b["serial"] for b in route])))

        sql_conn.commit()
        print(f"✅ Truck {truck_id} assigned and route logged.")
    except Exception as e:
        sql_conn.rollback()
        print(f"❌ Truck assignment failed: {e}")

def complete_route(sql_cursor, sql_conn, truck_id):
    sql_cursor.execute("UPDATE Trucks SET status='Idle' WHERE id=%s;", (truck_id,))
    sql_cursor.execute("UPDATE Bins SET status='Active' WHERE status='In-Service';")
    sql_cursor.execute("UPDATE TruckRoutes SET completed_at=NOW() WHERE truck_id=%s AND completed_at IS NULL;", (truck_id,))
    sql_conn.commit()
    print(f"🟢 Truck {truck_id} route completed and reset.")

def generate_system_alerts(sql_cursor, sql_conn):
    alerts = [
        ("Sensor Error", "Bin sensor not responding", "High"),
        ("Overfilled Bin", "Bin exceeded safe limit", "Critical"),
        ("Truck Delay", "Truck delayed beyond schedule", "Medium"),
    ]
    for alert in alerts:
        sql_cursor.execute("""
            INSERT INTO MonitoringAlerts (type, message, severity)
            VALUES (%s, %s, %s)
        """, alert)
    sql_conn.commit()
    print("🔔 Monitoring alerts generated.")

def get_dashboard_summary(sql_cursor, bin_readings_collection):
    sql_cursor.execute("SELECT * FROM DashboardSummary;")
    row = sql_cursor.fetchone() or (0,0,0,0,0)
    full_bins = len(find_bins_for_collection(bin_readings_collection, 80))
    return {
        "total_bins": int(row[0]),
        "active_bins": int(row[1]),
        "available_bins": int(row[2]),
        "active_trucks": int(row[3]),
        "idle_trucks": int(row[4]),
        "full_bins": full_bins
    }

# -----------------------------------------------------------
# MAIN EXECUTION (Standalone test)
# -----------------------------------------------------------
if __name__ == "__main__":
    sql_conn, sql_cursor, mongo_client, mongo_db, bin_readings_collection = get_connections()
    setup_databases(sql_cursor, sql_conn, bin_readings_collection, drop_existing=True)
    load_data_from_csv(sql_cursor, sql_conn, bin_readings_collection)
    generate_system_alerts(sql_cursor, sql_conn)

    bins = find_bins_for_collection(bin_readings_collection)
    if bins:
        truck = get_available_truck(sql_cursor)
        if truck:
            route = create_optimized_route(bins)
            assign_truck_to_route(sql_cursor, sql_conn, truck[0], route)
            complete_route(sql_cursor, sql_conn, truck[0])

    print("📊 Dashboard Summary:", get_dashboard_summary(sql_cursor, bin_readings_collection))
    sql_conn.close()
    mongo_client.close()
    print("--- ✅ Script finished. Connections closed. ---")
