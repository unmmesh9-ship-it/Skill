/**
 * Employee Projects Page
 * View assigned projects and details
 */

import { useState, useEffect } from 'react';
import EmployeeLayout from '../components/EmployeeLayout';
import PremiumLoading from '../components/PremiumLoading';
import projectService from '../services/projectService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const EmployeeProjects = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getMyProjects();
      
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'planning':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '🚀';
      case 'planning':
        return '📋';
      case 'on hold':
        return '⏸️';
      case 'completed':
        return '✅';
      default:
        return '📁';
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <PremiumLoading message="Loading Your Projects..." />
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-8">
        {/* Professional Header */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg p-8" style={{ background: 'linear-gradient(135deg, #FF71CE 0%, #01CDFE 50%, #B967FF 100%)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top right, rgba(5, 255, 161, 0.15), transparent 50%)' }}></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <span className="text-4xl">🚀</span>
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight">My Projects</h2>
                <p className="text-white/90 text-base font-medium mt-1">View assigned projects and track progress</p>
              </div>
            </div>
          </div>
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

        {/* Stats with card-3d effect */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-3d relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white rounded-2xl shadow-xl p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-100 text-sm font-medium">Total Projects</p>
                <span className="text-3xl animate-float">📁</span>
              </div>
              <h3 className="text-5xl font-bold mt-2 animate-glow">{projects.length}</h3>
              <p className="text-purple-200 text-xs mt-2">All assignments</p>
            </div>
          </div>
          <div className="card-3d relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white rounded-2xl shadow-xl p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-sm font-medium">Active</p>
                <span className="text-3xl animate-float" style={{ animationDelay: '0.5s' }}>🚀</span>
              </div>
              <h3 className="text-5xl font-bold mt-2 animate-glow">
                {projects.filter((p) => p.project?.status?.toLowerCase() === 'active').length}
              </h3>
              <p className="text-green-200 text-xs mt-2">In progress</p>
            </div>
          </div>
          <div className="card-3d relative overflow-hidden bg-gradient-to-br from-blue-500 via-cyan-600 to-sky-600 text-white rounded-2xl shadow-xl p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm font-medium">Planning</p>
                <span className="text-3xl animate-float" style={{ animationDelay: '1s' }}>📋</span>
              </div>
              <h3 className="text-5xl font-bold mt-2 animate-glow">
                {projects.filter((p) => p.project?.status?.toLowerCase() === 'planning').length}
              </h3>
              <p className="text-blue-200 text-xs mt-2">Upcoming</p>
            </div>
          </div>
          <div className="card-3d relative overflow-hidden bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-600 text-white rounded-2xl shadow-xl p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-100 text-sm font-medium">Completed</p>
                <span className="text-3xl animate-float" style={{ animationDelay: '1.5s' }}>✅</span>
              </div>
              <h3 className="text-5xl font-bold mt-2 animate-glow">
                {projects.filter((p) => p.project?.status?.toLowerCase() === 'completed').length}
              </h3>
              <p className="text-purple-200 text-xs mt-2">Finished</p>
            </div>
          </div>
        </div>

        {/* Project Status Distribution Chart */}
        {projects.length > 0 && (
          <div className="card-professional p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-black" style={{ color: '#1a1a1a' }}>📊 Project Status Distribution</h3>
              <p className="text-sm font-medium" style={{ color: '#666' }}>Visual breakdown of your projects by status</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Active',
                      value: projects.filter((p) => p.project?.status?.toLowerCase() === 'active').length,
                      color: '#05FFA1'
                    },
                    {
                      name: 'Planning',
                      value: projects.filter((p) => p.project?.status?.toLowerCase() === 'planning').length,
                      color: '#01CDFE'
                    },
                    {
                      name: 'On Hold',
                      value: projects.filter((p) => p.project?.status?.toLowerCase() === 'on hold').length,
                      color: '#FF71CE'
                    },
                    {
                      name: 'Completed',
                      value: projects.filter((p) => p.project?.status?.toLowerCase() === 'completed').length,
                      color: '#B967FF'
                    }
                  ].filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {[
                    {
                      name: 'Active',
                      value: projects.filter((p) => p.project?.status?.toLowerCase() === 'active').length,
                      color: '#05FFA1'
                    },
                    {
                      name: 'Planning',
                      value: projects.filter((p) => p.project?.status?.toLowerCase() === 'planning').length,
                      color: '#01CDFE'
                    },
                    {
                      name: 'On Hold',
                      value: projects.filter((p) => p.project?.status?.toLowerCase() === 'on hold').length,
                      color: '#FF71CE'
                    },
                    {
                      name: 'Completed',
                      value: projects.filter((p) => p.project?.status?.toLowerCase() === 'completed').length,
                      color: '#B967FF'
                    }
                  ].filter(item => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '2px solid #FF71CE',
                    borderRadius: '12px',
                    padding: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-[#FF71CE]/10 via-[#B967FF]/10 to-[#01CDFE]/10 rounded-3xl shadow-2xl p-16 text-center border-2 border-[#FF71CE]/30">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-[#01CDFE] opacity-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-[#B967FF] opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <div className="text-8xl mb-6 animate-float">📁</div>
              <h3 className="text-3xl font-black text-vaporwave mb-4">No Projects Assigned</h3>
              <p className="text-[#B967FF] text-lg font-bold mb-4">You haven't been assigned to any projects yet.</p>
              <div className="mt-6 glass p-4 rounded-xl inline-block">
                <p className="text-sm text-gray-700 font-medium">Check browser console (F12) for details</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((assignment, index) => {
              const project = assignment.project;
              if (!project) {
                return null;
              }
              
              return (
              <div
                key={assignment.id}
                className="card-professional group hover:shadow-2xl transition-all duration-300"
              >
                {/* Professional Project Header */}
                <div className="mb-6 pb-6 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-black flex-1 pr-4" style={{ color: '#1a1a1a', lineHeight: '1.3' }}>{project.name}</h3>
                    <span className="text-3xl flex-shrink-0">{getStatusIcon(project.status)}</span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Professional Project Body */}
                <div className="space-y-5">
                  {/* Description */}
                  {project.description && (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 113, 206, 0.04)', border: '1px solid rgba(255, 113, 206, 0.1)' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#FF71CE' }}>📝 Description</p>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">{project.description}</p>
                    </div>
                  )}

                  {/* Dates with enhanced design */}
                  <div className="grid grid-cols-2 gap-4">
                    {project.start_date && (
                      <div className="p-4 rounded-xl border-2" style={{ backgroundColor: 'rgba(1, 205, 254, 0.05)', borderColor: 'rgba(1, 205, 254, 0.2)' }}>
                        <p className="text-xs font-bold mb-2 flex items-center gap-1" style={{ color: '#01CDFE' }}>
                          <span>📅</span> START DATE
                        </p>
                        <p className="text-base font-black" style={{ color: '#01CDFE' }}>
                          {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                    {project.end_date && (
                      <div className="p-4 rounded-xl border-2" style={{ backgroundColor: 'rgba(185, 103, 255, 0.05)', borderColor: 'rgba(185, 103, 255, 0.2)' }}>
                        <p className="text-xs font-bold mb-2 flex items-center gap-1" style={{ color: '#B967FF' }}>
                          <span>🏁</span> END DATE
                        </p>
                        <p className="text-base font-black" style={{ color: '#B967FF' }}>
                          {new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Assigned Date with premium styling */}
                  {assignment.assigned_at && (
                    <div className="flex items-center justify-between rounded-xl p-4 border-2" style={{ background: 'linear-gradient(90deg, rgba(5, 255, 161, 0.1), rgba(1, 205, 254, 0.1))', borderColor: 'rgba(5, 255, 161, 0.3)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">👤</span>
                        <span className="text-sm font-bold" style={{ color: '#05FFA1' }}>ASSIGNED ON</span>
                      </div>
                      <span className="text-base font-black" style={{ color: '#01CDFE' }}>
                        {new Date(assignment.assigned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}

                  {/* Timeline Progress Bar */}
                  {project.start_date && project.end_date && (
                    <div className="space-y-3 p-4 rounded-xl border-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderColor: 'rgba(185, 103, 255, 0.2)' }}>
                      <div className="flex justify-between text-xs font-bold">
                        <span className="flex items-center gap-1" style={{ color: '#B967FF' }}>
                          <span>⏱️</span> TIMELINE PROGRESS
                        </span>
                        <span style={{ color: '#FF71CE' }}>
                          {Math.ceil(
                            (new Date(project.end_date) - new Date(project.start_date)) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          DAYS TOTAL
                        </span>
                      </div>
                      <div className="relative w-full rounded-full h-4 overflow-hidden shadow-inner" style={{ backgroundColor: 'rgba(185, 103, 255, 0.15)' }}>
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 animate-shimmer shadow-lg"
                          style={{
                            background: 'linear-gradient(90deg, #FF71CE, #01CDFE, #B967FF, #05FFA1)',
                            width: `${Math.min(
                              ((Date.now() - new Date(project.start_date)) /
                                (new Date(project.end_date) - new Date(project.start_date))) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs font-bold" style={{ color: '#01CDFE' }}>
                        <span>{Math.max(0, Math.min(100, Math.round(
                          ((Date.now() - new Date(project.start_date)) /
                            (new Date(project.end_date) - new Date(project.start_date))) * 100
                        )))}% Complete</span>
                        <span>{Math.max(0, Math.ceil(
                          (new Date(project.end_date) - Date.now()) / (1000 * 60 * 60 * 24)
                        ))} days remaining</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProjects;
