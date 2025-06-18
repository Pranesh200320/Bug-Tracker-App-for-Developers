import React from 'react';
import { useBugs } from '../contexts/BugContext';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export function Analytics() {
  const { bugs, getBugsByStatus, getBugsBySeverity } = useBugs();

  const totalBugs = bugs.length;
  const openBugs = getBugsByStatus('open').length;
  const resolvedBugs = getBugsByStatus('resolved').length;
  const inProgressBugs = getBugsByStatus('in-progress').length;

  const resolutionRate = totalBugs > 0 ? ((resolvedBugs / totalBugs) * 100).toFixed(1) : '0';
  const avgResolutionTime = bugs
    .filter(bug => bug.actualTime)
    .reduce((acc, bug) => acc + (bug.actualTime || 0), 0) / bugs.filter(bug => bug.actualTime).length || 0;

  const severityStats = [
    { name: 'Critical', count: getBugsBySeverity('critical').length, color: 'text-red-600', bgColor: 'bg-red-100' },
    { name: 'High', count: getBugsBySeverity('high').length, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { name: 'Medium', count: getBugsBySeverity('medium').length, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { name: 'Low', count: getBugsBySeverity('low').length, color: 'text-green-600', bgColor: 'bg-green-100' },
  ];

  const projectStats = bugs.reduce((acc, bug) => {
    acc[bug.project] = (acc[bug.project] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentActivity = bugs
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Insights and metrics for bug tracking</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-600">{resolutionRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-blue-600">{avgResolutionTime.toFixed(1)}h</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-3xl font-bold text-red-600">{openBugs}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{inProgressBugs}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Severity Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Severity Distribution</h3>
          <div className="space-y-4">
            {severityStats.map((stat) => {
              const percentage = totalBugs > 0 ? (stat.count / totalBugs) * 100 : 0;
              return (
                <div key={stat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                    <span className="text-sm font-bold text-gray-900">{stat.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stat.bgColor.replace('bg-', 'bg-gradient-to-r from-').replace('-100', '-400 to-' + stat.bgColor.split('-')[1] + '-600')}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Bugs by Project</h3>
          <div className="space-y-4">
            {Object.entries(projectStats).map(([project, count]) => {
              const percentage = totalBugs > 0 ? (count / totalBugs) * 100 : 0;
              return (
                <div key={project}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{project}</span>
                    <span className="text-sm font-bold text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((bug) => (
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
                  <span className="text-sm text-gray-500">
                    {new Date(bug.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}