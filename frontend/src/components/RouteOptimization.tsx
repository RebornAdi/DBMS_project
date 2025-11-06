import { useState, useEffect } from 'react';
import { Route as RouteIcon, MapPin, Navigation, TrendingUp, Clock, Fuel } from 'lucide-react';

type ApiRoute = {
  id: number | null;
  route_name: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | string;
  scheduled_date: string | null;
  distance_km?: number | null;
  bin_sequence?: string[] | null; // array of serials
};

type ApiBin = {
  serial: string;
  address: string;
  status: string;           // e.g., "Full", "Half Full", "Empty"
  fill_level: number;       // 0..100
  lat?: number;
  lon?: number;
  last_updated?: string;
};

export default function RouteOptimization() {
  const [routes, setRoutes] = useState<ApiRoute[]>([]);
  const [bins, setBins] = useState<ApiBin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, bRes] = await Promise.all([
          fetch(`${API_BASE}/api/routes`),
          fetch(`${API_BASE}/api/bins`),
        ]);
        if (!rRes.ok) throw new Error('Failed to fetch routes');
        if (!bRes.ok) throw new Error('Failed to fetch bins');

        const routesJson: ApiRoute[] = await rRes.json();
        const binsJson: ApiBin[] = await bRes.json();

        setRoutes(routesJson || []);
        setBins(binsJson || []);
      } catch (e) {
        console.error('Error fetching route optimization data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
      Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const urgentBins = bins.filter((b) => (b.fill_level ?? 0) >= 90);
  const priorityBins = bins.filter((b) => (b.fill_level ?? 0) >= 70 && (b.fill_level ?? 0) < 90);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Simple derived stat for "Active Routes"
  const activeRoutes = routes.filter((r) => r.status === 'In Progress').length;

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

      {/* Top stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Routes', value: activeRoutes, icon: RouteIcon, color: 'bg-purple-500' },
          { label: 'Urgent Bins', value: urgentBins.length, icon: MapPin, color: 'bg-red-500' },
          { label: 'Avg Distance', value: averageDistance(routes), icon: Navigation, color: 'bg-blue-500' },
          { label: 'Efficiency', value: '94%', icon: TrendingUp, color: 'bg-emerald-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon as any;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center opacity-20`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Removed the Interactive Route Map section. Keeping only the right-side panels. */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          {/* Urgent bins */}
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
                  <div key={bin.serial} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h5 className="font-semibold text-slate-800 text-sm">{bin.serial}</h5>
                        <p className="text-xs text-slate-500">{bin.address}</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: `${bin.fill_level}%` }}></div>
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
                <div className="p-4 text-center text-slate-500 text-sm">No urgent collections</div>
              )}
            </div>
          </div>

          {/* Today's routes */}
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
                  key={`${route.id}-${route.route_name}`}
                  onClick={() => setSelectedRoute(route.id ?? 0)}
                  className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                    selectedRoute === (route.id ?? 0) ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-slate-800 text-sm">{route.route_name}</h5>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${getStatusColor(
                          route.status
                        )}`}
                      >
                        {route.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-600">
                      {route.distance_km != null && (
                        <span className="flex items-center space-x-1">
                          <Navigation className="w-3 h-3" />
                          <span>{route.distance_km} km</span>
                        </span>
                      )}
                      <span>{Array.isArray(route.bin_sequence) ? route.bin_sequence.length : 0} bins</span>
                      {route.scheduled_date && (
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(route.scheduled_date).toLocaleString()}</span>
                        </span>
                      )}
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

/* helpers */
function averageDistance(routes: ApiRoute[]) {
  const dists = routes.map((r) => r.distance_km || 0).filter((x) => x > 0);
  if (!dists.length) return '—';
  const avg = dists.reduce((a, b) => a + b, 0) / dists.length;
  return `${avg.toFixed(1)} km`;
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center space-x-1">
      <div className={`w-3 h-3 ${color} rounded-full`}></div>
      <span>{label}</span>
    </span>
  );
}

function MetricBox({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <div className="text-slate-600 mb-1 text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}
