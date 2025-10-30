/*
  # Smart Waste Management System Database Schema

  ## Overview
  Complete database schema for a Smart Waste Management System (SWMS) supporting
  bins, trucks, routes, landfills, real-time monitoring, and transaction logging.

  ## New Tables

  ### 1. `bins`
  Smart waste bins with real-time fill level monitoring
  - `id` (uuid, primary key) - Unique bin identifier
  - `bin_number` (text, unique) - Human-readable bin number (e.g., "BIN-001")
  - `location_name` (text) - Location description (e.g., "Central Park North")
  - `latitude` (numeric) - GPS latitude coordinate
  - `longitude` (numeric) - GPS longitude coordinate
  - `fill_level` (integer) - Current fill percentage (0-100)
  - `status` (text) - Current status: 'Empty', 'Half', 'Full', 'Overflow'
  - `capacity` (integer) - Total capacity in liters
  - `last_collection` (timestamptz) - Last emptied timestamp
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. `trucks`
  Waste collection trucks and their operational status
  - `id` (uuid, primary key) - Unique truck identifier
  - `truck_number` (text, unique) - Truck registration/ID
  - `driver_name` (text) - Assigned driver name
  - `status` (text) - 'Available', 'On Route', 'Maintenance'
  - `capacity` (integer) - Truck capacity in liters
  - `current_load` (integer) - Current load in liters
  - `latitude` (numeric) - Current GPS latitude
  - `longitude` (numeric) - Current GPS longitude
  - `last_maintenance` (timestamptz) - Last maintenance date
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. `routes`
  Optimized collection routes for trucks
  - `id` (uuid, primary key) - Unique route identifier
  - `route_name` (text) - Descriptive route name
  - `truck_id` (uuid, foreign key) - Assigned truck
  - `status` (text) - 'Scheduled', 'In Progress', 'Completed'
  - `scheduled_date` (timestamptz) - Scheduled execution date
  - `start_time` (timestamptz) - Actual start time
  - `end_time` (timestamptz) - Actual completion time
  - `bin_sequence` (jsonb) - Ordered array of bin IDs to collect
  - `distance_km` (numeric) - Total route distance
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. `landfills`
  Landfill sites with capacity tracking
  - `id` (uuid, primary key) - Unique landfill identifier
  - `name` (text) - Landfill site name
  - `location` (text) - Physical address/description
  - `total_capacity` (integer) - Total capacity in tons
  - `current_usage` (integer) - Current usage in tons
  - `usage_percentage` (integer) - Calculated usage percentage
  - `status` (text) - 'Active', 'Near Full', 'Full', 'Closed'
  - `latitude` (numeric) - GPS latitude
  - `longitude` (numeric) - GPS longitude
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. `monitoring_alerts`
  Real-time monitoring alerts and notifications
  - `id` (uuid, primary key) - Unique alert identifier
  - `alert_type` (text) - 'Bin Overflow', 'Truck Breakdown', 'Route Delay', etc.
  - `severity` (text) - 'Low', 'Medium', 'High', 'Critical'
  - `message` (text) - Alert message content
  - `bin_id` (uuid, nullable, foreign key) - Related bin if applicable
  - `truck_id` (uuid, nullable, foreign key) - Related truck if applicable
  - `route_id` (uuid, nullable, foreign key) - Related route if applicable
  - `is_resolved` (boolean) - Resolution status
  - `created_at` (timestamptz) - Alert creation time
  - `resolved_at` (timestamptz, nullable) - Resolution time

  ### 6. `transactions`
  Transaction and safety logs for truck-bin assignments
  - `id` (uuid, primary key) - Unique transaction identifier
  - `transaction_type` (text) - 'Collection', 'Assignment', 'Maintenance', etc.
  - `truck_id` (uuid, foreign key) - Involved truck
  - `bin_id` (uuid, nullable, foreign key) - Involved bin if applicable
  - `route_id` (uuid, nullable, foreign key) - Associated route
  - `status` (text) - 'Success', 'Failed', 'Pending'
  - `details` (jsonb) - Additional transaction details
  - `created_at` (timestamptz) - Transaction timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Policies allow authenticated users (admins) to perform all operations
  - In production, implement role-based access control for different admin levels

  ## Important Notes
  - All tables use UUIDs for primary keys with automatic generation
  - Timestamps use `timestamptz` for timezone awareness
  - JSONB fields store complex data structures (bin sequences, transaction details)
  - Foreign key constraints ensure referential integrity
  - Indexes on frequently queried fields (status, created_at) for performance
*/

