/**
 * Skill Controller
 * Handles skill and employee skill operations
 */

const { Skill, EmployeeSkill, User, sequelize } = require('../models');

/**
 * @route   GET /api/skills
 * @desc    Get all skills
 * @access  Private
 */
exports.getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.findAll({
      order: [['category', 'ASC'], ['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/skills/:id
 * @desc    Get single skill
 * @access  Private
 */
exports.getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/skills
 * @desc    Create new skill
 * @access  Private/Admin
 */
exports.createSkill = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    const skill = await Skill.create({ 
      name,
      category
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/skills/:id
 * @desc    Update skill
 * @access  Private/Admin
 */
exports.updateSkill = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    await skill.update({ 
      name,
      category
    });

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete skill
 * @access  Private/Admin
 */
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    await skill.destroy();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/skills/employee/my-skills
 * @desc    Get logged in employee's skills
 * @access  Private
 */
exports.getMySkills = async (req, res, next) => {
  try {
    const employeeSkills = await EmployeeSkill.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Skill,
        as: 'skill',
        attributes: ['id', 'name', 'category', 'created_at']
      }],
      order: [['created_at', 'DESC']],
      raw: false,
      nest: true
    });

    // Convert Sequelize instances to plain JSON objects with proper structure
    const skills = employeeSkills.map(es => ({
      id: es.id,
      user_id: es.user_id,
      skill_id: es.skill_id,
      proficiency_level: es.proficiency_level,
      created_at: es.created_at,
      updated_at: es.updated_at,
      // Flatten skill data to match expected structure
      skill_name: es.skill?.name || '',
      name: es.skill?.name || '',
      category: es.skill?.category || ''
    }));

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    console.error('getMySkills error:', error);
    next(error);
  }
};

/**
 * @route   POST /api/skills/employee/add
 * @desc    Add skill to employee profile
 * @access  Private
 */
exports.addEmployeeSkill = async (req, res, next) => {
  try {
    const { skill_id, proficiency_level } = req.body;

    // Check if skill already exists for this user
    const existingSkill = await EmployeeSkill.findOne({
      where: {
        user_id: req.user.id,
        skill_id
      }
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        error: 'You already have this skill. Update it instead of adding again.'
      });
    }

    const employeeSkill = await EmployeeSkill.create({
      user_id: req.user.id,
      skill_id,
      proficiency_level: proficiency_level || 3
    });

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: employeeSkill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/skills/employee/:id
 * @desc    Update employee skill proficiency
 * @access  Private
 */
exports.updateEmployeeSkill = async (req, res, next) => {
  try {
    const { proficiency_level } = req.body;

    // Validate proficiency level
    if (!proficiency_level || proficiency_level < 1 || proficiency_level > 5) {
      return res.status(400).json({
        success: false,
        error: 'Proficiency level must be between 1 and 5'
      });
    }

    const employeeSkill = await EmployeeSkill.findByPk(req.params.id);

    if (!employeeSkill) {
      return res.status(404).json({
        success: false,
        error: 'Employee skill not found'
      });
    }

    // Verify the skill belongs to the requesting user
    if (employeeSkill.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own skills'
      });
    }

    await employeeSkill.update({
      proficiency_level: parseInt(proficiency_level)
    });

    res.status(200).json({
      success: true,
      message: 'Skill proficiency updated successfully',
      data: employeeSkill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/skills/employee/:id
 * @desc    Remove skill from employee profile
 * @access  Private
 */
exports.deleteEmployeeSkill = async (req, res, next) => {
  try {
    const employeeSkill = await EmployeeSkill.findByPk(req.params.id);

    if (!employeeSkill) {
      return res.status(404).json({
        success: false,
        message: 'Employee skill not found'
      });
    }

    await employeeSkill.destroy();

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/skills/analytics/top
 * @desc    Get top skills across organization
 * @access  Private/Admin
 */
exports.getTopSkills = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    console.log('🔍 getTopSkills called with limit:', limit);
    
    const skills = await Skill.findAll({
      include: [{
        model: User,
        as: 'users',
        attributes: [],
        through: { 
          attributes: []
        }
      }],
      attributes: [
        'id',
        'name',
        'category',
        [sequelize.fn('COUNT', sequelize.col('users.id')), 'employee_count'],
        [sequelize.fn('AVG', sequelize.col('users->EmployeeSkill.proficiency_level')), 'avg_proficiency']
      ],
      group: ['Skill.id', 'Skill.name', 'Skill.category'],
      order: [[sequelize.literal('employee_count'), 'DESC']],
      limit,
      subQuery: false,
      raw: true
    });

    // Convert employee_count and avg_proficiency from string to numbers
    const formattedSkills = skills.map(skill => ({
      ...skill,
      employee_count: parseInt(skill.employee_count, 10) || 0,
      avg_proficiency: skill.avg_proficiency ? parseFloat(skill.avg_proficiency).toFixed(1) : '0.0'
    }));

    console.log(`✅ Returning ${formattedSkills.length} top skills`);

    res.status(200).json({
      success: true,
      count: formattedSkills.length,
      data: formattedSkills
    });
  } catch (error) {
    console.error('❌ Error in getTopSkills:', error.message);
    next(error);
  }
};

/**
 * @route   GET /api/skills/analytics/distribution
 * @desc    Get skill distribution by category (employee count per category)
 * @access  Private/Admin
 */
exports.getSkillDistribution = async (req, res, next) => {
  try {
    console.log('🔍 getSkillDistribution called');
    
    // Get distribution of employees per skill category
    const distribution = await EmployeeSkill.findAll({
      attributes: [
        [sequelize.col('skill.category'), 'category'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('EmployeeSkill.user_id'))), 'employee_count']
      ],
      include: [{
        model: Skill,
        as: 'skill',
        attributes: []
      }],
      group: [sequelize.col('skill.category')],
      order: [[sequelize.literal('employee_count'), 'DESC']],
      raw: true
    });

    // Convert employee_count from string to integer
    const formattedDistribution = distribution.map(item => ({
      category: item.category,
      employee_count: parseInt(item.employee_count, 10) || 0
    }));

    console.log(`✅ Returning distribution for ${formattedDistribution.length} categories`);

    res.status(200).json({
      success: true,
      count: formattedDistribution.length,
      data: formattedDistribution
    });
  } catch (error) {
    console.error('❌ Error in getSkillDistribution:', error.message);
    next(error);
  }
};

/**
 * @route   GET /api/skills/admin/employee/:userId
 * @desc    Get all skills for a specific employee (Admin only)
 * @access  Private/Admin
 */
exports.getEmployeeSkills = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const employeeSkills = await EmployeeSkill.findAll({
      where: { user_id: userId },
      include: [{
        model: Skill,
        as: 'skill',
        attributes: ['id', 'name', 'category']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: employeeSkills.length,
      data: employeeSkills
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/skills/admin/employee/:userId
 * @desc    Add skill to employee (Admin only)
 * @access  Private/Admin
 */
exports.addSkillToEmployee = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { skill_id, proficiency_level } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if skill exists
    const skill = await Skill.findByPk(skill_id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    // Check if employee already has this skill
    const existingSkill = await EmployeeSkill.findOne({
      where: {
        user_id: userId,
        skill_id
      }
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        error: 'Employee already has this skill'
      });
    }

    // Add skill to employee
    const employeeSkill = await EmployeeSkill.create({
      user_id: userId,
      skill_id,
      proficiency_level: proficiency_level || 3
    });

    // Fetch the complete data with skill details
    const result = await EmployeeSkill.findByPk(employeeSkill.id, {
      include: [{
        model: Skill,
        as: 'skill',
        attributes: ['id', 'name', 'category']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Skill added to employee successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/skills/admin/employee/:userId/:skillId
 * @desc    Remove skill from employee (Admin only)
 * @access  Private/Admin
 */
exports.removeSkillFromEmployee = async (req, res, next) => {
  try {
    const { userId, skillId } = req.params;

    const employeeSkill = await EmployeeSkill.findOne({
      where: {
        user_id: userId,
        skill_id: skillId
      }
    });

    if (!employeeSkill) {
      return res.status(404).json({
        success: false,
        message: 'Employee skill not found'
      });
    }

    await employeeSkill.destroy();

    res.status(200).json({
      success: true,
      message: 'Skill removed from employee successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/skills/admin/employee/:userId/:skillId
 * @desc    Update employee skill proficiency (Admin only)
 * @access  Private/Admin
 */
exports.updateEmployeeSkillProficiency = async (req, res, next) => {
  try {
    const { userId, skillId } = req.params;
    const { proficiency_level } = req.body;

    // Validate inputs
    if (!userId || !skillId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and Skill ID are required'
      });
    }

    if (!proficiency_level || proficiency_level < 1 || proficiency_level > 5) {
      return res.status(400).json({
        success: false,
        error: 'Proficiency level must be between 1 and 5'
      });
    }

    const employeeSkill = await EmployeeSkill.findOne({
      where: {
        user_id: parseInt(userId),
        skill_id: parseInt(skillId)
      }
    });

    if (!employeeSkill) {
      return res.status(404).json({
        success: false,
        error: 'Employee skill not found'
      });
    }

    await employeeSkill.update({
      proficiency_level: parseInt(proficiency_level)
    });

    // Fetch updated data with skill details
    const result = await EmployeeSkill.findByPk(employeeSkill.id, {
      include: [{
        model: Skill,
        as: 'skill',
        attributes: ['id', 'name', 'category']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Skill proficiency updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
