import { useState, useEffect } from 'react';
import { MapPin, Trash2, AlertCircle, Eye, Map as MapIcon } from 'lucide-react';
import { supabase, type Bin } from '../lib/supabase';

export default function BinManagement() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    try {
      const { data, error } = await supabase
        .from('bins')
        .select('*')
        .order('fill_level', { ascending: false });

      if (error) throw error;
      setBins(data || []);
    } catch (error) {
      console.error('Error fetching bins:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Empty: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Half: 'bg-blue-100 text-blue-700 border-blue-200',
      Full: 'bg-amber-100 text-amber-700 border-amber-200',
      Overflow: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-700';
  };

  const getFillLevelColor = (level: number) => {
    if (level >= 90) return 'bg-red-500';
    if (level >= 70) return 'bg-amber-500';
    if (level >= 40) return 'bg-blue-500';
    return 'bg-emerald-500';
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
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Waste Bin Overview</h3>
            <p className="text-sm text-slate-500">Monitor and manage all waste collection bins</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Bins', value: bins.length, color: 'bg-blue-500' },
          { label: 'Empty', value: bins.filter(b => b.status === 'Empty').length, color: 'bg-emerald-500' },
          { label: 'Need Attention', value: bins.filter(b => b.fill_level >= 70).length, color: 'bg-amber-500' },
          { label: 'Overflow', value: bins.filter(b => b.status === 'Overflow').length, color: 'bg-red-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg opacity-10`}></div>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Bin ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Fill Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Last Collection
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bins.map((bin) => (
                  <tr key={bin.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-slate-800">{bin.bin_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{bin.location_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-slate-700">{bin.fill_level}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${getFillLevelColor(bin.fill_level)} transition-all duration-500`}
                            style={{ width: `${bin.fill_level}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bin.status)}`}>
                        {bin.status === 'Overflow' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {bin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {bin.capacity}L
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(bin.last_collection).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="h-96 bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Map View</p>
              <p className="text-sm text-slate-500 mt-1">
                Interactive map showing all bin locations
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Leaflet.js integration placeholder - Ready for API connection
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