-- Create bins table
CREATE TABLE IF NOT EXISTS bins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bin_number text UNIQUE NOT NULL,
  location_name text NOT NULL,
  latitude numeric(10, 7) NOT NULL,
  longitude numeric(10, 7) NOT NULL,
  fill_level integer DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
  status text DEFAULT 'Empty' CHECK (status IN ('Empty', 'Half', 'Full', 'Overflow')),
  capacity integer NOT NULL DEFAULT 240,
  last_collection timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create trucks table
CREATE TABLE IF NOT EXISTS trucks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_number text UNIQUE NOT NULL,
  driver_name text NOT NULL,
  status text DEFAULT 'Available' CHECK (status IN ('Available', 'On Route', 'Maintenance')),
  capacity integer NOT NULL DEFAULT 5000,
  current_load integer DEFAULT 0,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  last_maintenance timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name text NOT NULL,
  truck_id uuid REFERENCES trucks(id) ON DELETE SET NULL,
  status text DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed')),
  scheduled_date timestamptz NOT NULL,
  start_time timestamptz,
  end_time timestamptz,
  bin_sequence jsonb DEFAULT '[]'::jsonb,
  distance_km numeric(8, 2),
  created_at timestamptz DEFAULT now()
);

-- Create landfills table
CREATE TABLE IF NOT EXISTS landfills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  total_capacity integer NOT NULL,
  current_usage integer DEFAULT 0,
  usage_percentage integer GENERATED ALWAYS AS (
    CASE 
      WHEN total_capacity > 0 THEN (current_usage * 100 / total_capacity)
      ELSE 0
    END
  ) STORED,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'Near Full', 'Full', 'Closed')),
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_at timestamptz DEFAULT now()
);

-- Create monitoring_alerts table
CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL,
  severity text DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  message text NOT NULL,
  bin_id uuid REFERENCES bins(id) ON DELETE CASCADE,
  truck_id uuid REFERENCES trucks(id) ON DELETE CASCADE,
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type text NOT NULL,
  truck_id uuid REFERENCES trucks(id) ON DELETE CASCADE,
  bin_id uuid REFERENCES bins(id) ON DELETE CASCADE,
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  status text DEFAULT 'Pending' CHECK (status IN ('Success', 'Failed', 'Pending')),
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bins_status ON bins(status);
CREATE INDEX IF NOT EXISTS idx_bins_fill_level ON bins(fill_level);
CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(status);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_routes_scheduled_date ON routes(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON monitoring_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON monitoring_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE landfills ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users (admins)
CREATE POLICY "Admins can view all bins"
  ON bins FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert bins"
  ON bins FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update bins"
  ON bins FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete bins"
  ON bins FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can view all trucks"
  ON trucks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert trucks"
  ON trucks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update trucks"
  ON trucks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete trucks"
  ON trucks FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can view all routes"
  ON routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert routes"
  ON routes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update routes"
  ON routes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete routes"
  ON routes FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can view all landfills"
  ON landfills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert landfills"
  ON landfills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update landfills"
  ON landfills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete landfills"
  ON landfills FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can view all alerts"
  ON monitoring_alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert alerts"
  ON monitoring_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update alerts"
  ON monitoring_alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete alerts"
  ON monitoring_alerts FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (true);