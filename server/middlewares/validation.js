/**
 * Validation Middleware
 * Common validation rules using express-validator
 */

const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * User registration validation rules
 */
exports.registerValidation = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name must be between 2 and 255 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'employee'])
    .withMessage('Role must be either admin or employee')
];

/**
 * Login validation rules
 */
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Skill validation rules
 */
exports.skillValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Skill name must be between 2 and 255 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters')
];

/**
 * Project validation rules
 */
exports.projectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Project name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim()
];

/**
 * Employee skill validation rules
 */
exports.employeeSkillValidation = [
  body('skill_id')
    .notEmpty()
    .withMessage('Skill ID is required')
    .isInt({ min: 1 })
    .withMessage('Skill ID must be a positive integer'),
  body('proficiency_level')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Proficiency level must be between 1 and 5')
];

/**
 * Proficiency update validation rules
 */
exports.proficiencyUpdateValidation = [
  body('proficiency_level')
    .notEmpty()
    .withMessage('Proficiency level is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Proficiency level must be between 1 and 5')
];
