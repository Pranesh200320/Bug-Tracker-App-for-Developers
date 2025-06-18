import React from 'react';
import { Bug as BugType } from '../types';
import { Clock, MessageCircle, User } from 'lucide-react';

interface BugCardProps {
  bug: BugType;
  onClick: () => void;
}

export function BugCard({ bug, onClick }: BugCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-tight">{bug.title}</h4>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(bug.severity)}`}>
          {bug.severity}
        </span>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{bug.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {bug.estimatedTime && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{bug.estimatedTime}h</span>
            </div>
          )}
          {bug.comments.length > 0 && (
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-3 w-3" />
              <span>{bug.comments.length}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <User className="h-3 w-3" />
          <span>{formatDate(bug.createdAt)}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{bug.project}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            bug.priority === 'high' ? 'bg-red-100 text-red-600' :
            bug.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
            'bg-green-100 text-green-600'
          }`}>
            {bug.priority} priority
          </span>
        </div>
      </div>
    </div>
  );
}