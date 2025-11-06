import { useState, useEffect } from "react";
import { AlertTriangle, Trash2, Clock, MapPin, Activity, AlertCircle } from "lucide-react";

export default function Monitoring() {
  const [bins, setBins] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [binsRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE}/api/bins`),
        fetch(`${API_BASE}/api/alerts`)
      ]);

      const binsData = await binsRes.json();
      const alertsData = await alertsRes.json();

      setBins(binsData || []);
      setAlerts(alertsData || []);
    } catch (err) {
      console.error("Error fetching monitoring data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFillColor = (level: number) => {
    if (level >= 90) return "bg-red-500";
    if (level >= 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getAlertColor = (severity: string) => {
    const map: Record<string, string> = {
      High: "bg-red-100 text-red-700 border-red-200",
      Medium: "bg-amber-100 text-amber-700 border-amber-200",
      Low: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return map[severity] || "bg-slate-100 text-slate-700 border-slate-200";
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Real-Time Monitoring</h3>
            <p className="text-sm text-slate-500">
              Live updates of bin fill levels and active system alerts
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Active Alerts</span>
          </h4>
          <span className="text-sm text-slate-500">{alerts.length} alerts</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {alerts.length > 0 ? (
            alerts.map((a: any, idx: number) => (
              <div
                key={idx}
                className={`flex items-start justify-between p-4 border-l-4 ${
                  a.severity === "High"
                    ? "border-red-500"
                    : a.severity === "Medium"
                    ? "border-amber-500"
                    : "border-blue-500"
                }`}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">{a.type}</p>
                  <p className="text-sm text-slate-600">{a.message}</p>
                  <p className="text-xs text-slate-500">
                    <Clock className="w-3 h-3 inline mr-1 text-slate-400" />
                    {new Date(a.timestamp).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-semibold border ${getAlertColor(
                    a.severity
                  )}`}
                >
                  {a.severity}
                </span>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500 text-sm">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              No active alerts at the moment
            </div>
          )}
        </div>
      </div>

      {/* Bin Monitoring Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
            <Trash2 className="w-5 h-5 text-emerald-500" />
            <span>Live Bin Readings</span>
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Bin ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fill Level</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bins.slice(0, 10).map((bin, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{bin.serial}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{bin.address}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                        bin.status === "Full"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : bin.status === "Half Full"
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {bin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getFillColor(bin.fill_level)} transition-all`}
                        style={{ width: `${bin.fill_level}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{bin.fill_level}%</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <Clock className="w-4 h-4 inline mr-1 text-slate-400" />
                    {bin.last_updated ? new Date(bin.last_updated).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 inline mr-1 text-slate-400" />
                    {bin.lat?.toFixed(4)}, {bin.lon?.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
