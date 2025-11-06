import { useState, useEffect } from 'react';
import { Trash2, Truck, Route, MapPin, TrendingUp, AlertCircle, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBins: 0,
    fullBins: 0,
    activeTrucks: 0,
    totalTrucks: 0,
    activeRoutes: 0,
    alerts: 0,
    landfillUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/dashboard`);
      if (!response.ok) throw new Error("Failed to fetch dashboard data");

      const data = await response.json();

      // ✅ Adjust this mapping based on your Flask /api/dashboard output
      setStats({
        totalBins: data.total_bins || 0,
        fullBins: data.full_bins || 0,
        activeTrucks: data.active_trucks || 0,
        totalTrucks: data.total_trucks || data.active_trucks || 0,
        activeRoutes: data.active_routes || 0,
        alerts: data.alerts || 0,
        landfillUsage: data.landfill_usage || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">System Overview</h3>
            <p className="text-sm text-slate-500">Real-time monitoring across all operations</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* BINS */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Bins</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{stats.totalBins}</p>
            <p className="text-sm text-slate-500 mt-1">Total active bins</p>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Need attention</span>
                <span className="font-semibold text-amber-600">{stats.fullBins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TRUCKS */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Fleet</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{stats.totalTrucks}</p>
            <p className="text-sm text-slate-500 mt-1">Total trucks</p>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">On route</span>
                <span className="font-semibold text-emerald-600">{stats.activeTrucks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROUTES */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Route className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Routes</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{stats.activeRoutes}</p>
            <p className="text-sm text-slate-500 mt-1">Active routes</p>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Efficiency</span>
                <span className="font-semibold text-purple-600">94%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTS */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Alerts</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-800">{stats.alerts}</p>
            <p className="text-sm text-slate-500 mt-1">Active alerts</p>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Priority</span>
                <span className="font-semibold text-red-600">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LANDFILL USAGE */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h4 className="font-semibold text-slate-800">Collection Efficiency</h4>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end justify-between space-x-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const height = [85, 92, 78, 95, 88, 72, 90][idx];
                return (
                  <div key={day} className="flex-1 flex flex-col items-center space-y-2">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                        style={{ height: `${height}%` }}
                      >
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {height}% efficient
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-600">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LANDFILL PANEL */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 text-white shadow-lg">
            <MapPin className="w-8 h-8 mb-3" />
            <h4 className="font-semibold text-lg mb-2">Landfill Capacity</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">Current Usage</span>
                  <span className="text-xl font-bold">{stats.landfillUsage}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
                    style={{ width: `${stats.landfillUsage}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs opacity-75">All sites operating within capacity</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Quick Stats</span>
              </h4>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Avg Response Time</span>
                <span className="font-semibold text-slate-800">12 min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Fuel Efficiency</span>
                <span className="font-semibold text-emerald-600">+18%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Collections Today</span>
                <span className="font-semibold text-slate-800">142</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM HEALTH */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">System Health: Excellent</h4>
            <p className="text-sm text-slate-600 max-w-2xl">
              All subsystems are operational. Real-time monitoring active. API integration endpoints ready for backend connection.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
