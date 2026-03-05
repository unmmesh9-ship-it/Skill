/**
 * Admin Projects Page
 * Manage all projects and team assignments
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import projectService from '../services/projectService';
import userService from '../services/userService';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [analytics, setAnalytics] = useState({
    overview: null,
    statusDistribution: [],
    topProjects: []
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching projects data...');

      const [projectsRes, usersRes, overviewRes, statusRes, topRes] = await Promise.all([
        projectService.getAllProjects().catch(err => {
          console.error('❌ All Projects API error:', err.response?.data || err.message);
          return { data: [] };
        }),
        userService.getAllUsers().catch(err => {
          console.error('❌ Users API error:', err.response?.data || err.message);
          return { data: [] };
        }),
        projectService.getAnalytics('overview').catch(err => {
          console.error('❌ Overview API error:', err.response?.data || err.message);
          return { data: null };
        }),
        projectService.getAnalytics('status').catch(err => {
          console.error('❌ Status API error:', err.response?.data || err.message);
          return { data: [] };
        }),
        projectService.getAnalytics('top', 10).catch(err => {
          console.error('❌ Top Projects API error:', err.response?.data || err.message);
          return { data: [] };
        })
      ]);

      console.log('✅ Projects loaded:', {
        projects: projectsRes?.data?.length || 0,
        users: usersRes?.data?.length || 0
      });
      
      setProjects(projectsRes?.data || []);
      setUsers(usersRes?.data?.filter(u => u.role === 'employee') || []);
      setAnalytics({
        overview: overviewRes?.data || null,
        statusDistribution: statusRes?.data || [],
        topProjects: topRes?.data || []
      });
    } catch (error) {
      console.error('❌ AdminProjects Error:', error);
      setError('Failed to load projects data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, formData);
      } else {
        await projectService.createProject(formData);
      }
      setShowModal(false);
      setEditingProject(null);
      setFormData({ name: '', description: '', status: 'Active', start_date: '', end_date: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving project:', error);
      setError(error.response?.data?.message || 'Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status || 'Active',
      start_date: project.start_date || '',
      end_date: project.end_date || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting project:', error);
        setError(error.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  const handleAssignUser = async (projectId, userId) => {
    try {
      await projectService.assignUser(projectId, userId);
      fetchData();
    } catch (error) {
      console.error('Error assigning user:', error);
      setError(error.response?.data?.message || 'Failed to assign user to project');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Projects Management</h1>
            <p className="text-gray-600 mt-2">Manage all projects and team assignments</p>
          </div>
          <button
            onClick={() => {
              setEditingProject(null);
              setFormData({ name: '', description: '', status: 'Active', start_date: '', end_date: '' });
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Add New Project
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/90 backdrop-blur border-l-4 border-red-300 text-white px-4 py-3 rounded-r-xl shadow-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span className="font-bold">{error}</span>
              </div>
              <button onClick={() => setError('')} className="text-white hover:text-red-100 font-bold">✕</button>
            </div>
          </div>
        )}

        {/* Analytics Overview */}
        {analytics.overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <h3 className="text-sm font-medium opacity-90">Total Projects</h3>
              <p className="text-4xl font-bold mt-2">{analytics.overview.totalProjects}</p>
            </div>
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <h3 className="text-sm font-medium opacity-90">Active Projects</h3>
              <p className="text-4xl font-bold mt-2">{analytics.overview.activeProjects}</p>
            </div>
            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <h3 className="text-sm font-medium opacity-90">Completed</h3>
              <p className="text-4xl font-bold mt-2">{analytics.overview.completedProjects}</p>
            </div>
            <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <h3 className="text-sm font-medium opacity-90">Avg Team Size</h3>
              <p className="text-4xl font-bold mt-2">{analytics.overview.averageTeamSize}</p>
            </div>
          </div>
        )}

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          {analytics.statusDistribution.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Project Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.status}: ${entry.count}`}
                  >
                    {analytics.statusDistribution.map((entry, index) => {
                      const colors = {
                        'Active': '#10b981',
                        'Completed': '#3b82f6',
                        'On Hold': '#f59e0b'
                      };
                      return <Cell key={`cell-${index}`} fill={colors[entry.status] || '#6b7280'} />;
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Projects by Team Size */}
          {analytics.topProjects.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Top Projects by Team Size</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topProjects}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="team_size" fill="#8b5cf6" name="Team Members" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold mt-2 ${
                      project.status === 'Active' ? 'bg-green-100 text-green-800' :
                      project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status || 'Active'}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    👥 {project.team_size || 0}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="text-xs text-gray-500 mb-4 space-y-1">
                  {project.start_date && (
                    <p>📅 Start: {new Date(project.start_date).toLocaleDateString()}</p>
                  )}
                  {project.end_date && (
                    <p>🏁 End: {new Date(project.end_date).toLocaleDateString()}</p>
                  )}
                  <p>🕒 Created: {new Date(project.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No projects found</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add New Project" to create one</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Enter project description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="input-field"
                    min={formData.start_date}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary bg-blue-600 hover:bg-blue-700"
                >
                  {editingProject ? 'Update' : 'Create'} Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProject(null);
                    setFormData({ name: '', description: '', status: 'Active', start_date: '', end_date: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProjects;
