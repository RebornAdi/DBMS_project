import { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase, type MonitoringAlert, type Transaction } from '../lib/supabase';

export default function Monitoring() {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [alertsResult, transactionsResult] = await Promise.all([
        supabase
          .from('monitoring_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)
      ]);

      if (alertsResult.error) throw alertsResult.error;
      if (transactionsResult.error) throw transactionsResult.error;

      setAlerts(alertsResult.data || []);
      setTransactions(transactionsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const getTransactionStatusColor = (status: string) => {
    const colors = {
      Success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Failed: 'bg-red-100 text-red-700 border-red-200',
      Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-700';
  };

  const getTransactionIcon = (status: string) => {
    if (status === 'Success') return CheckCircle;
    if (status === 'Failed') return XCircle;
    return Clock;
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unresolved') return !alert.is_resolved;
    if (filter === 'resolved') return alert.is_resolved;
    return true;
  });

  const unresolvedCount = alerts.filter(a => !a.is_resolved).length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && !a.is_resolved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl shadow-lg">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Real-Time Monitoring</h3>
          <p className="text-sm text-slate-500">Live alerts and system notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Alerts', value: unresolvedCount, icon: Bell, color: 'bg-red-500' },
          { label: 'Critical', value: criticalCount, icon: AlertCircle, color: 'bg-orange-500' },
          { label: 'Resolved Today', value: alerts.filter(a => a.is_resolved).length, icon: CheckCircle, color: 'bg-emerald-500' },
          { label: 'Success Rate', value: `${Math.round((transactions.filter(t => t.status === 'Success').length / transactions.length) * 100)}%`, icon: CheckCircle, color: 'bg-blue-500' },
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

      <div className="grid grid-cols-3 gap-6">
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
            <div className="flex space-x-2">
              {['all', 'unresolved', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    filter === f
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const Icon = getSeverityIcon(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className={`p-6 hover:bg-slate-50 transition-colors ${
                      alert.is_resolved ? 'opacity-60' : ''
                    }`}
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
                              <h5 className="font-semibold text-slate-800">{alert.alert_type}</h5>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                                {alert.severity}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                          </div>
                          {!alert.is_resolved && (
                            <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap">
                              Resolve
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(alert.created_at).toLocaleString()}</span>
                          </span>
                          {alert.is_resolved && alert.resolved_at && (
                            <span className="flex items-center space-x-1 text-emerald-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>Resolved {new Date(alert.resolved_at).toLocaleString()}</span>
                            </span>
                          )}
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

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>Recent Activity</span>
              </h4>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {[
                  { time: '2m ago', text: 'Bin #005 marked as overflow' },
                  { time: '5m ago', text: 'Route optimization completed' },
                  { time: '8m ago', text: 'Truck TRK-102 started route' },
                  { time: '12m ago', text: 'Alert resolved: Bin #012' },
                  { time: '15m ago', text: 'New route assigned to TRK-101' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-slate-700">{activity.text}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h4 className="font-semibold text-slate-800 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Transactions</span>
              </h4>
            </div>
            <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
              {transactions.slice(0, 10).map((transaction) => {
                const Icon = getTransactionIcon(transaction.status);
                return (
                  <div key={transaction.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Icon className={`w-4 h-4 mt-0.5 ${
                          transaction.status === 'Success' ? 'text-emerald-600' :
                          transaction.status === 'Failed' ? 'text-red-600' :
                          'text-amber-600'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {transaction.transaction_type}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {new Date(transaction.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getTransactionStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
