import { useState, useEffect } from "react";
import { Truck, MapPin, Calendar, Wrench, X } from "lucide-react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function TruckManagement() {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRoute, setNewRoute] = useState({ name: "", area: "", truck_id: "" });
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchTrucks();
    fetchRoutes();
  }, []);

  // Fetch trucks
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

  // Fetch routes
  const fetchRoutes = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/routes`);
      if (!res.ok) throw new Error("Failed to fetch routes");
      const data = await res.json();
      setRoutes(data || []);
    } catch (err) {
      console.error("Error fetching routes:", err);
    }
  };

  // Assign Truck
  const handleAssignTruck = async () => {
    setAssigning(true);
    try {
      const res = await fetch(`${API_BASE}/api/collect`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign truck");
      alert(data.message);
      await fetchTrucks();
    } catch (err) {
      console.error("Error assigning truck:", err);
      alert(String(err));
    } finally {
      setAssigning(false);
    }
  };

  // Complete Route
  const handleCompleteRoute = async (truckId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/complete_route/${truckId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to complete route");
      alert(data.message);
      await fetchTrucks();
      await fetchRoutes();
    } catch (err) {
      console.error("Error completing route:", err);
      alert(String(err));
    }
  };

  // Create Route
  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoute),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create route");

      alert(`✅ Route "${newRoute.name}" created successfully!`);
      setShowModal(false);
      setNewRoute({ name: "", area: "", truck_id: "" });
      await fetchRoutes();
      await fetchTrucks();
    } catch (err) {
      console.error("Error creating route:", err);
      alert(String(err));
    }
  };

  // Convert routes to calendar events
  const calendarEvents = routes.map((r) => ({
    id: r.id,
    title: `${r.name} (${r.truck_name || "Unassigned"})`,
    start: r.scheduled_date ? new Date(r.scheduled_date) : new Date(),
    end: r.scheduled_date
      ? new Date(moment(r.scheduled_date).add(2, "hours").toDate())
      : new Date(moment().add(2, "hours").toDate()),
    allDay: false,
  }));

  // Truck stats
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
          <h3 className="text-lg font-semibold text-slate-800">Fleet Management</h3>
          <p className="text-sm text-slate-500">Schedule and monitor waste collection trucks</p>
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
                  <div key={t.id} className="py-2 px-3 flex items-center justify-between bg-slate-50 rounded-lg text-slate-700">
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
            <button onClick={() => setShowModal(true)} className="text-emerald-600 text-sm font-medium hover:underline">
              Create Route
            </button>
          </div>
          <div className="p-4 text-sm">
            {routes.length === 0 ? (
              <div className="text-center text-slate-400">
                <Calendar className="w-6 h-6 mx-auto mb-2 opacity-60" />
                No scheduled routes
              </div>
            ) : (
              routes.map((r, idx) => (
                <div key={idx} className="p-2 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-700">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.area}</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-semibold">
                    {r.truck_name || "Unassigned"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 📅 Calendar View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">Calendar View</h4>
        <div style={{ height: 500 }}>
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            eventPropGetter={() => ({
              style: { backgroundColor: "#10b981", borderRadius: "8px", color: "white" },
            })}
          />
        </div>
      </div>

      {/* 🟢 Create Route Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Create New Route</h4>
            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Route Name</label>
                <input
                  type="text"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Area / Zone</label>
                <input
                  type="text"
                  value={newRoute.area}
                  onChange={(e) => setNewRoute({ ...newRoute, area: e.target.value })}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Assign Truck</label>
                <select
                  value={newRoute.truck_id}
                  onChange={(e) => setNewRoute({ ...newRoute, truck_id: e.target.value })}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select Truck</option>
                  {trucks
                    .filter((t) => t.status === "Idle")
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Create Route
              </button>
            </form>
          </div>
        </div>
      )}
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
