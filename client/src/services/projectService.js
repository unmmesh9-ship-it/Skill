/**
 * Project Service
 * Handles all project-related API calls
 */

import API from './api';

const projectService = {
  // Get all projects
  getAllProjects: async () => {
    const response = await API.get('/projects');
    return response.data;
  },

  // Get project by ID
  getProjectById: async (id) => {
    const response = await API.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project (Admin)
  createProject: async (projectData) => {
    const response = await API.post('/projects', projectData);
    return response.data;
  },

  // Update project (Admin)
  updateProject: async (id, projectData) => {
    const response = await API.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project (Admin)
  deleteProject: async (id) => {
    const response = await API.delete(`/projects/${id}`);
    return response.data;
  },

  // Get user's projects
  getMyProjects: async () => {
    const response = await API.get('/projects/my-projects');
    return response.data;
  },

  // Get project team
  getProjectTeam: async (id) => {
    const response = await API.get(`/projects/${id}/team`);
    return response.data;
  },

  // Get project skills
  getProjectSkills: async (id) => {
    const response = await API.get(`/projects/${id}/skills`);
    return response.data;
  },

  // Get project analytics
  getProjectAnalytics: async (id, type) => {
    const response = await API.get(`/projects/${id}/analytics/${type}`);
    return response.data;
  },

  

  // Assign user to project (Admin)
  assignUserToProject: async (projectId, userId) => {
    const response = await API.post(`/projects/${projectId}/assign`, { user_id: userId });
    return response.data;
  },

  // Remove user from project (Admin)
  removeUserFromProject: async (projectId, userId) => {
    const response = await API.delete(`/projects/${projectId}/assign/${userId}`);
    return response.data;
  },

  // Get top projects (Admin)
  getTopProjects: async (limit = 10) => {
    const response = await API.get(`/projects/analytics/top?limit=${limit}`);
    return response.data;
  },

  // Get analytics data (Admin)
  getAnalytics: async (type, limit = 10) => {
    let endpoint = '';
    switch(type) {
      case 'overview':
        endpoint = '/projects/analytics/overview';
        break;
      case 'status':
        endpoint = '/projects/analytics/status';
        break;
      case 'top':
        endpoint = `/projects/analytics/top?limit=${limit}`;
        break;
      default:
        throw new Error('Invalid analytics type');
    }
    const response = await API.get(endpoint);
    return response.data;
  },
};

export default projectService;
