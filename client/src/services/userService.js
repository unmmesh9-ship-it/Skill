/**
 * User Service
 * Handles all user-related API calls
 */

import API from './api';

const userService = {
  // Get all users (Admin)
  getAllUsers: async (role = null) => {
    const url = role ? `/users?role=${role}` : '/users';
    const response = await API.get(url);
    return response.data;
  },

  // Get user by ID (Admin)
  getUserById: async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },

  // Create new user (Admin)
  createUser: async (userData) => {
    const response = await API.post('/users', userData);
    return response.data;
  },

  // Update user (Admin)
  updateUser: async (id, userData) => {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (Admin)
  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  },

  // Update own profile
  updateProfile: async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  },
};

export default userService;
