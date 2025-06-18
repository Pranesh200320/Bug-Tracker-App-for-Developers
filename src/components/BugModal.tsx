import React, { useState } from 'react';
import { Bug as BugType, Comment } from '../types';
import { useBugs } from '../contexts/BugContext';
import { useAuth } from '../contexts/AuthContext';
import { X, Clock, User, MessageCircle, Send } from 'lucide-react';

interface BugModalProps {
  bug: BugType;
  onClose: () => void;
}

export function BugModal({ bug, onClose }: BugModalProps) {
  const { updateBug, addComment } = useBugs();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleStatusChange = (status: BugType['status']) => {
    updateBug(bug.id, { status });
  };

  const handlePriorityChange = (priority: BugType['priority']) => {
    updateBug(bug.id, { priority });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      addComment(bug.id, {
        text: newComment.trim(),
        author: user.id,
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bug Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{bug.title}</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSeverityColor(bug.severity)}`}>
                      {bug.severity} severity
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(bug.status)}`}>
                      {bug.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{bug.description}</p>
                </div>

                {/* Comments Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Comments ({bug.comments.length})
                  </h4>
                  
                  <div className="space-y-4 mb-6">
                    {bug.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-900">{comment.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handleSubmitComment} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={!newComment.trim() || isSubmittingComment}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="h-4 w-4" />
                          <span>{isSubmittingComment ? 'Posting...' : 'Comment'}</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Bug Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Project:</span>
                      <span className="font-medium">{bug.project}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reported:</span>
                      <span className="font-medium">
                        {new Date(bug.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Updated:</span>
                      <span className="font-medium">
                        {new Date(bug.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {bug.estimatedTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estimated:</span>
                        <span className="font-medium">{bug.estimatedTime}h</span>
                      </div>
                    )}
                    {bug.actualTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Actual:</span>
                        <span className="font-medium">{bug.actualTime}h</span>
                      </div>
                    )}
                  </div>
                </div>

                {(user?.role === 'admin' || user?.role === 'developer') && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
                      <select
                        value={bug.status}
                        onChange={(e) => handleStatusChange(e.target.value as BugType['status'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Priority</h4>
                      <select
                        value={bug.priority}
                        onChange={(e) => handlePriorityChange(e.target.value as BugType['priority'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}