import { useState, useEffect } from 'react';
import { Route as RouteIcon, MapPin, Navigation, TrendingUp, Clock, Fuel } from 'lucide-react';
import { supabase, type Route, type Bin } from '../lib/supabase';

export default function RouteOptimization() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [routesResult, binsResult] = await Promise.all([
        supabase.from('routes').select('*').order('scheduled_date'),
        supabase.from('bins').select('*').gte('fill_level', 70)
      ]);

      if (routesResult.error) throw routesResult.error;
      if (binsResult.error) throw binsResult.error;

      setRoutes(routesResult.data || []);
      setBins(binsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
      Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-700';
  };

  const urgentBins = bins.filter(b => b.fill_level >= 90);
  const priorityBins = bins.filter(b => b.fill_level >= 70 && b.fill_level < 90);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
          <RouteIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Route Optimization</h3>
          <p className="text-sm text-slate-500">AI-powered route planning for efficient collection</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Routes', value: routes.filter(r => r.status === 'In Progress').length, icon: RouteIcon, color: 'bg-purple-500' },
          { label: 'Urgent Bins', value: urgentBins.length, icon: MapPin, color: 'bg-red-500' },
          { label: 'Avg Distance', value: '24 km', icon: Navigation, color: 'bg-blue-500' },
          { label: 'Efficiency', value: '94%', icon: TrendingUp, color: 'bg-emerald-500' },
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

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-purple-500" />
              <span>Interactive Route Map</span>
            </h4>
          </div>
          <div className="p-6">
            <div className="h-96 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50"></div>
              <div className="text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Navigation className="w-10 h-10 text-white" />
                </div>
                <p className="text-slate-700 font-semibold text-lg">Leaflet.js Map Integration</p>
                <p className="text-sm text-slate-500 mt-2 max-w-md">
                  Interactive map displaying optimized collection routes with real-time truck tracking
                </p>
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-slate-600">
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Urgent</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>Priority</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Truck</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>Route</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-4">API integration ready</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Time Saved</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">2.5 hrs</p>
                <p className="text-xs text-slate-500 mt-1">vs manual routing</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <Fuel className="w-4 h-4" />
                  <span className="text-sm font-medium">Fuel Saved</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">18%</p>
                <p className="text-xs text-slate-500 mt-1">optimized routes</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Coverage</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">96%</p>
                <p className="text-xs text-slate-500 mt-1">bins on schedule</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>Urgent Collection</span>
              </h4>
            </div>
            <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
              {urgentBins.length > 0 ? (
                urgentBins.map((bin) => (
                  <div key={bin.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h5 className="font-semibold text-slate-800 text-sm">{bin.bin_number}</h5>
                        <p className="text-xs text-slate-500">{bin.location_name}</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-red-500"
                              style={{ width: `${bin.fill_level}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-red-600">{bin.fill_level}%</span>
                        </div>
                      </div>
                      <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                        Add to Route
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500 text-sm">
                  No urgent collections
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                <RouteIcon className="w-5 h-5 text-emerald-500" />
                <span>Today's Routes</span>
              </h4>
            </div>
            <div className="divide-y divide-slate-200">
              {routes.slice(0, 5).map((route) => (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id)}
                  className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                    selectedRoute === route.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-slate-800 text-sm">{route.route_name}</h5>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(route.status)}`}>
                        {route.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-600">
                      {route.distance_km && (
                        <span className="flex items-center space-x-1">
                          <Navigation className="w-3 h-3" />
                          <span>{route.distance_km} km</span>
                        </span>
                      )}
                      <span>
                        {Array.isArray(route.bin_sequence) ? route.bin_sequence.length : 0} bins
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
