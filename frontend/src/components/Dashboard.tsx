import { useState, useEffect } from 'react';
import { Trash2, Truck, Route, MapPin, TrendingUp, AlertCircle, Activity } from 'lucide-react';

interface DashboardStats {
  total_bins: number;
  full_bins: number;
  active_trucks: number;
  total_trucks: number;
  active_routes: number;
  alerts: number;
  landfill_usage: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollecting, setIsCollecting] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Fetch dashboard stats from backend API
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard`);
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, [API_BASE]);

  // Handle triggering the collection
  const handleCollect = async () => {
    setIsCollecting(true);
    try {
      const res = await fetch(`${API_BASE}/api/collect`, {
        method: "POST",
      });
      const data = await res.json();

      alert(data.message); 
      await fetchStats(); // Refresh stats after action
    } catch (error) {
      console.error("Error triggering collection:", error);
      alert("An error occurred while triggering collection.");
    } finally {
      setIsCollecting(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
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
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm shadow-sm border border-slate-200">
            Generate Report
          </button>
          
          <button
            onClick={handleCollect}
            disabled={isCollecting}
            className={`px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm ${
              isCollecting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCollecting ? "Working..." : "Trigger Collection"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {/* BINS */}
        <DashboardCard
          title="Bins"
          icon={<Trash2 className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-100"
          total={stats.total_bins}
          subtitle="Total active bins"
          label="Need attention"
          value={stats.full_bins}
          valueColor="text-amber-600"
        />

        {/* TRUCKS */}
        <DashboardCard
          title="Fleet"
          icon={<Truck className="w-6 h-6 text-emerald-600" />}
          bgColor="bg-emerald-100"
          total={stats.total_trucks}
          subtitle="Total trucks"
          label="On route"
          value={stats.active_trucks}
          valueColor="text-emerald-600"
        />

        {/* ROUTES */}
        <DashboardCard
          title="Routes"
          icon={<Route className="w-6 h-6 text-purple-600" />}
          bgColor="bg-purple-100"
          total={stats.active_routes}
          subtitle="Active routes"
          label="Efficiency"
          value="94%" // Placeholder
          valueColor="text-purple-600"
        />

        {/* ALERTS */}
        <DashboardCard
          title="Alerts"
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          bgColor="bg-red-100"
          total={stats.alerts}
          subtitle="Active alerts"
          label="Priority"
          value="High" // Placeholder
          valueColor="text-red-600"
        />
      </div>

      {/* Landfill and Collection Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Collection Efficiency */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h4 className="font-semibold text-slate-800">Collection Efficiency</h4>
          </div>
          <div className="p-6">
            {/* This is the line with the error */}
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

        {/* Landfill Usage */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 text-white shadow-lg">
            <MapPin className="w-8 h-8 mb-3" />
            <h4 className="font-semibold text-lg mb-2">Landfill Capacity</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">Current Usage</span>
                  <span className="text-xl font-bold">{stats.landfill_usage}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
                    style={{ width: `${stats.landfill_usage}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs opacity-75">
                {stats.landfill_usage < 80
                  ? 'All sites operating within capacity'
                  : '⚠️ Nearing maximum capacity'}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
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
    </div>
  );
}

// Dashboard Card Component
interface CardProps {
  title: string;
  icon: JSX.Element;
  bgColor: string;
  total: number | string;
  subtitle: string;
  label: string;
  value: number | string;
  valueColor: string;
}

function DashboardCard({ title, icon, bgColor, total, subtitle, label, value, valueColor }: CardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase">{title}</span>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800">{total}</p>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">{label}</span>
            <span className={`font-semibold ${valueColor}`}>{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
}