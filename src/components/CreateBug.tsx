import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBugs } from '../contexts/BugContext';
import { useNavigate } from 'react-router-dom';
import { Bug, Upload, X } from 'lucide-react';

export function CreateBug() {
  const { user } = useAuth();
  const { addBug } = useBugs();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
    priority: 'medium' as const,
    project: '',
    estimatedTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      addBug({
        ...formData,
        status: 'open',
        reportedBy: user.id,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
      });
      navigate('/bugs');
    } catch (error) {
      console.error('Error creating bug:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (user?.role !== 'tester' && user?.role !== 'admin') {
    return (
      <div className="px-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only testers and admins can create bug reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report a Bug</h1>
        <p className="text-gray-600 mt-2">Help us improve by reporting issues you've found</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bug className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Bug Report Form</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Bug Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Detailed description of the bug, steps to reproduce, expected vs actual behavior..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low - Minor issue</option>
                <option value="medium">Medium - Moderate impact</option>
                <option value="high">High - Significant impact</option>
                <option value="critical">Critical - System breaking</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time (hours)
              </label>
              <input
                type="number"
                id="estimatedTime"
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleChange}
                min="0"
                step="0.5"
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
              Project/Module <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="project"
              name="project"
              required
              value={formData.project}
              onChange={handleChange}
              placeholder="e.g., Web App, Mobile App, Backend API"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshots (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/bugs')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Bug Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}