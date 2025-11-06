import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, AlertTriangle, BarChart3, Archive } from 'lucide-react';

interface Landfill {
  id: number;
  name: string;
  location: string;
  total_capacity: number;
  current_usage: number;
  usage_percentage: number;
  status: string;
}

export default function LandfillManagement() {
  const [landfills, setLandfills] = useState<Landfill[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchLandfills();
  }, []);

  const fetchLandfills = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/landfills`);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setLandfills(data || []);
    } catch (error) {
      console.error('Error fetching landfills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Near Full': 'bg-amber-100 text-amber-700 border-amber-200',
      Full: 'bg-red-100 text-red-700 border-red-200',
      Closed: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-700';
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const totalCapacity = landfills.reduce((sum, l) => sum + l.total_capacity, 0);
  const totalUsage = landfills.reduce((sum, l) => sum + l.current_usage, 0);
  const avgUsage = totalCapacity > 0 ? Math.round((totalUsage / totalCapacity) * 100) : 0;
  const nearFullSites = landfills.filter(l => l.usage_percentage >= 80).length;

  const monthlyData = [
    { month: 'Jan', usage: 32000 },
    { month: 'Feb', usage: 35000 },
    { month: 'Mar', usage: 38000 },
    { month: 'Apr', usage: 42000 },
    { month: 'May', usage: 46000 },
    { month: 'Jun', usage: 50000 },
  ];

  const maxUsage = Math.max(...monthlyData.map(d => d.usage));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
          <Archive className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Landfill Management</h3>
          <p className="text-sm text-slate-500">Monitor capacity and usage trends across all sites</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Sites', value: landfills.length, icon: MapPin, color: 'bg-blue-500' },
          { label: 'Avg Capacity', value: `${avgUsage}%`, icon: BarChart3, color: 'bg-purple-500' },
          { label: 'Near Full', value: nearFullSites, icon: AlertTriangle, color: 'bg-amber-500' },
          { label: 'Active Sites', value: landfills.filter(l => l.status === 'Active').length, icon: TrendingUp, color: 'bg-emerald-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center opacity-20`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Landfill Data & Charts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Charts and Table */}
        <div className="col-span-2 space-y-6">
          {/* Usage Trends Chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span>Usage Trends (Last 6 Months)</span>
              </h4>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between space-x-4 h-64">
                {monthlyData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center space-y-2">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-orange-500 to-red-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                        style={{ height: `${(data.usage / maxUsage) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-slate-700">{data.month}</p>
                      <p className="text-xs text-slate-500">{(data.usage / 1000).toFixed(0)}k tons</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Landfill Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                <Archive className="w-5 h-5 text-blue-500" />
                <span>Landfill Sites</span>
              </h4>
            </div>
            <div className="divide-y divide-slate-200">
              {landfills.map((landfill) => (
                <div key={landfill.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h5 className="font-semibold text-slate-800">{landfill.name}</h5>
                      <p className="text-sm text-slate-500 flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{landfill.location}</span>
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(landfill.status)}`}>
                      {landfill.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Capacity Usage</span>
                      <span className="font-semibold text-slate-800">
                        {landfill.current_usage.toLocaleString()} / {landfill.total_capacity.toLocaleString()} tons
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${getUsageColor(landfill.usage_percentage)} transition-all duration-500`}
                          style={{ width: `${landfill.usage_percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 w-12 text-right">
                        {landfill.usage_percentage}%
                      </span>
                    </div>
                    {landfill.usage_percentage >= 80 && (
                      <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mt-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Approaching capacity limit - consider expansion or alternative sites</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Alerts & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
            <AlertTriangle className="w-8 h-8 mb-3" />
            <h4 className="font-semibold text-lg mb-2">Capacity Alert</h4>
            <p className="text-sm opacity-90 mb-4">
              {nearFullSites > 0
                ? `${nearFullSites} site${nearFullSites > 1 ? 's are' : ' is'} approaching capacity`
                : 'All sites operating within normal capacity'}
            </p>
            {nearFullSites > 0 && (
              <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                View Details
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800">Quick Stats</h4>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Capacity</span>
                <span className="font-semibold text-slate-800">{(totalCapacity / 1000).toFixed(0)}k tons</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Current Usage</span>
                <span className="font-semibold text-slate-800">{(totalUsage / 1000).toFixed(0)}k tons</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Available</span>
                <span className="font-semibold text-emerald-600">
                  {((totalCapacity - totalUsage) / 1000).toFixed(0)}k tons
                </span>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <span className="text-sm text-slate-600">Estimated Full Date</span>
                <p className="font-semibold text-slate-800 mt-1">Q3 2026</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800">Actions</h4>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                Generate Report
              </button>
              <button className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                Schedule Inspection
              </button>
              <button className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
