/**
 * Skill Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getMySkills,
  addEmployeeSkill,
  updateEmployeeSkill,
  deleteEmployeeSkill,
  getTopSkills,
  getSkillDistribution,
  getEmployeeSkills,
  addSkillToEmployee,
  removeSkillFromEmployee,
  updateEmployeeSkillProficiency
} = require('../controllers/skillController');
const { protect, authorize } = require('../middlewares/auth');
const {
  skillValidation,
  employeeSkillValidation,
  proficiencyUpdateValidation,
  validate
} = require('../middlewares/validation');

// Analytics routes (Admin only) - Must come before /:id
router.get('/analytics/top', protect, authorize('admin'), getTopSkills);
router.get('/analytics/distribution', protect, authorize('admin'), getSkillDistribution);

// Employee skill routes - Must come before /:id to avoid conflict
router.get('/employee/my-skills', protect, getMySkills);
router.post('/employee/add', protect, employeeSkillValidation, validate, addEmployeeSkill);
router.put('/employee/:id', protect, proficiencyUpdateValidation, validate, updateEmployeeSkill);
router.delete('/employee/:id', protect, deleteEmployeeSkill);

// Admin employee skill management routes
router.get('/admin/employee/:userId', protect, authorize('admin'), getEmployeeSkills);
router.post('/admin/employee/:userId', protect, authorize('admin'), employeeSkillValidation, validate, addSkillToEmployee);
router.put('/admin/employee/:userId/:skillId', protect, authorize('admin'), proficiencyUpdateValidation, validate, updateEmployeeSkillProficiency);
router.delete('/admin/employee/:userId/:skillId', protect, authorize('admin'), removeSkillFromEmployee);

// Skill CRUD routes - /:id route must come last
router.get('/', protect, getAllSkills);
router.post('/', protect, authorize('admin'), skillValidation, validate, createSkill);
router.get('/:id', protect, getSkillById); // Parameterized route at end
router.put('/:id', protect, authorize('admin'), skillValidation, validate, updateSkill);
router.delete('/:id', protect, authorize('admin'), deleteSkill);

module.exports = router;
