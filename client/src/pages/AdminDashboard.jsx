/**
 * Admin Dashboard Page
 * Main analytics dashboard for administrators
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line
} from 'recharts';
import AdminLayout from '../components/AdminLayout';
import skillService from '../services/skillService';
import projectService from '../services/projectService';
import userService from '../services/userService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSkills: 0,
    totalProjects: 0,
  });
  const [topSkills, setTopSkills] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [skillDistribution, setSkillDistribution] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors

      console.log('🔄 Fetching admin dashboard data...');

      // Fetch all data in parallel with individual error handling
      const [usersRes, skillsRes, projectsRes, topSkillsRes, topProjectsRes, distributionRes] = 
        await Promise.all([
          userService.getAllUsers().catch(err => {
            console.error('❌ Users API error:', err.response?.data || err.message);
            return { count: 0, data: [] };
          }),
          skillService.getAllSkills().catch(err => {
            console.error('❌ Skills API error:', err.response?.data || err.message);
            return { count: 0, data: [] };
          }),
          projectService.getAllProjects().catch(err => {
            console.error('❌ Projects API error:', err.response?.data || err.message);
            return { count: 0, data: [] };
          }),
          skillService.getTopSkills(20).catch(err => {
            console.error('❌ Top Skills API error:', err.response?.data || err.message);
            return { count: 0, data: [] };
          }),
          projectService.getTopProjects(10).catch(err => {
            console.error('❌ Top Projects API error:', err.response?.data || err.message);
            return { count: 0, data: [] };
          }),
          skillService.getSkillDistribution().catch(err => {
            console.error('❌ Skill Distribution API error:', err.response?.data || err.message);
            return { count: 0, data: [] };
          }),
        ]);

      console.log('✅ API Responses:', {
        users: usersRes?.count || 0,
        skills: skillsRes?.count || 0,
        projects: projectsRes?.count || 0,
        topSkills: topSkillsRes?.data?.length || 0,
        topProjects: topProjectsRes?.data?.length || 0,
        distribution: distributionRes?.data?.length || 0
      });

      setStats({
        totalUsers: usersRes?.count || 0,
        totalSkills: skillsRes?.count || 0,
        totalProjects: projectsRes?.count || 0,
      });

      setTopSkills(topSkillsRes?.data || []);
      setTopProjects(topProjectsRes?.data || []);
      setSkillDistribution(distributionRes?.data || []);
      
      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ AdminDashboard Error:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced color palettes with more vibrant combinations
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'];
  const GRADIENT_COLORS = [
    { start: '#667eea', end: '#764ba2' },
    { start: '#f093fb', end: '#f5576c' },
    { start: '#4facfe', end: '#00f2fe' },
    { start: '#43e97b', end: '#38f9d7' },
    { start: '#fa709a', end: '#fee140' },
    { start: '#30cfd0', end: '#330867' },
    { start: '#a8edea', end: '#fed6e3' },
    { start: '#ff9a9e', end: '#fecfef' },
  ];

  // Light custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-5 rounded-2xl shadow-xl border-2 border-cyan-200">
          <p className="font-bold text-cyan-700 text-lg mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: <span className="font-black text-lg">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-cyan-400 mx-auto"></div>
              <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-teal-400 mx-auto absolute top-0 left-0 right-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl animate-pulse">📊</span>
              </div>
            </div>
            <p className="mt-6 text-xl font-semibold text-cyan-600 animate-pulse">Loading Dashboard...</p>
            <p className="mt-2 text-sm text-gray-500">Preparing your analytics</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Ultra-Premium Welcome Banner */}
        <div className="relative bg-gradient-to-r from-cyan-600 via-teal-600 to-purple-700 rounded-3xl shadow-2xl p-8 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          <div className="relative z-10 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold mb-3 tracking-tight">📊 Analytics Dashboard</h1>
                <p className="text-lg lg:text-xl font-semibold text-cyan-100">Real-time Organizational Insights & Metrics</p>
              </div>
              <div className="hidden lg:block text-6xl opacity-30 animate-pulse">🚀</div>
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

        {/* Premium 3D Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users Card */}
          <div 
            onClick={() => navigate('/admin/users')}
            className="group relative bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer border-2 border-cyan-200 dark:border-cyan-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                  <span className="text-5xl">👥</span>
                </div>
                <div className="text-right">
                  <p className="text-cyan-500 text-xs uppercase tracking-wider font-bold mb-2">Total Users</p>
                  <h3 className="text-4xl font-black text-cyan-700 group-hover:scale-110 transition-transform duration-300">{stats.totalUsers}</h3>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-cyan-600">Growth Rate</span>
                  <span className="text-sm font-bold bg-cyan-200 text-cyan-700 px-3 py-1 rounded-full shadow-sm">+12%</span>
                </div>
                <div className="h-2 bg-cyan-200/50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full shadow-lg" style={{ width: '75%', animation: 'slideIn 1s ease-out' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div 
            onClick={() => navigate('/admin/skills')}
            className="group relative bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer border-2 border-purple-200 dark:border-purple-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                  <span className="text-5xl">🎯</span>
                </div>
                <div className="text-right">
                  <p className="text-purple-500 text-xs uppercase tracking-wider font-bold mb-2">Total Skills</p>
                  <h3 className="text-4xl font-black text-purple-700 group-hover:scale-110 transition-transform duration-300">{stats.totalSkills}</h3>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-purple-600">Adoption Rate</span>
                  <span className="text-sm font-bold bg-purple-200 text-purple-700 px-3 py-1 rounded-full shadow-sm">+8%</span>
                </div>
                <div className="h-2 bg-purple-200/50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full shadow-lg" style={{ width: '85%', animation: 'slideIn 1.2s ease-out' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Card */}
          <div 
            onClick={() => navigate('/admin/projects')}
            className="group relative bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer border-2 border-amber-200 dark:border-amber-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                  <span className="text-5xl">📁</span>
                </div>
                <div className="text-right">
                  <p className="text-amber-500 text-xs uppercase tracking-wider font-bold mb-2">Active Projects</p>
                  <h3 className="text-4xl font-black text-amber-700 group-hover:scale-110 transition-transform duration-300">{stats.totalProjects}</h3>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-amber-600">Completion</span>
                  <span className="text-sm font-bold bg-amber-200 text-amber-700 px-3 py-1 rounded-full shadow-sm">+15%</span>
                </div>
                <div className="h-2 bg-amber-200/50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg" style={{ width: '60%', animation: 'slideIn 1.4s ease-out' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra-Premium Charts Row with Glassmorphism */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 border-2 border-cyan-100 dark:border-cyan-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-700 flex items-center mb-2">
                    <span className="mr-3 text-3xl">📊</span> Skill Distribution
                  </h3>
                  <p className="text-sm text-cyan-500 font-semibold">Analysis by Category</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="px-4 py-2 bg-gradient-to-r from-cyan-200 to-teal-200 text-cyan-700 rounded-xl text-xs font-bold shadow-md">Live Data</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={skillDistribution}>
                  <defs>
                    <linearGradient id="colorBar3D" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#667eea" stopOpacity={1}/>
                      <stop offset="50%" stopColor="#764ba2" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#4c1d95" stopOpacity={0.8}/>
                    </linearGradient>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e0e7ff" strokeWidth={1.5} />
                  <XAxis 
                    dataKey="category" 
                    stroke="#4f46e5" 
                    style={{ fontSize: '13px', fontWeight: '700' }}
                    tick={{ fill: '#4f46e5' }}
                  />
                  <YAxis 
                    stroke="#4f46e5" 
                    style={{ fontSize: '13px', fontWeight: '700' }}
                    tick={{ fill: '#4f46e5' }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }} />
                  <Legend 
                    wrapperStyle={{ fontSize: '14px', fontWeight: '700', paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar 
                    dataKey="employee_count" 
                    name="Employees"
                    fill="url(#colorBar3D)"
                    radius={[12, 12, 0, 0]}
                    filter="url(#shadow)"
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Light Donut Chart */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border-2 border-purple-100 dark:border-purple-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-black text-purple-700 flex items-center mb-2">
                    <span className="mr-3 text-4xl">🎯</span> Skill Breakdown
                  </h3>
                  <p className="text-sm text-purple-500 font-semibold">Distribution Analysis</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 rounded-full text-xs font-bold shadow-md">Interactive</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <defs>
                    {GRADIENT_COLORS.map((color, index) => (
                      <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color.start} stopOpacity={1}/>
                        <stop offset="100%" stopColor={color.end} stopOpacity={0.8}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={135}
                    paddingAngle={4}
                    dataKey="employee_count"
                    nameKey="category"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    animationDuration={2000}
                    animationEasing="ease-out"
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#gradient${index % GRADIENT_COLORS.length})`}
                        stroke="#fff"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '12px', fontWeight: '700' }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Area Chart and Radar Chart - Ultra Premium Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Area Chart - Top Skills Trend with Glassmorphism */}
          <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 hover:shadow-emerald-500/30 transition-all duration-500 border border-white/50 dark:border-gray-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center mb-2">
                    <span className="mr-3 text-4xl">📈</span> Skill Popularity
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Top 10 Trending Skills</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-xs font-bold shadow-lg">Trending</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={topSkills.slice(0, 10)}>
                <defs>
                  <linearGradient id="colorAreaPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="50%" stopColor="#059669" stopOpacity={0.5}/>
                    <stop offset="100%" stopColor="#047857" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke="#d1fae5" strokeWidth={1.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="#059669" 
                  style={{ fontSize: '11px', fontWeight: '700' }} 
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#059669" style={{ fontSize: '12px', fontWeight: '700' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="employee_count" 
                  stroke="#059669" 
                  strokeWidth={4}
                  fill="url(#colorAreaPremium)" 
                  name="Employees"
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart - Skill Categories with 3D Effect */}
          <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 hover:shadow-pink-500/30 transition-all duration-500 border border-white/50 dark:border-gray-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center mb-2">
                    <span className="mr-3 text-4xl">🎯</span> 360° Skill Matrix
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Category Distribution</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></span>
                  <span className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full text-xs font-bold shadow-lg">360° View</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={skillDistribution}>
                  <PolarGrid stroke="#fce7f3" strokeWidth={2} />
                  <PolarAngleAxis 
                    dataKey="category" 
                    stroke="#ec4899"
                    style={{ fontSize: '12px', fontWeight: '700' }} 
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    stroke="#ec4899"
                    style={{ fontSize: '11px', fontWeight: '600' }}
                  />
                  <Radar 
                    name="Employees" 
                    dataKey="employee_count" 
                    stroke="#ec4899" 
                    fill="#ec4899" 
                    fillOpacity={0.7}
                    strokeWidth={3}
                    animationDuration={2000}
                    animationEasing="ease-out"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: '13px', fontWeight: '700' }}
                    iconType="circle"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Enhanced Tables with Modern Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 20 Skills Table with Gradients */}
          <div className="card hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-indigo-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">🏆</span> Top 20 Skills
              </h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">Most Popular</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Skill</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Users</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Level</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topSkills.slice(0, 20).map((skill, index) => (
                    <tr key={skill.id} className="hover:bg-indigo-50 transition-colors duration-200">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-sm ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                          'bg-gradient-to-br from-indigo-400 to-purple-600'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-gray-900">{skill.name}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {skill.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className="inline-flex items-center font-semibold text-gray-800">
                          👥 {skill.employee_count}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-lg ${
                              i < Math.round(skill.avg_proficiency) ? 'text-yellow-400' : 'text-gray-300'
                            }`}>
                              ⭐
                            </span>
                          ))}
                          <span className="ml-2 text-xs font-bold text-gray-600">
                            {skill.avg_proficiency}/5
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Projects Table with Modern Design */}
          <div className="card hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">🚀</span> Active Projects
              </h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Team Size</span>
            </div>
            <div className="space-y-4">
              {topProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-transparent hover:border-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 text-white font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{project.status || 'Active'} • {project.description?.substring(0, 50) || 'No description'}{project.description?.length > 50 ? '...' : ''}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                          <span className="text-xl">👥</span>
                          <span className="font-bold text-lg">{project.team_size}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">team members</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((project.team_size / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Skills - Enhanced Design */}
        <div className="card hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white via-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">🔥</span> Trending Skills
            </h3>
            <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full text-xs font-semibold animate-pulse">
              HOT
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topSkills.slice(0, 12).map((skill, index) => (
              <div
                key={skill.id}
                className="group relative bg-white rounded-xl p-5 text-center shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-400"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '💎'}
                  </div>
                  <p className="font-bold text-gray-800 group-hover:text-white transition-colors text-sm">
                    {skill.name}
                  </p>
                  <div className="mt-2 flex items-center justify-center space-x-1">
                    <span className="text-2xl group-hover:text-white transition-colors">👥</span>
                    <span className="font-bold text-lg text-purple-600 group-hover:text-white transition-colors">
                      {skill.employee_count}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${
                        i < Math.round(skill.avg_proficiency) ? 'text-yellow-400' : 'text-gray-300'
                      } group-hover:text-yellow-300 transition-colors`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
