/**
 * Admin Skills Page
 * Manage all skills in the system
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import skillService from '../services/skillService';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: ''
  });
  const [topSkills, setTopSkills] = useState([]);
  const [skillDistribution, setSkillDistribution] = useState([]);

  const categories = [
    'Programming',
    'Frontend',
    'Backend',
    'Database',
    'Cloud',
    'DevOps',
    'Mobile',
    'Design',
    'Testing',
    'Other'
  ];

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching skills data...');

      const [skillsRes, topSkillsRes, distributionRes] = await Promise.all([
        skillService.getAllSkills().catch(err => {
          console.error('❌ All Skills API error:', err.response?.data || err.message);
          return { data: [] };
        }),
        skillService.getTopSkills(10).catch(err => {
          console.error('❌ Top Skills API error:', err.response?.data || err.message);
          return { data: [] };
        }),
        skillService.getSkillDistribution().catch(err => {
          console.error('❌ Skill Distribution API error:', err.response?.data || err.message);
          return { data: [] };
        })
      ]);

      console.log('✅ Skills loaded:', {
        total: skillsRes?.data?.length || 0,
        top: topSkillsRes?.data?.length || 0,
        distribution: distributionRes?.data?.length || 0
      });

      setSkills(skillsRes?.data || []);
      setTopSkills(topSkillsRes?.data || []);
      setSkillDistribution(distributionRes?.data || []);
    } catch (error) {
      console.error('❌ Error fetching skills:', error);
      setError('Failed to load skills data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await skillService.updateSkill(editingSkill.id, formData);
      } else {
        await skillService.createSkill(formData);
      }
      setShowModal(false);
      setEditingSkill(null);
      setFormData({ name: '', category: '' });
      fetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
      setError(error.response?.data?.message || 'Failed to save skill');
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillService.deleteSkill(id);
        fetchSkills();
      } catch (error) {
        console.error('Error deleting skill:', error);
        setError(error.response?.data?.message || 'Failed to delete skill');
      }
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Skills Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage all skills in the system</p>
          </div>
          <button
            onClick={() => {
              setEditingSkill(null);
              setFormData({ name: '', category: '' });
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Add New Skill
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

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Distribution by Category */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 border-2 border-purple-100 dark:border-purple-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 flex items-center mb-2">
                    <span className="mr-3 text-3xl">📊</span> Skill Distribution
                  </h3>
                  <p className="text-sm text-purple-500 font-semibold">Skills by Category</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-200 to-violet-200 text-purple-700 rounded-xl text-xs font-bold shadow-md">Live Data</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillDistribution}>
                  <defs>
                    <linearGradient id="skillBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e9d5ff" strokeWidth={1.5} />
                  <XAxis 
                    dataKey="category" 
                    stroke="#7c3aed" 
                    style={{ fontSize: '12px', fontWeight: '600' }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#7c3aed" style={{ fontSize: '12px', fontWeight: '600' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #e9d5ff', 
                      borderRadius: '12px', 
                      fontWeight: '600',
                      fontSize: '14px',
                      padding: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '700', paddingTop: '16px' }} />
                  <Bar 
                    dataKey="count" 
                    fill="url(#skillBarGradient)" 
                    name="Number of Skills"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Skills by Employee Count */}
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 border-2 border-cyan-100 dark:border-cyan-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-700 flex items-center mb-2">
                    <span className="mr-3 text-3xl">🏆</span> Top Skills
                  </h3>
                  <p className="text-sm text-cyan-500 font-semibold">Most Popular Skills</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="px-4 py-2 bg-gradient-to-r from-cyan-200 to-teal-200 text-cyan-700 rounded-xl text-xs font-bold shadow-md">Top 10</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={topSkills} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="topSkillGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#cffafe" strokeWidth={1.5} />
                  <XAxis 
                    type="number" 
                    stroke="#0891b2" 
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#0891b2" 
                    style={{ fontSize: '11px', fontWeight: '600' }}
                    width={90}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #cffafe', 
                      borderRadius: '12px', 
                      fontWeight: '600',
                      fontSize: '14px',
                      padding: '12px'
                    }} 
                  />
                  <Bar 
                    dataKey="employee_count" 
                    fill="url(#topSkillGradient)" 
                    name="Employees"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Skills by Category */}
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="card">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <span className="inline-block w-2 h-6 bg-blue-600 rounded mr-3"></span>
                {category}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">
                  ({categorySkills.length} skills)
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-100">{skill.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            👥 {skill.employee_count || 0}
                          </span>
                          {skill.avg_proficiency > 0 && (
                            <span className="text-xs text-yellow-600 flex items-center gap-1">
                              ⭐ {skill.avg_proficiency}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No skills found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Click "Add New Skill" to create one</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter skill name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary bg-blue-600 hover:bg-blue-700"
                >
                  {editingSkill ? 'Update' : 'Create'} Skill
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSkill(null);
                    setFormData({ name: '', category: '' });
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

export default AdminSkills;
