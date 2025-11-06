import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BinManagement from './components/BinManagement';
import TruckScheduling from './components/TruckScheduling';
import RouteOptimization from './components/RouteOptimization';
import LandfillManagement from './components/LandfillManagement';
import Monitoring from './components/Monitoring';

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
