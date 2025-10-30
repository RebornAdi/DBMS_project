import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Bin = {
  id: string;
  bin_number: string;
  location_name: string;
  latitude: number;
  longitude: number;
  fill_level: number;
  status: 'Empty' | 'Half' | 'Full' | 'Overflow';
  capacity: number;
  last_collection: string;
  created_at: string;
};

export type Truck = {
  id: string;
  truck_number: string;
  driver_name: string;
  status: 'Available' | 'On Route' | 'Maintenance';
  capacity: number;
  current_load: number;
  latitude: number | null;
  longitude: number | null;
  last_maintenance: string | null;
  created_at: string;
};

export type Route = {
  id: string;
  route_name: string;
  truck_id: string | null;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  scheduled_date: string;
  start_time: string | null;
  end_time: string | null;
  bin_sequence: string[];
  distance_km: number | null;
  created_at: string;
};

export type Landfill = {
  id: string;
  name: string;
  location: string;
  total_capacity: number;
  current_usage: number;
  usage_percentage: number;
  status: 'Active' | 'Near Full' | 'Full' | 'Closed';
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type MonitoringAlert = {
  id: string;
  alert_type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  bin_id: string | null;
  truck_id: string | null;
  route_id: string | null;
  is_resolved: boolean;
  created_at: string;
  resolved_at: string | null;
};

export type Transaction = {
  id: string;
  transaction_type: string;
  truck_id: string | null;
  bin_id: string | null;
  route_id: string | null;
  status: 'Success' | 'Failed' | 'Pending';
  details: Record<string, any>;
  created_at: string;
};
