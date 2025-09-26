import psycopg2
import pandas as pd
from pymongo import MongoClient
from math import radians, sin, cos, sqrt, atan2

# --- 1. SETUP AND INITIALIZATION ---
# Connect to databases
try:
    # PostgreSQL (Relational) Database for static data
    sql_conn = psycopg2.connect(
        dbname="smart_waste",      # your postgres db name
        user="postgres",           # your postgres username
        password="5484",   # your postgres password
        host="localhost",
        port="5432"
    )
    sql_cursor = sql_conn.cursor()
    print("✅ Successfully connected to PostgreSQL.")

    # MongoDB (NoSQL) for real-time sensor data
    mongo_client = MongoClient('mongodb://localhost:27017/')
    mongo_db = mongo_client['smart_waste_db']
    bin_readings_collection = mongo_db['bin_readings']
    print("✅ Successfully connected to MongoDB.")

except Exception as e:
    print(f"❌ Database connection error: {e}")
    exit()

def setup_databases():
    """Create tables in PostgreSQL and indexes in MongoDB."""
    sql_cursor.execute('''
        CREATE TABLE IF NOT EXISTS Bins (
            serial TEXT PRIMARY KEY,
            address TEXT,
            lat DOUBLE PRECISION,
            lon DOUBLE PRECISION,
            status TEXT DEFAULT 'Active'
        )
    ''')
    sql_cursor.execute('''
        CREATE TABLE IF NOT EXISTS Trucks (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            status TEXT DEFAULT 'Idle'
        )
    ''')
    # Insert a sample truck if not exists
    sql_cursor.execute("""
        INSERT INTO Trucks (id, name) 
        VALUES (1, 'Truck-01')
        ON CONFLICT (id) DO NOTHING
    """)
    sql_conn.commit()
    print("PostgreSQL tables created and sample truck added.")

    # MongoDB indexes for performance
    bin_readings_collection.create_index([("serial", 1), ("time", -1)])
    bin_readings_collection.create_index([("status_current_fill_level", -1)])
    print("MongoDB indexes created.")

# --- 2. DATA LOADING AND PROCESSING ---
def load_data_from_csv(filepath='smart-bins-argyle-square.csv'):
    """Load data from CSV, clean it, and populate databases."""
    try:
        df = pd.read_csv(filepath)
        print(f"Loaded {len(df)} records from CSV.")
    except FileNotFoundError:
        print(f"❌ Error: The file '{filepath}' was not found.")
        return

    # Clean data
    df.dropna(subset=['latlong', 'serial'], inplace=True)
    df[['lat', 'lon']] = df['latlong'].str.split(', ', expand=True).astype(float)
    df['time'] = pd.to_datetime(df['time'])

    # Insert bins into PostgreSQL
    unique_bins = df[['serial', 'address', 'lat', 'lon']].drop_duplicates(subset=['serial'])
    sql_cursor.execute("DELETE FROM Bins")  # clear old
    for _, row in unique_bins.iterrows():
        sql_cursor.execute("""
            INSERT INTO Bins (serial, address, lat, lon)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (serial) DO NOTHING
        """, (row['serial'], row['address'], row['lat'], row['lon']))
    sql_conn.commit()
    print(f"Populated PostgreSQL with {len(unique_bins)} unique bins.")

    # Insert readings into MongoDB
    bin_readings_collection.delete_many({})
    bin_readings_collection.insert_many(df.to_dict('records'))
    print(f"Populated MongoDB with {len(df)} sensor readings.")

# --- 3. CORE LOGIC: BIN IDENTIFICATION & ROUTE OPTIMIZATION ---
def find_bins_for_collection(fill_level_threshold=75):
    """Find bins that are 'Full' or above the threshold."""
    pipeline = [
        {'$sort': {'time': -1}},
        {'$group': {
            '_id': '$serial',
            'latest_reading': {'$first': '$$ROOT'}
        }},
        {'$replaceRoot': {'newRoot': '$latest_reading'}},
        {'$match': {
            '$or': [
                {'bin_status': 'Full'},
                {'status_current_fill_level': {'$gte': fill_level_threshold}}
            ]
        }}
    ]
    full_bins = list(bin_readings_collection.aggregate(pipeline))
    print(f"Found {len(full_bins)} bins needing collection.")
    return full_bins

def haversine(lat1, lon1, lat2, lon2):
    """Distance between two coordinates (km)."""
    R = 6371
    dLat, dLon = radians(lat2 - lat1), radians(lon2 - lon1)
    a = sin(dLat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

def create_optimized_route(bins_to_collect, start_location=(0, 0)):
    """Nearest Neighbor route optimization."""
    if not bins_to_collect:
        return []

    bin_locations = {
        bin_doc['serial']: (bin_doc['lat'], bin_doc['lon'])
        for bin_doc in bins_to_collect
    }

    route = []
    current_lat, current_lon = start_location
    unvisited = list(bin_locations.keys())

    while unvisited:
        nearest_bin = min(
            unvisited,
            key=lambda s: haversine(
                current_lat, current_lon,
                bin_locations[s][0], bin_locations[s][1]
            )
        )
        route.append(nearest_bin)
        unvisited.remove(nearest_bin)
        current_lat, current_lon = bin_locations[nearest_bin]

    print("Generated optimized route:", " -> ".join(route))
    return route

# --- 4. TRANSACTION SIMULATION ---
def assign_truck_to_route(truck_id, route):
    """Assign truck to route, mark bins as in-service."""
    print(f"\n--- Assigning Truck {truck_id} ---")
    sql_cursor.execute("SELECT status FROM Trucks WHERE id = %s", (truck_id,))
    result = sql_cursor.fetchone()
    if not result:
        print(f"❌ Truck {truck_id} not found.")
        return False
    truck_status = result[0]

    if truck_status != 'Idle':
        print(f"❌ Truck {truck_id} is not available.")
        return False

    try:
        sql_cursor.execute("UPDATE Trucks SET status = 'On-Route' WHERE id = %s", (truck_id,))
        for bin_serial in route:
            sql_cursor.execute("UPDATE Bins SET status = 'In-Service' WHERE serial = %s", (bin_serial,))
        sql_conn.commit()
        print(f"✅ Truck {truck_id} assigned. Bins are now 'In-Service'.")
        return True
    except Exception as e:
        sql_conn.rollback()
        print(f"❌ Transaction failed: {e}")
        return False

# --- 5. MAIN EXECUTION ---
if __name__ == '__main__':
    setup_databases()
    load_data_from_csv()

    bins_to_collect = find_bins_for_collection(fill_level_threshold=80)

    if bins_to_collect:
        start_location = (-37.80, 144.96)  # Example start
        optimized_route = create_optimized_route(bins_to_collect, start_location)
        assign_truck_to_route(1, optimized_route)
    else:
        print("\nNo bins require collection.")

    sql_conn.close()
    mongo_client.close()
    print("\n--- Script finished. Connections closed. ---")
