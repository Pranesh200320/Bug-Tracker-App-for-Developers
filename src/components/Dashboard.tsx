import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBugs } from '../contexts/BugContext';
import { 
  Bug, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { bugs, getBugsByStatus, getBugsBySeverity, getBugsByAssignee } = useBugs();

  const stats = {
    total: bugs.length,
    open: getBugsByStatus('open').length,
    inProgress: getBugsByStatus('in-progress').length,
    resolved: getBugsByStatus('resolved').length,
    critical: getBugsBySeverity('critical').length,
    assigned: user ? getBugsByAssignee(user.id).length : 0,
  };

  const severityData = [
    { name: 'Critical', count: getBugsBySeverity('critical').length, color: 'bg-red-500' },
    { name: 'High', count: getBugsBySeverity('high').length, color: 'bg-orange-500' },
    { name: 'Medium', count: getBugsBySeverity('medium').length, color: 'bg-yellow-500' },
    { name: 'Low', count: getBugsBySeverity('low').length, color: 'bg-green-500' },
  ];

  const recentBugs = bugs
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bugs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Bug className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open</p>
              <p className="text-3xl font-bold text-red-600">{stats.open}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Severity Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bugs by Severity</h3>
          <div className="space-y-4">
            {severityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {user?.role === 'tester' && (
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Bug className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Report New Bug</span>
                </div>
              </button>
            )}
            {user?.role === 'admin' && (
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Manage Users</span>
                </div>
              </button>
            )}
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="font-medium">View Analytics</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bug Activity</h3>
        </div>
        <div className="p-6">
          {recentBugs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentBugs.map((bug) => (
                <div key={bug.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      bug.severity === 'critical' ? 'bg-red-500' :
                      bug.severity === 'high' ? 'bg-orange-500' :
                      bug.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{bug.title}</p>
                      <p className="text-sm text-gray-500">{bug.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      bug.status === 'open' ? 'bg-red-100 text-red-800' :
                      bug.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      bug.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {bug.status.replace('-', ' ')}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(bug.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}