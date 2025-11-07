import { useState, useEffect } from "react";
import { Route as RouteIcon, MapPin, Navigation, TrendingUp } from "lucide-react";

// -------------------- TYPES --------------------
type ApiRoute = {
  id: number | null;
  route_name: string;
  status: "Scheduled" | "In Progress" | "Completed" | string;
  scheduled_date: string | null;
  distance_km?: number | null;
  bin_sequence?: string[] | null;
};

type ApiBin = {
  serial: string;
  address: string;
  status: string; // "Full", "Half Full", "Empty"
  fill_level: number; // 0..100
  lat?: number;
  lon?: number;
  last_updated?: string;
};

// -------------------- MAIN COMPONENT --------------------
export default function RouteOptimization() {
  const [routes, setRoutes] = useState<ApiRoute[]>([]);
  const [bins, setBins] = useState<ApiBin[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Fixed point
  const baseLat = -37.802694;
  const baseLon = 144.965873;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [routesRes, binsRes] = await Promise.all([
        fetch(`${API_BASE}/api/routes`),
        fetch(`${API_BASE}/api/bins`),
      ]);

      if (!routesRes.ok || !binsRes.ok)
        throw new Error("Failed to fetch data");

      const [routesData, binsData] = await Promise.all([
        routesRes.json(),
        binsRes.json(),
      ]);

      setRoutes(routesData);
      setBins(binsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      "In Progress": "bg-amber-100 text-amber-700 border-amber-200",
      Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return colors[status] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const urgentBins = bins.filter((b) => b.status === "Full");

  // Calculate avg distance between base point and bins with valid coordinates
  const avgDistance = calculateAverageDistance(urgentBins, baseLat, baseLon);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const activeRoutes = routes.filter((r) => r.status === "In Progress").length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
          <RouteIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Route Optimization
          </h3>
          <p className="text-sm text-slate-500">
            AI-powered route planning for efficient collection
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Active Routes",
            value: activeRoutes,
            icon: RouteIcon,
            color: "bg-purple-500",
          },
          {
            label: "Urgent Bins (Full)",
            value: urgentBins.length,
            icon: MapPin,
            color: "bg-red-500",
          },
          {
            label: "Avg Distance",
            value: avgDistance ? `${avgDistance.toFixed(2)} km` : "—",
            icon: Navigation,
            color: "bg-blue-500",
          },
          {
            label: "Efficiency",
            value: "94%",
            icon: TrendingUp,
            color: "bg-emerald-500",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon as any;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center opacity-20`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* URGENT BIN LIST */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <span>Urgent Bins (Full)</span>
          </h4>
        </div>

        <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
          {urgentBins.length > 0 ? (
            urgentBins.map((bin) => (
              <div
                key={bin.serial}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h5 className="font-semibold text-slate-800 text-sm">
                      {bin.serial}
                    </h5>
                    <p className="text-xs text-slate-500">{bin.address}</p>
                    <p className="text-xs text-slate-600">
                      Distance:{" "}
                      {bin.lat && bin.lon
                        ? `${calculateDistance(baseLat, baseLon, bin.lat, bin.lon).toFixed(2)} km`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-slate-500 text-sm">
              No urgent bins found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------- HELPERS --------------------

// Haversine formula for distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateAverageDistance(bins: ApiBin[], baseLat: number, baseLon: number): number | null {
  const valid = bins.filter((b) => b.lat && b.lon);
  if (!valid.length) return null;
  const total = valid.reduce(
    (sum, b) => sum + calculateDistance(baseLat, baseLon, b.lat!, b.lon!),
    0
  );
  return total / valid.length;
}
