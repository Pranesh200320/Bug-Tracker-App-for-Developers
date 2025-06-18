import React, { useState } from 'react';
import { useBugs } from '../contexts/BugContext';
import { useAuth } from '../contexts/AuthContext';
import { BugCard } from './BugCard';
import { BugModal } from './BugModal';
import { Bug as BugType } from '../types';
import { Search, Filter, Plus } from 'lucide-react';

export function BugBoard() {
  const { bugs, getBugsByStatus } = useBugs();
  const { user } = useAuth();
  const [selectedBug, setSelectedBug] = useState<BugType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || bug.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const columns = [
    { title: 'Open', status: 'open' as const, color: 'border-red-200 bg-red-50' },
    { title: 'In Progress', status: 'in-progress' as const, color: 'border-yellow-200 bg-yellow-50' },
    { title: 'Resolved', status: 'resolved' as const, color: 'border-green-200 bg-green-50' },
    { title: 'Closed', status: 'closed' as const, color: 'border-gray-200 bg-gray-50' },
  ];

  const getColumnBugs = (status: BugType['status']) => {
    return filteredBugs.filter(bug => bug.status === status);
  };

  return (
    <div className="px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bug Board</h1>
            <p className="text-gray-600 mt-2">Kanban-style bug management</p>
          </div>
          {user?.role === 'tester' && (
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Report Bug</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnBugs = getColumnBugs(column.status);
          return (
            <div key={column.status} className={`rounded-xl border-2 ${column.color} min-h-96`}>
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {columnBugs.length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {columnBugs.map((bug) => (
                  <BugCard
                    key={bug.id}
                    bug={bug}
                    onClick={() => setSelectedBug(bug)}
                  />
                ))}
                {columnBugs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No bugs in this column</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bug Modal */}
      {selectedBug && (
        <BugModal
          bug={selectedBug}
          onClose={() => setSelectedBug(null)}
        />
      )}
    </div>
  );
}