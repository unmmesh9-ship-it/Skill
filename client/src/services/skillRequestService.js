/**
 * Skill Request Service
 * API calls for skill request functionality
 */

import api from './api';

const skillRequestService = {
  // Employee endpoints
  createRequest: async (data) => {
    const response = await api.post('/skill-requests', data);
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/skill-requests/my-requests');
    return response.data;
  },

  deleteRequest: async (id) => {
    const response = await api.delete(`/skill-requests/${id}`);
    return response.data;
  },

  // Admin endpoints
  getPendingRequests: async () => {
    const response = await api.get('/skill-requests/pending');
    return response.data;
  },

  getAllRequests: async (status = null) => {
    const response = await api.get('/skill-requests', {
      params: status ? { status } : {}
    });
    return response.data;
  },

  approveRequest: async (id, data = {}) => {
    const response = await api.patch(`/skill-requests/${id}/approve`, data);
    return response.data;
  },

  rejectRequest: async (id, data = {}) => {
    const response = await api.patch(`/skill-requests/${id}/reject`, data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/skill-requests/stats');
    return response.data;
  }
};

export default skillRequestService;
