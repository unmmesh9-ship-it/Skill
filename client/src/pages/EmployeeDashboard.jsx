/**
 * Employee Dashboard Page
 * Personal dashboard for employees
 */

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EmployeeLayout from '../components/EmployeeLayout';
import PremiumLoading from '../components/PremiumLoading';
import skillService from '../services/skillService';
import projectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mySkills, setMySkills] = useState([]);
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    fetchEmployeeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);

      const [skillsRes, projectsRes] = await Promise.all([
        skillService.getMySkills(),
        projectService.getMyProjects(),
      ]);

      setMySkills(skillsRes.data);
      setMyProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for skill growth chart (in production, this would come from historical data)
  const skillGrowthData = [
    { month: 'Jan', skills: 8 },
    { month: 'Feb', skills: 10 },
    { month: 'Mar', skills: 12 },
    { month: 'Apr', skills: 14 },
    { month: 'May', skills: 16 },
    { month: 'Jun', skills: mySkills.length },
  ];

  const getProficiencyColor = (level) => {
    if (level >= 4) return 'bg-green-100 text-green-800';
    if (level >= 3) return 'bg-blue-100 text-blue-800';
    if (level >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getProficiencyLabel = (level) => {
    if (level >= 4) return 'Expert';
    if (level >= 3) return 'Intermediate';
    if (level >= 2) return 'Beginner';
    return 'Novice';
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <PremiumLoading message="Loading Your Dashboard..." />
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative rounded-3xl shadow-2xl p-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF71CE 0%, #01CDFE 50%, #B967FF 100%)' }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ backgroundColor: '#FF71CE' }}></div>
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" style={{ backgroundColor: '#05FFA1' }}></div>
          </div>
          <div className="relative z-10 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-2 tracking-tight">Welcome back, {user?.full_name}! 👋</h2>
                <p className="text-purple-100 text-base lg:text-lg font-medium">Here's your skill and project overview</p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30">
                  <p className="text-xs font-medium mb-1" style={{ color: '#01CDFE' }}>📅 Today</p>
                  <p className="text-xl font-bold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer border-2" style={{ background: 'linear-gradient(135deg, rgba(255, 113, 206, 0.15), rgba(185, 103, 255, 0.15))', borderColor: 'rgba(255, 113, 206, 0.3)' }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full group-hover:scale-150 transition-transform duration-700" style={{ backgroundColor: 'rgba(255, 113, 206, 0.2)' }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                  <span className="text-5xl">🎯</span>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: '#FF71CE' }}>My Skills</p>
                  <h3 className="text-6xl font-black group-hover:scale-110 transition-transform duration-300" style={{ color: '#FF71CE' }}>{mySkills.length}</h3>
                </div>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255, 113, 206, 0.2)' }}>
                <p className="font-bold text-sm" style={{ color: '#FF71CE' }}>✨ Keep Learning!</p>
              </div>
            </div>
          </div>

          <div className="group relative rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer border-2" style={{ background: 'linear-gradient(135deg, rgba(1, 205, 254, 0.15), rgba(5, 255, 161, 0.15))', borderColor: 'rgba(1, 205, 254, 0.3)' }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full group-hover:scale-150 transition-transform duration-700" style={{ backgroundColor: 'rgba(1, 205, 254, 0.2)' }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                  <span className="text-5xl">📁</span>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: '#01CDFE' }}>My Projects</p>
                  <h3 className="text-6xl font-black group-hover:scale-110 transition-transform duration-300" style={{ color: '#01CDFE' }}>{myProjects.length}</h3>
                </div>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(1, 205, 254, 0.2)' }}>
                <p className="font-bold text-sm" style={{ color: '#01CDFE' }}>🚀 Active Work</p>
              </div>
            </div>
          </div>

          <div className="group relative rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer border-2" style={{ background: 'linear-gradient(135deg, rgba(185, 103, 255, 0.15), rgba(255, 113, 206, 0.15))', borderColor: 'rgba(185, 103, 255, 0.3)' }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full group-hover:scale-150 transition-transform duration-700" style={{ backgroundColor: 'rgba(185, 103, 255, 0.2)' }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                  <span className="text-5xl">👤</span>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: '#B967FF' }}>Profile</p>
                  <h3 className="text-6xl font-black group-hover:scale-110 transition-transform duration-300" style={{ color: '#B967FF' }}>{user?.profile_completion || 85}%</h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold" style={{ color: '#B967FF' }}>Completion</span>
                  <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(185, 103, 255, 0.2)', color: '#B967FF' }}>{user?.profile_completion || 85}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: 'rgba(185, 103, 255, 0.2)' }}>
                  <div className="h-full rounded-full shadow-lg transition-all duration-1000" style={{ width: `${user?.profile_completion || 85}%`, background: 'linear-gradient(90deg, #B967FF, #FF71CE)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300" style={{ borderColor: 'rgba(255, 113, 206, 0.2)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold flex items-center mb-2" style={{ color: '#FF71CE' }}>
                <span className="mr-3 text-3xl">📈</span> Skill Growth Over Time
              </h3>
              <p className="text-sm font-medium" style={{ color: '#B967FF' }}>Track your learning progress journey</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#05FFA1' }}></span>
              <span className="px-4 py-2 rounded-xl text-xs font-bold shadow-md" style={{ background: 'linear-gradient(90deg, rgba(255, 113, 206, 0.2), rgba(1, 205, 254, 0.2))', color: '#FF71CE' }}>6 Months View</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={skillGrowthData}>
              <defs>
                <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF71CE" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#B967FF" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke="#FFD1ED" strokeWidth={1.5} />
              <XAxis dataKey="month" stroke="#FF71CE" style={{ fontSize: '12px', fontWeight: '600' }} />
              <YAxis stroke="#FF71CE" style={{ fontSize: '12px', fontWeight: '600' }} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '2px solid #FF71CE', borderRadius: '12px', fontWeight: '600', fontSize: '14px', padding: '12px' }} wrapperClassName="dark:bg-gray-700" />
              <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '700', paddingTop: '16px' }} />
              <Line type="monotone" dataKey="skills" stroke="#FF71CE" strokeWidth={3} name="Total Skills" dot={{ fill: '#FF71CE', r: 6, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} fill="url(#skillGradient)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* My Skills and Projects Row with enhanced styling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Skills Table */}
          <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 transition-colors duration-300" style={{ borderColor: 'rgba(255, 113, 206, 0.2)' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl animate-float">🎯</span>
              <h3 className="text-2xl font-bold text-vaporwave">My Skills</h3>
            </div>
            {mySkills.length === 0 ? (
              <div className="text-center py-12 relative">
                <div className="text-6xl mb-4 animate-float">🎯</div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">No skills added yet.</p>
                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Start adding skills to showcase your expertise!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y" style={{ borderColor: 'rgba(255, 113, 206, 0.2)' }}>
                  <thead style={{ background: 'linear-gradient(90deg, rgba(255, 113, 206, 0.1), rgba(1, 205, 254, 0.1))' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: '#FF71CE' }}>Skill</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: '#FF71CE' }}>Category</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: '#FF71CE' }}>Level</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y" style={{ borderColor: 'rgba(255, 113, 206, 0.1)' }}>
                    {mySkills.map((skill) => (
                      <tr key={skill.id} className="transition-colors duration-200" style={{ ':hover': { backgroundColor: 'rgba(255, 113, 206, 0.05)' } }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 113, 206, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-gray-100">{skill.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-medium">{skill.category}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${getProficiencyColor(skill.proficiency_level)}`}>
                            {getProficiencyLabel(skill.proficiency_level)} ({skill.proficiency_level}/5)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* My Projects Table */}
          <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 transition-colors duration-300" style={{ borderColor: 'rgba(1, 205, 254, 0.2)' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl animate-float" style={{ animationDelay: '0.5s' }}>📁</span>
              <h3 className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #01CDFE, #B967FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>My Projects</h3>
            </div>
            {myProjects.length === 0 ? (
              <div className="text-center py-12 relative">
                <div className="text-6xl mb-4 animate-float">📁</div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">No projects assigned yet.</p>
                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Contact your admin to get assigned to projects!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myProjects.map((assignment) => (
                  <div key={assignment.id} className="glass border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: 'rgba(1, 205, 254, 0.2)' }}>
                    <h4 className="font-bold text-lg mb-2" style={{ color: '#01CDFE' }}>{assignment.project?.name || 'Unnamed Project'}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{assignment.project?.description || 'No description available'}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${assignment.project?.status === 'Active' ? 'bg-green-100 text-green-800' : assignment.project?.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {assignment.project?.status || 'Unknown'}
                      </span>
                      <span className="text-xs font-bold" style={{ color: '#01CDFE' }}>
                        📅 {new Date(assignment.assigned_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
