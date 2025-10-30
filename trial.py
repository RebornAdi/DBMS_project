import psycopg2
import pandas as pd
from pymongo import MongoClient
from math import radians, sin, cos, sqrt, atan2

# Setup database connections
try:
    # PostgreSQL connection (Structured Data)
    sql_conn = psycopg2.connect(
        dbname="smart_waste",
        user="postgres",
        password="5484",
        host="localhost",
        port="5432"
    )
    sql_cursor = sql_conn.cursor()
    print("Successfully connected to PostgreSQL.")

    # MongoDB connection (Unstructured Data)
    mongo_client = MongoClient('mongodb://localhost:27017/')
    mongo_db = mongo_client['smart_waste_db']
    bin_readings_collection = mongo_db['bin_readings']
    print("Successfully connected to MongoDB.")

except Exception as e:
    print(f"Database connection error: {e}")
    exit()

# -----------------------------------------------------------
# DATABASE SETUP
# -----------------------------------------------------------
def setup_databases():
    """Create tables in PostgreSQL and indexes in MongoDB."""
    # Create structured tables for bins and trucks
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

    # Insert sample trucks if they don't exist
    trucks = [('Truck-01',), ('Truck-02',), ('Truck-03',)]
    for t in trucks:
        sql_cursor.execute("""
            INSERT INTO Trucks (name)
            VALUES (%s)
            ON CONFLICT DO NOTHING
        """, t)

    sql_conn.commit()
    print("PostgreSQL tables created and sample trucks added.")

    # MongoDB Indexing (Query Optimization)
    bin_readings_collection.create_index([("serial", 1), ("time", -1)])
    bin_readings_collection.create_index([("status_current_fill_level", -1)])
    print("MongoDB indexes created.")

# -----------------------------------------------------------
# DATA PROCESSING AND LOADING
# -----------------------------------------------------------
def load_data_from_csv(filepath='smart-bins-argyle-square.csv'):
    """Load data from CSV, clean it, and populate databases."""
    try:
        df = pd.read_csv(filepath)
        print(f"Loaded {len(df)} records from CSV.")
    except FileNotFoundError:
        print(f"Error: The file '{filepath}' was not found.")
        return

    # Clean and transform data
    df.dropna(subset=['latlong', 'serial'], inplace=True)
    df[['lat', 'lon']] = df['latlong'].str.split(', ', expand=True).astype(float)
    df['time'] = pd.to_datetime(df['time'])

    # Insert unique bins into PostgreSQL
    unique_bins = df[['serial', 'address', 'lat', 'lon']].drop_duplicates(subset=['serial'])
    sql_cursor.execute("DELETE FROM Bins")
    for _, row in unique_bins.iterrows():
        sql_cursor.execute("""
            INSERT INTO Bins (serial, address, lat, lon)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (serial) DO NOTHING
        """, (row['serial'], row['address'], row['lat'], row['lon']))
    sql_conn.commit()
    print(f"Populated PostgreSQL with {len(unique_bins)} unique bins.")

    # Insert sensor readings into MongoDB
    bin_readings_collection.delete_many({})
    bin_readings_collection.insert_many(df.to_dict('records'))
    print(f"Populated MongoDB with {len(df)} sensor readings.")

# -----------------------------------------------------------
# CORE LOGIC: FINDING BINS THAT NEED COLLECTION
# -----------------------------------------------------------
def find_bins_for_collection(fill_level_threshold=75):
    """Find bins that are 'Full' or above the fill level threshold."""
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

# -----------------------------------------------------------
# ROUTE OPTIMIZATION USING HAVERSINE FORMULA
# -----------------------------------------------------------
def haversine(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates (km)."""
    R = 6371  # Earth's radius
    dLat, dLon = radians(lat2 - lat1), radians(lon2 - lon1)
    a = sin(dLat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

def create_optimized_route(bins_to_collect, start_location=(0, 0)):
    """Optimize route using Nearest Neighbor approach."""
    if not bins_to_collect:
        return []

    bin_locations = {
        bin_doc['serial']: (bin_doc['lat'], bin_doc['lon'])
        for bin_doc in bins_to_collect
    }

    route = []
    current_lat, current_lon = start_location
    unvisited = list(bin_locations.keys())

    # Nearest neighbor logic
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

# -----------------------------------------------------------
# TRUCK SCHEDULING, ASSIGNMENT & DEALLOCATION
# -----------------------------------------------------------
def get_available_truck():
    """Fetch the first available (Idle) truck."""
    sql_cursor.execute("SELECT id, name FROM Trucks WHERE status = 'Idle' LIMIT 1;")
    result = sql_cursor.fetchone()
    if result:
        truck_id, truck_name = result
        print(f"Available Truck Found: {truck_name} (ID: {truck_id})")
        return truck_id
    else:
        print("No idle trucks available at the moment.")
        return None

def assign_truck_to_route(truck_id, route):
    """Assign a given truck to a route and mark bins as In-Service."""
    print(f"\n--- Assigning Truck {truck_id} to route ---")

    sql_cursor.execute("SELECT status FROM Trucks WHERE id = %s", (truck_id,))
    result = sql_cursor.fetchone()

    if not result:
        print(f"Truck {truck_id} not found.")
        return False

    truck_status = result[0]
    if truck_status != 'Idle':
        print(f"Truck {truck_id} is not available.")
        return False

    try:
        # Begin transaction: mark truck as busy
        sql_cursor.execute("UPDATE Trucks SET status = 'On-Route' WHERE id = %s", (truck_id,))
        for bin_serial in route:
            sql_cursor.execute(
                "UPDATE Bins SET status = 'In-Service' WHERE serial = %s AND status = 'Active';",
                (bin_serial,)
            )
        sql_conn.commit()
        print(f"Truck {truck_id} successfully assigned. Bins marked 'In-Service'.")
        return True
    except Exception as e:
        sql_conn.rollback()
        print(f"Transaction failed: {e}")
        return False

def complete_route(truck_id):
    """Mark a truck's route as complete and reset statuses."""
    print(f"\n--- Completing Route for Truck {truck_id} ---")
    try:
        # Set truck to Idle and free bins
        sql_cursor.execute("UPDATE Trucks SET status = 'Idle' WHERE id = %s;", (truck_id,))
        sql_cursor.execute("UPDATE Bins SET status = 'Active' WHERE status = 'In-Service';")
        sql_conn.commit()
        print(f"Truck {truck_id} is now Idle. All bins reset to Active.")
    except Exception as e:
        sql_conn.rollback()
        print(f"Error completing route for truck {truck_id}: {e}")

# -----------------------------------------------------------
# MAIN EXECUTION
# -----------------------------------------------------------
if __name__ == '__main__':
    setup_databases()
    load_data_from_csv()

    # STEP 1: Find bins needing collection
    bins_to_collect = find_bins_for_collection(fill_level_threshold=80)

    if bins_to_collect:
        start_location = (-37.80, 144.96)  # Example depot

        # STEP 2: Assign available truck automatically
        truck_id = get_available_truck()
        if truck_id:
            optimized_route = create_optimized_route(bins_to_collect, start_location)
            success = assign_truck_to_route(truck_id, optimized_route)

            if success:
                # Simulate completion of the route after collection
                complete_route(truck_id)
        else:
            print("⚠️ No available trucks — try again later.")
    else:
        print("\nNo bins require collection at this time.")

    # Close connections
    sql_conn.close()
    mongo_client.close()
    print("\n--- Script finished. Connections closed. ---")
