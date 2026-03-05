/**
 * Admin Users Page
 * Manage all users in the system
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import userService from '../services/userService';
import skillService from '../services/skillService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, admin, employee
  
  // Add user modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'employee'
  });
  
  // Skill management modal state
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState(3);
  const [loadingSkills, setLoadingSkills] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUserData.full_name || !newUserData.email || !newUserData.password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await userService.createUser(newUserData);
      setShowAddUserModal(false);
      setNewUserData({ full_name: '', email: '', password: '', role: 'employee' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleManageSkills = async (user) => {
    setSelectedUser(user);
    setShowSkillModal(true);
    setLoadingSkills(true);
    
    try {
      // Fetch user skills and all available skills in parallel
      const [userSkillsRes, allSkillsRes] = await Promise.all([
        skillService.getEmployeeSkillsAdmin(user.id),
        skillService.getAllSkills()
      ]);
      
      setUserSkills(userSkillsRes.data);
      setAllSkills(allSkillsRes.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to load skills');
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleAddSkillToEmployee = async () => {
    if (!selectedSkillId) {
      setError('Please select a skill');
      return;
    }

    try {
      await skillService.addSkillToEmployee(selectedUser.id, {
        skill_id: parseInt(selectedSkillId),
        proficiency_level: proficiency
      });
      
      // Refresh user skills
      const response = await skillService.getEmployeeSkillsAdmin(selectedUser.id);
      setUserSkills(response.data);
      setSelectedSkillId('');
      setProficiency(3);
    } catch (error) {
      console.error('Error adding skill:', error);
      setError(error.response?.data?.error || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId) => {
    if (!confirm('Are you sure you want to remove this skill?')) return;

    try {
      await skillService.removeSkillFromEmployee(selectedUser.id, skillId);
      
      // Refresh user skills
      const response = await skillService.getEmployeeSkillsAdmin(selectedUser.id);
      setUserSkills(response.data);
    } catch (error) {
      console.error('Error removing skill:', error);
      setError(error.response?.data?.message || 'Failed to remove skill');
    }
  };

  const handleUpdateProficiency = async (skillId, newProficiency) => {
    try {
      await skillService.updateEmployeeSkillProficiency(selectedUser.id, skillId, newProficiency);
      
      // Refresh user skills
      const response = await skillService.getEmployeeSkillsAdmin(selectedUser.id);
      setUserSkills(response.data);
    } catch (error) {
      console.error('Error updating proficiency:', error);
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || 'Failed to update proficiency. Please try again.';
      
      setError(errorMessage);
    }
  };

  const getProficiencyLabel = (level) => {
    const labels = {
      1: 'Novice',
      2: 'Beginner',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    };
    return labels[level] || 'Unknown';
  };

  // Get available skills (not already assigned to user)
  const availableSkills = allSkills.filter(
    skill => !userSkills.some(us => us.skill_id === skill.id)
  );

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

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
            <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
            <p className="text-gray-600 mt-2">Manage all users in the system</p>
          </div>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add New User
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

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'admin'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Admins ({users.filter(u => u.role === 'admin').length})
          </button>
          <button
            onClick={() => setFilter('employee')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'employee'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Employees ({users.filter(u => u.role === 'employee').length})
          </button>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile Completion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {user.full_name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.projects && user.projects.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.projects.map((project) => (
                            <span
                              key={project.id}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                project.status?.toLowerCase() === 'active'
                                  ? 'bg-blue-100 text-blue-800'
                                  : project.status?.toLowerCase() === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                              title={`Status: ${project.status || 'N/A'}`}
                            >
                              {project.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No projects</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${user.profile_completion}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{user.profile_completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {user.role === 'employee' && (
                          <button
                            onClick={() => handleManageSkills(user)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Manage Skills
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
      </div>

      {/* Skill Management Modal */}
      {showSkillModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Manage Skills - {selectedUser.full_name}
                </h3>
                <p className="text-gray-600 mt-1">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setShowSkillModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {loadingSkills ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Add New Skill Section */}
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">➕ Add New Skill</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Skill
                      </label>
                      <select
                        value={selectedSkillId}
                        onChange={(e) => setSelectedSkillId(e.target.value)}
                        className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proficiency: {proficiency}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={proficiency}
                        onChange={(e) => setProficiency(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-xs text-center text-gray-600 mt-1">
                        {getProficiencyLabel(proficiency)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleAddSkillToEmployee}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-emerald-700 transition-all"
                  >
                    Add Skill
                  </button>
                </div>

                {/* Current Skills Section */}
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4">
                    Current Skills ({userSkills.length})
                  </h4>
                  {userSkills.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No skills assigned yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userSkills.map((employeeSkill) => (
                        <div
                          key={employeeSkill.id}
                          className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-bold text-gray-800">
                                {employeeSkill.skill.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {employeeSkill.skill.category}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveSkill(employeeSkill.skill_id)}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Proficiency: {employeeSkill.proficiency_level} - {getProficiencyLabel(employeeSkill.proficiency_level)}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={employeeSkill.proficiency_level}
                              onChange={(e) => handleUpdateProficiency(employeeSkill.skill_id, parseInt(e.target.value))}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Novice</span>
                              <span>Expert</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSkillModal(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Add New User</h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUserData({ full_name: '', email: '', password: '', role: 'employee' });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newUserData.full_name}
                  onChange={(e) => setNewUserData({ ...newUserData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="user@skillmatrix.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter password"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUserData({ full_name: '', email: '', password: '', role: 'employee' });
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

export default AdminUsers;