import {
  Trash2,
  Truck,
  Route,
  MapPin,
  Bell,
  FileText,
  Settings,
  LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "bins", name: "Bins", icon: Trash2 },
  { id: "trucks", name: "Trucks", icon: Truck },
  { id: "landfills", name: "Landfills", icon: MapPin },
  { id: "monitoring", name: "Monitoring", icon: Bell },
];

export default function Sidebar({
  activeSection,
  onSectionChange,
}: SidebarProps) {
  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col h-screen fixed left-0 top-0 shadow-2xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">WW</h1>
            <p className="text-xs text-slate-400">WasteWise</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 transform scale-105"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-slate-400">System Status</p>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
