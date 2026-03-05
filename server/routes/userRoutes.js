/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

// Protected routes - Employee can update their own profile
router.put('/profile', protect, updateProfile);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.post('/', protect, authorize('admin'), createUser);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
