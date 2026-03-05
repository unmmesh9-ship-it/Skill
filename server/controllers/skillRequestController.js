/**
 * Skill Request Controller
 * Handles skill request creation and admin approval/rejection
 */

const { SkillRequest, User, Skill, EmployeeSkill } = require('../models');

/**
 * @desc    Create a new skill request (Employee)
 * @route   POST /api/skill-requests
 * @access  Private (Employee)
 */
const createSkillRequest = async (req, res) => {
  try {
    const { skill_id, proficiency_level, request_message } = req.body;
    const user_id = req.user.id;

    // Check if skill exists
    const skill = await Skill.findByPk(skill_id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if user already has this skill
    const existingSkill = await EmployeeSkill.findOne({
      where: { user_id, skill_id }
    });

    if (existingSkill) {
      return res.status(400).json({ message: 'You already have this skill' });
    }

    // Check if there's already a pending request
    const pendingRequest = await SkillRequest.findOne({
      where: {
        user_id,
        skill_id,
        status: 'pending'
      }
    });

    if (pendingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this skill' });
    }

    // Create skill request
    const skillRequest = await SkillRequest.create({
      user_id,
      skill_id,
      proficiency_level: proficiency_level || 3,
      request_message,
      status: 'pending'
    });

    // Fetch the request with associations
    const requestWithDetails = await SkillRequest.findByPk(skillRequest.id, {
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name', 'category']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Skill request created successfully',
      data: requestWithDetails
    });
  } catch (error) {
    console.error('Error creating skill request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all skill requests for current user (Employee)
 * @route   GET /api/skill-requests/my-requests
 * @access  Private (Employee)
 */
const getMySkillRequests = async (req, res) => {
  try {
    const user_id = req.user.id;

    const requests = await SkillRequest.findAll({
      where: { user_id },
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name', 'category']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'full_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      message: 'Skill requests retrieved successfully',
      data: requests
    });
  } catch (error) {
    console.error('Error fetching skill requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all pending skill requests (Admin)
 * @route   GET /api/skill-requests/pending
 * @access  Private (Admin)
 */
const getPendingRequests = async (req, res) => {
  try {
    const requests = await SkillRequest.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name', 'category']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json({
      message: 'Pending requests retrieved successfully',
      data: requests
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all skill requests (Admin)
 * @route   GET /api/skill-requests
 * @access  Private (Admin)
 */
const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = status ? { status } : {};

    const requests = await SkillRequest.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name', 'category']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'full_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      message: 'Skill requests retrieved successfully',
      data: requests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Approve skill request (Admin)
 * @route   PATCH /api/skill-requests/:id/approve
 * @access  Private (Admin)
 */
const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_response } = req.body;
    const reviewer_id = req.user.id;

    // Find the request
    const request = await SkillRequest.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name', 'category']
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    // Check if user already has the skill (in case it was added after request)
    const existingSkill = await EmployeeSkill.findOne({
      where: {
        user_id: request.user_id,
        skill_id: request.skill_id
      }
    });

    if (existingSkill) {
      // Update request as approved but don't add duplicate skill
      await request.update({
        status: 'approved',
        admin_response: admin_response || 'Skill already assigned',
        reviewed_by: reviewer_id,
        reviewed_at: new Date()
      });

      return res.json({
        message: 'Request approved (skill already assigned)',
        data: request
      });
    }

    // Add the skill to employee_skills
    await EmployeeSkill.create({
      user_id: request.user_id,
      skill_id: request.skill_id,
      proficiency_level: request.proficiency_level
    });

    // Update request status
    await request.update({
      status: 'approved',
      admin_response: admin_response || 'Request approved',
      reviewed_by: reviewer_id,
      reviewed_at: new Date()
    });

    res.json({
      message: 'Request approved successfully',
      data: request
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Reject skill request (Admin)
 * @route   PATCH /api/skill-requests/:id/reject
 * @access  Private (Admin)
 */
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_response } = req.body;
    const reviewer_id = req.user.id;

    // Find the request
    const request = await SkillRequest.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name', 'category']
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    // Update request status
    await request.update({
      status: 'rejected',
      admin_response: admin_response || 'Request rejected',
      reviewed_by: reviewer_id,
      reviewed_at: new Date()
    });

    res.json({
      message: 'Request rejected',
      data: request
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete skill request (Employee - only their own pending requests)
 * @route   DELETE /api/skill-requests/:id
 * @access  Private (Employee)
 */
const deleteSkillRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const request = await SkillRequest.findOne({
      where: {
        id,
        user_id,
        status: 'pending'
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found or cannot be deleted' });
    }

    await request.destroy();

    res.json({
      message: 'Request cancelled successfully'
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get request statistics (Admin)
 * @route   GET /api/skill-requests/stats
 * @access  Private (Admin)
 */
const getRequestStats = async (req, res) => {
  try {
    const { Op } = require('sequelize');

    const totalRequests = await SkillRequest.count();
    const pendingRequests = await SkillRequest.count({ where: { status: 'pending' } });
    const approvedRequests = await SkillRequest.count({ where: { status: 'approved' } });
    const rejectedRequests = await SkillRequest.count({ where: { status: 'rejected' } });

    // Requests by category
    const requestsByCategory = await SkillRequest.findAll({
      attributes: [
        [Skill.sequelize.col('skill.category'), 'category'],
        [Skill.sequelize.fn('COUNT', Skill.sequelize.col('SkillRequest.id')), 'count']
      ],
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: []
        }
      ],
      group: ['skill.category'],
      raw: true
    });

    res.json({
      message: 'Request statistics retrieved successfully',
      data: {
        total: totalRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
        byCategory: requestsByCategory
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createSkillRequest,
  getMySkillRequests,
  getPendingRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  deleteSkillRequest,
  getRequestStats
};
