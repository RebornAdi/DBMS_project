import { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

// Interface to match Flask API data
interface MonitoringAlert {
  id: number;
  type: string;      // Changed from alert_type
  message: string;
  severity: string;
  timestamp: string; // Changed from created_at
}

// Transaction type (placeholder, as there's no /api/transactions)
interface Transaction {
  id: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

export default function Monitoring() {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Will be empty
  const [loading, setLoading] = useState(true);
  
  // Note: Filter logic is removed as Flask API doesn't provide 'is_resolved'
  // const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Only fetching alerts, as /api/transactions doesn't exist
      const alertsRes = await fetch(`${API_BASE}/api/alerts`);
      const alertsData = await alertsRes.json();
      
      setAlerts(alertsData || []);
      setTransactions([]); // Set transactions to empty
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      Critical: 'bg-red-100 text-red-700 border-red-200',
      High: 'bg-orange-100 text-orange-700 border-orange-200',
      Medium: 'bg-amber-100 text-amber-700 border-amber-200',
      Low: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return colors[severity as keyof typeof colors] || 'bg-slate-100 text-slate-700';
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'Critical' || severity === 'High') return AlertCircle;
    return Bell;
  };

  // ... (Transaction color/icon functions remain, though unused) ...

  // All alerts are considered "unresolved"
  const filteredAlerts = alerts;
  const unresolvedCount = alerts.length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical').length;

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
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl shadow-lg">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Real-Time Monitoring</h3>
          <p className="text-sm text-slate-500">Live alerts and system notifications</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Alerts', value: unresolvedCount, icon: Bell, color: 'bg-red-500' },
          { label: 'Critical', value: criticalCount, icon: AlertCircle, color: 'bg-orange-500' },
          { label: 'Resolved', value: 0, icon: CheckCircle, color: 'bg-emerald-500' }, // Placeholder
          { label: 'Success Rate', value: '100%', icon: CheckCircle, color: 'bg-blue-500' }, // Placeholder
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center opacity-20`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts and Transactions */}
      <div className="grid grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-red-500" />
              <span>System Alerts</span>
              {unresolvedCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unresolvedCount}
                </span>
              )}
            </h4>
            {/* Filter buttons removed as they are not supported by the API */}
          </div>

          <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const Icon = getSeverityIcon(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className="p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        alert.severity === 'Critical' ? 'bg-red-100' :
                        alert.severity === 'High' ? 'bg-orange-100' :
                        alert.severity === 'Medium' ? 'bg-amber-100' :
                        'bg-blue-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          alert.severity === 'Critical' ? 'text-red-600' :
                          alert.severity === 'High' ? 'text-orange-600' :
                          alert.severity === 'Medium' ? 'text-amber-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="font-semibold text-slate-800">{alert.type}</h5>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                                {alert.severity}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                          </div>
                          {/* Resolve button removed */}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-slate-500">
                <Bell className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="font-medium">No alerts found</p>
                <p className="text-sm mt-1">All systems operating normally</p>
              </div>
            )}
          </div>
        </div>

        {/* Transactions (Placeholder) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Transactions</span>
              </h4>
            </div>
            <div className="p-4 text-center text-slate-400 text-sm">
              <XCircle className="w-6 h-6 mx-auto mb-2 opacity-60" />
              No transaction data available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}