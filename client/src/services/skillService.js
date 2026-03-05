/**
 * Skill Service
 * Handles all skill-related API calls
 */

import API from './api';

const skillService = {
  // Get all skills
  getAllSkills: async () => {
    const response = await API.get('/skills');
    return response.data;
  },

  // Get skill by ID
  getSkillById: async (id) => {
    const response = await API.get(`/skills/${id}`);
    return response.data;
  },

  // Create new skill (Admin)
  createSkill: async (skillData) => {
    const response = await API.post('/skills', skillData);
    return response.data;
  },

  // Update skill (Admin)
  updateSkill: async (id, skillData) => {
    const response = await API.put(`/skills/${id}`, skillData);
    return response.data;
  },

  // Delete skill (Admin)
  deleteSkill: async (id) => {
    const response = await API.delete(`/skills/${id}`);
    return response.data;
  },

  // Get employee's skills
  getMySkills: async () => {
    const response = await API.get('/skills/employee/my-skills');
    return response.data;
  },

  // Add skill to employee
  addEmployeeSkill: async (skillData) => {
    const response = await API.post('/skills/employee/add', skillData);
    return response.data;
  },

  // Update employee skill proficiency
  updateEmployeeSkill: async (id, proficiencyLevel) => {
    const response = await API.put(`/skills/employee/${id}`, { proficiency_level: proficiencyLevel });
    return response.data;
  },

  // Delete employee skill
  deleteEmployeeSkill: async (id) => {
    const response = await API.delete(`/skills/employee/${id}`);
    return response.data;
  },

  // Get top skills (Admin)
  getTopSkills: async (limit = 20) => {
    const response = await API.get(`/skills/analytics/top?limit=${limit}`);
    return response.data;
  },

  // Get skill distribution (Admin)
  getSkillDistribution: async () => {
    const response = await API.get('/skills/analytics/distribution');
    return response.data;
  },

  // Admin: Get skills for a specific employee
  getEmployeeSkillsAdmin: async (userId) => {
    const response = await API.get(`/skills/admin/employee/${userId}`);
    return response.data;
  },

  // Admin: Add skill to employee
  addSkillToEmployee: async (userId, skillData) => {
    const response = await API.post(`/skills/admin/employee/${userId}`, skillData);
    return response.data;
  },

  // Admin: Update employee skill proficiency
  updateEmployeeSkillProficiency: async (userId, skillId, proficiencyLevel) => {
    const response = await API.put(`/skills/admin/employee/${userId}/${skillId}`, { proficiency_level: proficiencyLevel });
    return response.data;
  },

  // Admin: Remove skill from employee
  removeSkillFromEmployee: async (userId, skillId) => {
    const response = await API.delete(`/skills/admin/employee/${userId}/${skillId}`);
    return response.data;
  },
};

export default skillService;
