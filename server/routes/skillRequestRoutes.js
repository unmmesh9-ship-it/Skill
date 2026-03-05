/**
 * Skill Request Routes
 */

const express = require('express');
const router = express.Router();
const {
  createSkillRequest,
  getMySkillRequests,
  getPendingRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  deleteSkillRequest,
  getRequestStats
} = require('../controllers/skillRequestController');
const { protect, authorize } = require('../middlewares/auth');

// Employee routes
router.post('/', protect, createSkillRequest);
router.get('/my-requests', protect, getMySkillRequests);
router.delete('/:id', protect, deleteSkillRequest);

// Admin routes
router.get('/pending', protect, authorize('admin'), getPendingRequests);
router.get('/stats', protect, authorize('admin'), getRequestStats);
router.get('/', protect, authorize('admin'), getAllRequests);
router.patch('/:id/approve', protect, authorize('admin'), approveRequest);
router.patch('/:id/reject', protect, authorize('admin'), rejectRequest);

module.exports = router;
