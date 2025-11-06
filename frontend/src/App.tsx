import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BinManagement from './components/BinManagement';
import TruckScheduling from './components/TruckScheduling';
import RouteOptimization from './components/RouteOptimization';
import LandfillManagement from './components/LandfillManagement';
import Monitoring from './components/Monitoring';
import { FileText, Settings } from 'lucide-react'; // Import icons

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'bins':
        return <BinManagement />;
      case 'trucks':
        return <TruckScheduling />;
      case 'routes':
        return <RouteOptimization />;
      case 'landfills':
        return <LandfillManagement />;
      case 'monitoring':
        return <Monitoring />;
      case 'reports':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Reports & Analytics</h3>
              <p className="text-slate-600">
                Generate detailed reports on waste collection efficiency, route optimization, and resource utilization.
              </p>
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                Generate Report
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">System Settings</h3>
              <p className="text-slate-600">
                Configure system preferences, user permissions, notification settings, and integration parameters.
              </p>
              <div className="mt-6 space-y-3">
                <button className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                  User Management
                </button>
                <button className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                  API Configuration
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="ml-64">
        <Header activeSection={activeSection} />
        <main className="p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default App; 