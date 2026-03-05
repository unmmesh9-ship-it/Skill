/**
 * Project Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects,
  getProjectTeam,
  assignUserToProject,
  removeUserFromProject,
  getTopProjects,
  getProjectStatusDistribution,
  getProjectOverview
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/auth');
const {
  projectValidation,
  validate
} = require('../middlewares/validation');

// Analytics routes (Admin only)
router.get('/analytics/top', protect, authorize('admin'), getTopProjects);
router.get('/analytics/status', protect, authorize('admin'), getProjectStatusDistribution);
router.get('/analytics/overview', protect, authorize('admin'), getProjectOverview);

// Employee routes
router.get('/my-projects', protect, getMyProjects);

// Project CRUD routes
router.get('/', protect, getAllProjects);
router.get('/:id', protect, getProjectById);
router.post('/', protect, authorize('admin'), projectValidation, validate, createProject);
router.put('/:id', protect, authorize('admin'), projectValidation, validate, updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

// Project assignment routes (Admin only)
router.get('/:id/team', protect, getProjectTeam);
router.post('/:id/assign', protect, authorize('admin'), assignUserToProject);
router.delete('/:id/assign/:userId', protect, authorize('admin'), removeUserFromProject);

module.exports = router;
