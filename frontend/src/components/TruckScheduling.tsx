import { useState, useEffect } from "react";
import { Truck, MapPin, Calendar, Wrench } from "lucide-react";

export default function TruckManagement() {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/trucks`);
      if (!res.ok) throw new Error("Failed to fetch trucks");
      const data = await res.json();
      setTrucks(data || []);
    } catch (err) {
      console.error("Error fetching trucks:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Assign Truck (trigger collection route assignment)
  const handleAssignTruck = async () => {
    setAssigning(true);
    try {
      const res = await fetch(`${API_BASE}/api/collect`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to assign truck");

      alert(data.message); // e.g., "Truck T-103 assigned to route"
      await fetchTrucks(); // refresh fleet status
    } catch (err) {
      console.error("Error assigning truck:", err);
      alert(String(err));
    } finally {
      setAssigning(false);
    }
  };

  // ✅ Handle Completing a route
  const handleCompleteRoute = async (truckId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/complete_route/${truckId}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to complete route");

      alert(data.message);
      await fetchTrucks();
    } catch (err) {
      console.error("Error completing route:", err);
      alert(String(err));
    }
  };

  // Truck status breakdown
  const totalFleet = trucks.length;
  const available = trucks.filter((t) => t.status === "Idle").length;
  const onRoute = trucks.filter((t) => t.status === "On-Route").length;
  const maintenance = trucks.filter((t) => t.status === "Maintenance").length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-sky-500 to-blue-500 p-3 rounded-xl shadow-lg">
          <Truck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Fleet Management
          </h3>
          <p className="text-sm text-slate-500">
            Schedule and monitor waste collection trucks
          </p>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <OverviewCard label="Total Fleet" value={totalFleet} icon={<Truck className="w-4 h-4 text-blue-400" />} />
        <OverviewCard label="Available" value={available} icon={<Truck className="w-4 h-4 text-emerald-400" />} />
        <OverviewCard label="On Route" value={onRoute} icon={<MapPin className="w-4 h-4 text-amber-400" />} />
        <OverviewCard label="Maintenance" value={maintenance} icon={<Wrench className="w-4 h-4 text-rose-400" />} />
      </div>

      {/* ACTIVE TRUCKS & ROUTES */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active Trucks */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700">Active Trucks</h4>
            <button
              onClick={handleAssignTruck}
              disabled={assigning}
              className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                assigning
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
            >
              {assigning ? "Assigning..." : "Assign Truck"}
            </button>
          </div>

          <div className="p-4 space-y-2">
            {loading ? (
              <p className="text-center text-slate-400 text-sm">Loading...</p>
            ) : onRoute === 0 ? (
              <p className="text-center text-slate-400 text-sm">No active trucks</p>
            ) : (
              trucks
                .filter((t) => t.status === "On-Route")
                .map((t) => (
                  <div
                    key={t.id}
                    className="py-2 px-3 flex items-center justify-between bg-slate-50 rounded-lg text-slate-700"
                  >
                    <span className="font-medium">🚛 {t.name}</span>
                    <button
                      onClick={() => handleCompleteRoute(t.id)}
                      className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-md hover:bg-emerald-200 transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Scheduled Routes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700">Scheduled Routes</h4>
            <button className="text-emerald-600 text-sm font-medium hover:underline">
              Create Route
            </button>
          </div>
          <div className="p-4 text-center text-slate-400 text-sm">
            <Calendar className="w-6 h-6 mx-auto mb-2 opacity-60" />
            No scheduled routes
          </div>
        </div>
      </div>

      {/* CALENDAR VIEW */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-semibold text-slate-700">Calendar View</h4>
          <div className="flex space-x-3 text-sm text-slate-500">
            <button className="hover:text-emerald-600">Today</button>
            <button className="hover:text-emerald-600">Week</button>
            <button className="hover:text-emerald-600">Month</button>
          </div>
        </div>
        <div className="border-2 border-dashed border-slate-200 rounded-xl h-48 flex flex-col justify-center items-center text-slate-400">
          <Calendar className="w-10 h-10 mb-2 opacity-60" />
          <p className="text-sm font-medium">Interactive Calendar</p>
          <p className="text-xs text-slate-400">Drag-and-drop truck scheduling interface</p>
          <p className="text-xs text-slate-400 mt-1">Ready for future calendar integration</p>
        </div>
      </div>
    </div>
  );
}

// Reusable Overview Card
function OverviewCard({ label, value, icon }: { label: string; value: number; icon: JSX.Element }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
