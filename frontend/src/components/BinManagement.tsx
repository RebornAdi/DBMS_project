import { useState, useEffect } from "react";
import { MapPin, Trash2, Clock } from "lucide-react";

export default function BinManagement() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bins`);
      if (!res.ok) throw new Error("Failed to fetch bins");
      const data = await res.json();
      console.log("Fetched bins:", data); // ✅ Check data structure in browser console
      setBins(data);
    } catch (error) {
      console.error("Error fetching bins:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFillColor = (level: number) => {
    if (level >= 80) return "bg-red-500";
    if (level >= 50) return "bg-amber-500";
    return "bg-emerald-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!bins.length) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Trash2 className="w-12 h-12 mx-auto mb-2 text-slate-400" />
        <p>No bin data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg">
          <Trash2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Bin Management</h3>
          <p className="text-sm text-slate-500">
            Live overview of all smart waste bins
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Bin ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Fill Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bins.map((bin, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                  {bin.serial || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {bin.address || "Unknown"}
                </td>
                <td className="px-6 py-4 text-sm">
  <div
    className={`w-24 text-center px-2 py-1 rounded-md font-semibold text-xs border shadow-sm ${
      bin.status === "Full"
        ? "bg-red-100 text-red-700 border-red-200"
        : bin.status === "Half Full"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : bin.status === "Empty"
        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
        : "bg-emerald-100 text-slate-700 border-slate-200"
    }`}
  >
    {bin.status}
  </div>
</td>

                <td className="px-6 py-4">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getFillColor(bin.fill_level)}`}
                      style={{ width: `${bin.fill_level || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {bin.fill_level || 0}%
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <Clock className="w-4 h-4 inline mr-1 text-slate-400" />
                  {bin.last_updated
                    ? new Date(bin.last_updated).toLocaleString()
                    : "N/A"}
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
  );
}
