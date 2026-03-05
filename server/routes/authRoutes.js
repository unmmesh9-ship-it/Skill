/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const {
  registerValidation,
  loginValidation,
  validate
} = require('../middlewares/validation');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
