import { Route as RouteIcon, Navigation } from 'lucide-react';

export default function RouteOptimization() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
          <RouteIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Route Optimization</h3>
          <p className="text-sm text-slate-500">AI-powered route planning for efficient collection</p>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Route Management</h3>
          <p className="text-slate-600">
            This section will display active routes, allow for manual route planning, and show optimization results.
          </p>
          <p className="text-sm text-slate-400 mt-4">
            Route generation is currently handled by the backend.
          </p>
        </div>
      </div>
    </div>
  );
}