import { useState, useEffect } from 'react';
import { Truck, Calendar, Wrench, MapPin, Clock } from 'lucide-react';

type TruckType = {
  id: number;
  truck_number: string;
  name?: string;
  driver_name?: string;
  capacity: number;
  current_load: number;
  status: 'Available' | 'On Route' | 'Maintenance' | string;
};

type RouteType = {
  id: number;
  route_name: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | string;
  scheduled_date: string | null;
  distance_km?: number | null;
  bin_sequence?: string[] | null;
  truck_id?: number | null;
};

export default function TruckScheduling() {
  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trucksRes, routesRes] = await Promise.all([
          fetch(`${API_BASE}/api/trucks`),
          fetch(`${API_BASE}/api/routes`),
        ]);

        if (!trucksRes.ok) throw new Error('Failed to fetch trucks');
        if (!routesRes.ok) throw new Error('Failed to fetch routes');

        const trucksData = await trucksRes.json();
        const routesData = await routesRes.json();

        setTrucks(trucksData || []);
        setRoutes(routesData || []);
      } catch (err) {
        console.error('TruckScheduling fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Available': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'On Route': 'bg-blue-100 text-blue-700 border-blue-200',
      'Maintenance': 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getRouteStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Scheduled': 'bg-blue-100 text-blue-700 border-blue-200',
      'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
      'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const availableTrucks = trucks.filter(t => t.status === 'Available').length;
  const activeTrucks = trucks.filter(t => t.status === 'On Route').length;
  const maintenanceTrucks = trucks.filter(t => t.status === 'Maintenance').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
          <Truck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Fleet Management</h3>
          <p className="text-sm text-slate-500">Schedule and monitor waste collection trucks</p>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Fleet', value: trucks.length, icon: Truck, color: 'bg-blue-500' },
          { label: 'Available', value: availableTrucks, icon: Truck, color: 'bg-emerald-500' },
          { label: 'On Route', value: activeTrucks, icon: MapPin, color: 'bg-amber-500' },
          { label: 'Maintenance', value: maintenanceTrucks, icon: Wrench, color: 'bg-red-500' },
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

      <div className="grid grid-cols-2 gap-6">
        {/* Active Trucks */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-blue-500" />
              <span>Active Trucks</span>
            </h4>
          </div>
          <div className="divide-y divide-slate-200">
            {trucks.map((truck) => (
              <div key={truck.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h5 className="font-semibold text-slate-800">{truck.truck_number}</h5>
                        <p className="text-sm text-slate-500">{truck.driver_name || '—'}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-600">
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">Capacity:</span>
                          <span>{truck.capacity}L</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">Load:</span>
                          <span>{truck.current_load}L</span>
                        </span>
                      </div>
                      <div className="w-48 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, (truck.current_load / Math.max(1, truck.capacity)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${getStatusColor(truck.status)}`}>
                    {truck.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Routes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span>Scheduled Routes</span>
            </h4>
          </div>
          <div className="divide-y divide-slate-200">
            {routes.length > 0 ? (
              routes.map((route) => (
                <div key={route.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold text-slate-800">{route.route_name}</h5>
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${getRouteStatusColor(route.status)}`}>
                          {route.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-600">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{route.scheduled_date ? new Date(route.scheduled_date).toLocaleString() : '—'}</span>
                        </span>
                        {route.distance_km != null && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{route.distance_km} km</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">
                          Bins: {Array.isArray(route.bin_sequence) ? route.bin_sequence.length : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-sm">No scheduled routes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar placeholder (same as your original) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>Calendar View</span>
          </h4>
          <div className="flex space-x-2">
            {['Today', 'Week', 'Month'].map((view) => (
              <button
                key={view}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {view}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Interactive Calendar</p>
            <p className="text-sm text-slate-500 mt-1">Drag-and-drop truck scheduling interface</p>
            <p className="text-xs text-slate-400 mt-2">Ready for calendar library integration</p>
          </div>
        </div>
      </div>
    </div>
  );
}
