/**
 * Employee Skills Page
 * View and manage personal skills
 */

import { useState, useEffect } from 'react';
import EmployeeLayout from '../components/EmployeeLayout';
import PremiumLoading from '../components/PremiumLoading';
import skillService from '../services/skillService';
import skillRequestService from '../services/skillRequestService';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Mobile',
  'Cloud',
  'Testing',
  'Design',
  'Management',
  'Other',
];

const EmployeeSkills = () => {
  const [loading, setLoading] = useState(true);
  const [mySkills, setMySkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proficiency, setProficiency] = useState(3);
  const [requestMessage, setRequestMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [skillRequests, setSkillRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('skills');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSkills();
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const [mySkillsRes, allSkillsRes] = await Promise.all([
        skillService.getMySkills(),
        skillService.getAllSkills(),
      ]);

      console.log('📦 My Skills Response:', mySkillsRes);
      console.log('📋 My Skills Data:', mySkillsRes.data);
      console.log('📊 My Skills Count:', mySkillsRes.data?.length || 0);
      
      if (mySkillsRes.data && mySkillsRes.data.length > 0) {
        console.log('✅ Sample skill:', mySkillsRes.data[0]);
        mySkillsRes.data.forEach((skill, index) => {
          console.log(`Skill ${index}:`, {
            id: skill.id,
            skill_name: skill.skill_name,
            name: skill.name,
            category: skill.category,
            proficiency_level: skill.proficiency_level
          });
        });
      } else {
        console.log('❌ No skills data returned');
      }

      setMySkills(mySkillsRes.data || []);
      setAllSkills(allSkillsRes.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      alert('Failed to load skills. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await skillRequestService.getMyRequests();
      setSkillRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching skill requests:', error);
    }
  };

  const handleRequestSkill = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedSkill) {
      setErrorMessage('Please select a skill');
      return;
    }

    if (!requestMessage.trim()) {
      setErrorMessage('Please provide a reason for requesting this skill');
      return;
    }

    try {
      await skillRequestService.createRequest({
        skill_id: selectedSkill,
        proficiency_level: proficiency,
        request_message: requestMessage,
      });
      setSuccessMessage('Skill request submitted successfully! Admin will review your request.');
      setTimeout(() => {
        setShowRequestModal(false);
        setSelectedSkill('');
        setProficiency(3);
        setRequestMessage('');
        setSuccessMessage('');
        fetchRequests();
      }, 2000);
    } catch (error) {
      console.error('Error requesting skill:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to submit skill request');
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;

    try {
      await skillRequestService.deleteRequest(requestId);
      alert('Request cancelled successfully!');
      fetchRequests();
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request');
    }
  };

  const handleAddSkill = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedSkill) {
      setErrorMessage('Please select a skill');
      return;
    }

    try {
      await skillService.addEmployeeSkill({
        skill_id: selectedSkill,
        proficiency_level: proficiency,
      });
      setSuccessMessage('Skill added successfully!');
      setTimeout(() => {
        setShowAddModal(false);
        setSelectedSkill('');
        setProficiency(3);
        setSuccessMessage('');
        fetchSkills();
      }, 2000);
    } catch (error) {
      console.error('Error adding skill:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId) => {
    if (!confirm('Are you sure you want to remove this skill?')) return;

    try {
      await skillService.deleteEmployeeSkill(skillId);
      alert('Skill removed successfully!');
      fetchSkills();
    } catch (error) {
      console.error('Error removing skill:', error);
      alert('Failed to remove skill');
    }
  };

  const handleUpdateProficiency = async (skillId, newLevel) => {
    try {
      await skillService.updateEmployeeSkill(skillId, newLevel);
      alert('Proficiency updated!');
      fetchSkills();
    } catch (error) {
      console.error('Error updating proficiency:', error);
      alert('Failed to update proficiency');
    }
  };

  const getProficiencyLabel = (level) => {
    if (level >= 4) return 'Expert';
    if (level >= 3) return 'Intermediate';
    if (level >= 2) return 'Beginner';
    return 'Novice';
  };

  const getProficiencyColor = (level) => {
    if (level >= 5) return 'text-emerald-700 bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300';
    if (level >= 4) return 'text-teal-700 bg-gradient-to-r from-teal-100 to-cyan-100 border-teal-300';
    if (level >= 3) return 'text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300';
    if (level >= 2) return 'text-amber-700 bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300';
    return 'text-rose-700 bg-gradient-to-r from-rose-100 to-pink-100 border-rose-300';
  };

  // Filter available skills (not already added)
  const availableSkills = allSkills.filter(
    (skill) => !mySkills.some((mySkill) => mySkill.skill_id === skill.id)
  );

  // Group skills by category
  const groupedSkills = mySkills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const filteredCategories = selectedCategory === 'All'
    ? Object.keys(groupedSkills)
    : Object.keys(groupedSkills).filter((cat) => cat === selectedCategory);

  // Prepare chart data
  const categoryChartData = Object.keys(groupedSkills).map(category => ({
    name: category,
    value: groupedSkills[category].length
  }));

  const proficiencyChartData = [
    { level: 'Novice (1)', count: mySkills.filter(s => s.proficiency_level === 1).length },
    { level: 'Beginner (2)', count: mySkills.filter(s => s.proficiency_level === 2).length },
    { level: 'Intermediate (3)', count: mySkills.filter(s => s.proficiency_level === 3).length },
    { level: 'Advanced (4)', count: mySkills.filter(s => s.proficiency_level === 4).length },
    { level: 'Expert (5)', count: mySkills.filter(s => s.proficiency_level === 5).length }
  ];

  const radarChartData = Object.keys(groupedSkills).map(category => ({
    category: category,
    averageProficiency: (groupedSkills[category].reduce((sum, skill) => sum + skill.proficiency_level, 0) / groupedSkills[category].length).toFixed(1)
  }));

  const COLORS = ['#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#14b8a6', '#f97316', '#84cc16'];

  if (loading) {
    return (
      <EmployeeLayout>
        <PremiumLoading message="Loading Your Skills..." />
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header with professional gradient background */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1e40af] via-[#3b82f6] to-[#2563eb] rounded-2xl shadow-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 via-transparent to-[#3b82f6]/10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items- center mb-4">
              <div>
                <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                  <span className="text-5xl">🎯</span>
                  My Skills Portfolio
                </h2>
                <p className="text-blue-100 text-lg font-medium tracking-wide">Track and showcase your professional expertise</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-hover-scale px-6 py-3 bg-white text-[#3b82f6] hover:bg-[#10b981] hover:text-white font-bold flex items-center gap-2 rounded-xl shadow-xl border-2 border-[#10b981]/30"
                >
                  <span className="text-xl">➕</span>
                  Add Skill
                </button>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="btn-hover-scale px-6 py-3 bg-[#10b981] text-white hover:bg-[#059669] font-bold flex items-center gap-2 rounded-xl shadow-xl"
                >
                  <span className="text-xl">📝</span>
                  Request Skill
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
                  activeTab === 'skills'
                    ? 'bg-white text-[#3b82f6] shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                My Skills ({mySkills.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
                  activeTab === 'requests'
                    ? 'bg-white text-[#3b82f6] shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Skill Requests ({skillRequests.filter(r => r.status === 'pending').length})
              </button>
            </div>
          </div>
        </div>

        {/* My Skills Tab */}
        {activeTab === 'skills' && (
          <>
        {/* Stats Card with vaporwave colors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-3d relative overflow-hidden bg-gradient-to-br from-[#FF71CE] via-[#B967FF] to-[#01CDFE] text-white rounded-2xl shadow-2xl p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#05FFA1] opacity-20 rounded-full animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-cyan-100 text-sm font-bold">Total Skills</p>
                <span className="text-3xl animate-float">📚</span>
              </div>
              <h3 className="text-6xl font-black mt-2 animate-glow drop-shadow-2xl">{mySkills.length}</h3>
              <p className="text-cyan-200 text-xs mt-2 font-semibold">Skills in portfolio</p>
            </div>
          </div>
          <div className="card-3d relative overflow-hidden bg-gradient-to-br from-[#01CDFE] via-[#05FFA1] to-[#B967FF] text-white rounded-2xl shadow-2xl p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#FF71CE] opacity-20 rounded-full animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-100 text-sm font-bold">Expert Level</p>
                <span className="text-3xl animate-float" style={{ animationDelay: '0.5s' }}>🏆</span>
              </div>
              <h3 className="text-6xl font-black mt-2 animate-glow drop-shadow-2xl">
                {mySkills.filter((s) => s.proficiency_level >= 4).length}
              </h3>
              <p className="text-purple-200 text-xs mt-2 font-semibold">Advanced & Expert</p>
            </div>
          </div>
          <div className="card-3d relative overflow-hidden bg-gradient-to-br from-[#B967FF] via-[#FF71CE] to-[#01CDFE] text-white rounded-2xl shadow-2xl p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#05FFA1] opacity-20 rounded-full animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-pink-100 text-sm font-bold">Intermediate</p>
                <span className="text-3xl animate-float" style={{ animationDelay: '1s' }}>⚡</span>
              </div>
              <h3 className="text-6xl font-black mt-2 animate-glow drop-shadow-2xl">
                {mySkills.filter((s) => s.proficiency_level === 3).length}
              </h3>
              <p className="text-pink-200 text-xs mt-2 font-semibold">Growing skills</p>
            </div>
          </div>
          <div className="card-3d relative overflow-hidden bg-gradient-to-br from-[#05FFA1] via-[#01CDFE] to-[#FF71CE] text-white rounded-2xl shadow-2xl p-6">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#B967FF] opacity-20 rounded-full animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-sm font-bold">Learning</p>
                <span className="text-3xl animate-float" style={{ animationDelay: '1.5s' }}>🌱</span>
              </div>
              <h3 className="text-6xl font-black mt-2 animate-glow drop-shadow-2xl">
                {mySkills.filter((s) => s.proficiency_level < 3).length}
              </h3>
              <p className="text-green-200 text-xs mt-2 font-semibold">In development</p>
            </div>
          </div>
        </div>

        {/* Category Filter with modern design */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            Filter by Category
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-md'
              }`}
            >
              All ({mySkills.length})
            </button>
            {SKILL_CATEGORIES.map((category) => {
              const count = mySkills.filter((s) => s.category === category).length;
              if (count === 0) return null;
              const categoryEmojis = {
                'Frontend': '🎨',
                'Backend': '⚙️',
                'Database': '🗄️',
                'DevOps': '🚀',
                'Mobile': '📱',
                'Cloud': '☁️',
                'Testing': '🧪',
                'Design': '✨',
                'Management': '📊',
                'Other': '🔧'
              };
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-md'
                  }`}
                >
                  <span className="mr-1">{categoryEmojis[category]}</span>
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Analytics Charts with enhanced styling */}
        {mySkills.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills by Category - Pie Chart */}
            <div className="card-3d bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-8 border border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl animate-float">📊</span>
                <h3 className="text-2xl font-bold text-gradient-purple-pink">Skills by Category</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Proficiency Level Distribution - Bar Chart */}
            <div className="card-3d bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl animate-float" style={{ animationDelay: '0.5s' }}>📈</span>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Proficiency Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={proficiencyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="level" 
                    angle={-15}
                    textAnchor="end"
                    height={80}
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  />
                  <YAxis style={{ fontSize: '12px', fontWeight: '500' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Skills Count">
                    {proficiencyChartData.map((entry, index) => {
                      const colors = ['#f43f5e', '#f59e0b', '#06b6d4', '#10b981', '#22c55e'];
                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart - Average Proficiency by Category */}
            {radarChartData.length > 0 && (
              <div className="card-3d bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-8 border border-indigo-100 lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl animate-float" style={{ animationDelay: '1s' }}>🎯</span>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Proficiency Radar - Skill Mastery Map</h3>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarChartData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="category" 
                      style={{ fontSize: '14px', fontWeight: '600', fill: '#4b5563' }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      style={{ fontSize: '12px', fill: '#6b7280' }}
                    />
                    <Radar
                      name="Average Proficiency"
                      dataKey="averageProficiency"
                      stroke="#8b5cf6"
                      fill="#a855f7"
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Skills by Category */}
        {mySkills.length === 0 ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50 rounded-3xl shadow-2xl p-16 text-center border border-purple-200">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-purple-200 opacity-20 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-pink-200 opacity-20 rounded-full"></div>
            <div className="relative z-10">
              <div className="text-8xl mb-6 animate-bounce">🎯</div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">No Skills Added Yet</h3>
              <p className="text-gray-600 text-lg mb-8">Start building your skill profile by adding your first skill!</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-lg"
              >
                ✨ Add Your First Skill
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category) => {
              const categoryColors = {
                'Frontend': { bg: 'rgba(255, 113, 206, 0.1)', border: 'rgba(255, 113, 206, 0.3)', text: '#FF71CE', gradient: 'linear-gradient(135deg, #FF71CE, #B967FF)' },
                'Backend': { bg: 'rgba(1, 205, 254, 0.1)', border: 'rgba(1, 205, 254, 0.3)', text: '#01CDFE', gradient: 'linear-gradient(135deg, #01CDFE, #05FFA1)' },
                'Database': { bg: 'rgba(5, 255, 161, 0.1)', border: 'rgba(5, 255, 161, 0.3)', text: '#05FFA1', gradient: 'linear-gradient(135deg, #05FFA1, #01CDFE)' },
                'DevOps': { bg: 'rgba(185, 103, 255, 0.1)', border: 'rgba(185, 103, 255, 0.3)', text: '#B967FF', gradient: 'linear-gradient(135deg, #B967FF, #FF71CE)' },
                'Mobile': { bg: 'rgba(1, 205, 254, 0.1)', border: 'rgba(1, 205, 254, 0.3)', text: '#01CDFE', gradient: 'linear-gradient(135deg, #01CDFE, #B967FF)' },
                'Cloud': { bg: 'rgba(5, 255, 161, 0.1)', border: 'rgba(5, 255, 161, 0.3)', text: '#05FFA1', gradient: 'linear-gradient(135deg, #05FFA1, #B967FF)' },
                'Testing': { bg: 'rgba(255, 113, 206, 0.1)', border: 'rgba(255, 113, 206, 0.3)', text: '#FF71CE', gradient: 'linear-gradient(135deg, #FF71CE, #01CDFE)' },
                'Design': { bg: 'rgba(185, 103, 255, 0.1)', border: 'rgba(185, 103, 255, 0.3)', text: '#B967FF', gradient: 'linear-gradient(135deg, #B967FF, #01CDFE)' },
                'Management': { bg: 'rgba(1, 205, 254, 0.1)', border: 'rgba(1, 205, 254, 0.3)', text: '#01CDFE', gradient: 'linear-gradient(135deg, #01CDFE, #FF71CE)' },
                'Other': { bg: 'rgba(185, 103, 255, 0.1)', border: 'rgba(185, 103, 255, 0.3)', text: '#B967FF', gradient: 'linear-gradient(135deg, #B967FF, #05FFA1)' }
              };
              const categoryEmojis = {
                'Frontend': '🎨',
                'Backend': '⚙️',
                'Database': '🗄️',
                'DevOps': '🚀',
                'Mobile': '📱',
                'Cloud': '☁️',
                'Testing': '🧪',
                'Design': '✨',
                'Management': '📊',
                'Other': '🔧'
              };
              const colors = categoryColors[category] || categoryColors['Other'];
              return (
                <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 transition-colors duration-300" style={{ borderColor: colors.border }}>
                  <div className="inline-block text-white px-6 py-3 rounded-xl mb-6 shadow-lg" style={{ background: colors.gradient }}>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <span className="text-3xl">{categoryEmojis[category]}</span>
                      {category}
                      <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-bold">
                        {groupedSkills[category].length}
                      </span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedSkills[category].map((skill) => {
                      const colors = categoryColors[category] || categoryColors['Other'];
                      return (
                      <div
                        key={skill.skill_id}
                        className="card-3d group relative rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl"
                        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                      >
                        <div className="absolute top-0 right-0 -mt-3 -mr-3">
                          <button
                            onClick={() => handleRemoveSkill(skill.id)}
                            className="btn-hover-scale w-8 h-8 flex items-center justify-center text-white rounded-full shadow-lg transition-all"
                            style={{ background: 'linear-gradient(135deg, #FF71CE, #B967FF)' }}
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-xl font-black mb-3" style={{ color: colors.text }}>{skill.skill_name}</h4>
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border-2 ${getProficiencyColor(
                              skill.proficiency_level
                            )}`}
                          >
                            {getProficiencyLabel(skill.proficiency_level)}
                          </span>
                        </div>

                        <div className="mb-4">
                          <label className="text-xs font-bold mb-2 block uppercase tracking-wider" style={{ color: colors.text }}>Proficiency Level</label>
                          <select
                            value={skill.proficiency_level}
                            onChange={(e) =>
                              handleUpdateProficiency(skill.id, parseInt(e.target.value))
                            }
                            className="w-full rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 transition-all duration-300 border-2"
                            style={{ borderColor: colors.border, color: colors.text }}
                          >
                            <option value="1">1 - Novice</option>
                            <option value="2">2 - Beginner</option>
                            <option value="3">3 - Intermediate</option>
                            <option value="4">4 - Advanced</option>
                            <option value="5">5 - Expert</option>
                          </select>
                        </div>

                        {/* Star Rating Visual with animation */}
                        <div className="flex items-center gap-1 justify-center pt-3 border-t-2" style={{ borderColor: colors.border }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-2xl transition-all duration-300 transform hover:scale-125 ${
                                star <= skill.proficiency_level ? 'drop-shadow-lg animate-pulse-glow' : ''
                              }`}
                              style={{ 
                                animationDelay: `${star * 0.1}s`,
                                color: star <= skill.proficiency_level ? '#FFD700' : 'rgba(200, 200, 200, 0.3)'
                              }}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </>
        )}

        {/* Skill Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {skillRequests.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-300">
                <span className="text-6xl">📋</span>
                <p className="text-gray-600 mt-4 text-lg font-semibold">No skill requests yet</p>
                <p className="text-gray-500 mt-2">Click "Request Skill" to ask admin for skill approval</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {skillRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-xl"
                    style={{
                      borderColor:
                        request.status === 'pending'
                          ? '#f59e0b'
                          : request.status === 'approved'
                          ? '#10b981'
                          : '#ef4444',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {request.skill?.name}
                          </h3>
                          <span className="px-3 py-1 text-xs font-bold rounded-full" style={{
                            backgroundColor:
                              request.status === 'pending'
                                ? '#fef3c7'
                                : request.status === 'approved'
                                ? '#d1fae5'
                                : '#fee2e2',
                            color:
                              request.status === 'pending'
                                ? '#92400e'
                                : request.status === 'approved'
                                ? '#065f46'
                                : '#991b1b',
                          }}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Category:</span> {request.skill?.category}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Proficiency Level:</span>{' '}
                          {'⭐'.repeat(request.proficiency_level)} {getProficiencyLabel(request.proficiency_level)}
                        </p>
                        {request.request_message && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <span className="font-semibold">Your Message:</span> {request.request_message}
                          </p>
                        )}
                        {request.admin_response && (
                          <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <span className="font-semibold">Admin Response:</span> {request.admin_response}
                            </p>
                            {request.reviewer && (
                              <p className="text-xs text-blue-700 mt-1">
                                Reviewed by: {request.reviewer.full_name}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Requested: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRequest(request.id)}
                          className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all duration-300"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Skill Modal with enhanced design */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-8 w-full max-w-lg border-2 border-purple-200 transform transition-all duration-300 scale-100 hover:scale-105">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">✨</span>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Add New Skill</h3>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-500/90 backdrop-blur border-l-4 border-red-300 text-white px-4 py-3 rounded-r-xl shadow-lg animate-pulse mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-bold">{errorMessage}</span>
                  </div>
                  <button onClick={() => setErrorMessage('')} className="text-white hover:text-red-100 font-bold">✕</button>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-pulse mb-6">
                <span className="text-2xl">✅</span>
                <span className="font-bold">{successMessage}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  Select Skill
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full border-2 border-purple-300 dark:border-purple-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-medium bg-white dark:bg-gray-700 dark:text-gray-100 hover:border-purple-400"
                >
                  <option value="">-- Choose a skill --</option>
                  {availableSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name} ({skill.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Proficiency Level: <span className="text-purple-600">{proficiency}</span> - <span className="text-purple-600 font-bold">{getProficiencyLabel(proficiency)}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={proficiency}
                  onChange={(e) => setProficiency(parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-red-300 via-yellow-300 via-blue-300 to-green-300 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, 
                      #fca5a5 0%, 
                      #fcd34d ${(proficiency - 1) * 25}%, 
                      #93c5fd ${(proficiency - 1) * 25}%, 
                      #6ee7b7 ${(proficiency - 1) * 25}%, 
                      #86efac 100%)`
                  }}
                />
                <div className="flex justify-between text-xs font-semibold text-gray-600 mt-2">
                  <span>🌱 Novice</span>
                  <span>🏆 Expert</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-4xl transition-all duration-300 transform hover:scale-125 ${
                        star <= proficiency ? 'text-yellow-400 drop-shadow-lg animate-pulse' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedSkill('');
                  setProficiency(3);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ✨ Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Skill Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 w-full max-w-lg border-2 border-blue-200 transform transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">📝</span>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Request New Skill</h3>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-500/90 backdrop-blur border-l-4 border-red-300 text-white px-4 py-3 rounded-r-xl shadow-lg animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-bold">{errorMessage}</span>
                  </div>
                  <button onClick={() => setErrorMessage('')} className="text-white hover:text-red-100 font-bold">✕</button>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-pulse">
                <span className="text-2xl">✅</span>
                <span className="font-bold">{successMessage}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  Select Skill
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full border-2 border-blue-300 dark:border-blue-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium bg-white dark:bg-gray-700 dark:text-gray-100 hover:border-blue-400"
                >
                  <option value="">-- Choose a skill --</option>
                  {availableSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name} ({skill.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Proficiency Level: <span className="text-blue-600">{proficiency}</span> - <span className="text-blue-600 font-bold">{getProficiencyLabel(proficiency)}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={proficiency}
                  onChange={(e) => setProficiency(parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-red-300 via-yellow-300 via-blue-300 to-green-300 rounded-full appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs font-semibold text-gray-600 mt-2">
                  <span>🌱 Novice</span>
                  <span>🏆 Expert</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  Reason for Request (Required)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Explain why you need this skill and how you'll use it..."
                  className="w-full border-2 border-blue-300 dark:border-blue-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium bg-white dark:bg-gray-700 dark:text-gray-100 hover:border-blue-400 min-h-[120px]"
                  required
                />
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-emerald-100 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-4xl transition-all duration-300 ${
                        star <= proficiency ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedSkill('');
                  setProficiency(3);
                  setRequestMessage('');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSkill}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                📝 Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
};

export default EmployeeSkills;
