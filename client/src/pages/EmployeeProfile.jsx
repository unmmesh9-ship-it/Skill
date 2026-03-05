/**
 * Employee Profile Page
 * View and edit personal profile information
 */

import { useState, useEffect } from 'react';
import EmployeeLayout from '../components/EmployeeLayout';
import { useAuth } from '../context/AuthContext';
import skillService from '../services/skillService';
import projectService from '../services/projectService';

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mySkills, setMySkills] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [skillsRes, projectsRes] = await Promise.all([
        skillService.getMySkills(),
        projectService.getMyProjects(),
      ]);

      setMySkills(skillsRes.data);
      setMyProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const getProficiencyLabel = (level) => {
    if (level >= 4) return 'Expert';
    if (level >= 3) return 'Intermediate';
    if (level >= 2) return 'Beginner';
    return 'Novice';
  };

  const getProficiencyColor = (level) => {
    if (level >= 4) return 'text-green-600 bg-green-100';
    if (level >= 3) return 'text-blue-600 bg-blue-100';
    if (level >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Group skills by category
  const groupedSkills = mySkills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  // Sort skills by proficiency
  const sortedSkills = [...mySkills].sort((a, b) => b.proficiency_level - a.proficiency_level);

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-600 mt-1">View your profile information and statistics</p>
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

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-purple-600 shadow-lg">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="flex-1 text-white">
                <h3 className="text-3xl font-bold mb-1">{user?.full_name}</h3>
                <p className="text-purple-200 mb-3">{user?.email}</p>
                <div className="flex items-center space-x-4">
                  <span className="inline-block px-3 py-1 bg-white text-purple-600 rounded-full text-sm font-medium capitalize">
                    {user?.role}
                  </span>
                  <span className="text-purple-100 text-sm">
                    Member since {new Date(user?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="bg-white bg-opacity-10 px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">Profile Completion</span>
              <span className="text-white text-sm font-bold">{user?.profile_completion || 0}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${user?.profile_completion || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Skills</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{mySkills.length}</h3>
              </div>
              <div className="text-4xl opacity-30">🎯</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Expert Skills</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {mySkills.filter((s) => s.proficiency_level >= 4).length}
                </h3>
              </div>
              <div className="text-4xl opacity-30">⭐</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Projects</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{myProjects.length}</h3>
              </div>
              <div className="text-4xl opacity-30">📁</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Categories</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {Object.keys(groupedSkills).length}
                </h3>
              </div>
              <div className="text-4xl opacity-30">📚</div>
            </div>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Skills</h3>
          {sortedSkills.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No skills added yet</p>
          ) : (
            <div className="space-y-3">
              {sortedSkills.slice(0, 10).map((skill, index) => (
                <div key={skill.skill_id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl font-bold text-gray-300 w-8">#{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">{skill.skill_name}</span>
                        <span className="text-sm text-gray-500">{skill.category}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            skill.proficiency_level >= 4
                              ? 'bg-green-500'
                              : skill.proficiency_level >= 3
                              ? 'bg-blue-500'
                              : skill.proficiency_level >= 2
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${getProficiencyColor(
                      skill.proficiency_level
                    )}`}
                  >
                    {getProficiencyLabel(skill.proficiency_level)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills by Category</h3>
          {Object.keys(groupedSkills).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No skills added yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div
                  key={category}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-purple-200"
                >
                  <div className="text-3xl mb-2">📚</div>
                  <h4 className="font-semibold text-gray-800 mb-1">{category}</h4>
                  <p className="text-2xl font-bold text-purple-600">{skills.length}</p>
                  <p className="text-xs text-gray-600">
                    {skills.length === 1 ? 'skill' : 'skills'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Projects */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Projects</h3>
          {myProjects.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Not assigned to any projects yet</p>
          ) : (
            <div className="space-y-3">
              {myProjects.map((assignment) => (
                <div
                  key={assignment.project_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{assignment.project?.name || 'Unnamed Project'}</h4>
                      {assignment.project?.description && (
                        <p className="text-sm text-gray-600 mt-1">{assignment.project.description}</p>
                      )}
                    </div>
                    <span
                      className={`ml-4 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        assignment.project?.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : assignment.project?.status === 'Planning'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {assignment.project?.status || 'Unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProfile;
