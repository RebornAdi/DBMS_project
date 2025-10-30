import { Bell, Search, User } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
}

export default function Header({ activeSection }: HeaderProps) {
  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard Overview',
      bins: 'Bin Management',
      trucks: 'Truck Scheduling',
      routes: 'Route Optimization',
      landfills: 'Landfill Management',
      monitoring: 'Real-Time Monitoring',
      reports: 'Reports & Analytics',
      settings: 'System Settings',
    };
    return titles[activeSection] || 'Dashboard';
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 ml-64">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{getSectionTitle()}</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor waste collection operations</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64"
            />
          </div>

          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">City Administrator</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
