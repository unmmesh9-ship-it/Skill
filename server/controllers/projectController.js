/**
 * Project Controller
 * Handles project and project assignment operations
 */

const { User, Project, ProjectAssignment, sequelize } = require('../models');

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Private
 */
exports.getAllProjects = async (req, res, next) => {
  try {
    console.log('🔍 getAllProjects called by user:', req.user?.email);
    
    const projects = await Project.findAll({
      include: [{
        model: User,
        as: 'users',
        attributes: [],
        through: { attributes: [] }
      }],
      attributes: [
        'id',
        'name',
        'description',
        'status',
        'start_date',
        'end_date',
        'created_at',
        'updated_at',
        [sequelize.fn('COUNT', sequelize.col('users.id')), 'team_size']
      ],
      group: ['Project.id'],
      order: [['created_at', 'DESC']],
      subQuery: false,
      raw: false
    });

    // Convert to plain objects and parse team_size
    const projectsData = projects.map(p => {
      const plain = p.get({ plain: true });
      return {
        ...plain,
        team_size: parseInt(plain.team_size) || 0
      };
    });

    console.log(`✅ Returning ${projectsData.length} projects`);
    console.log('Sample project:', projectsData[0]?.name, '- Team:', projectsData[0]?.team_size);

    res.status(200).json({
      success: true,
      count: projectsData.length,
      data: projectsData
    });
  } catch (error) {
    console.error('❌ Error in getAllProjects:', error.message);
    next(error);
  }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project
 * @access  Private
 */
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private/Admin
 */
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, status, start_date, end_date } = req.body;

    const project = await Project.create({
      name,
      description,
      status: status || 'Active',
      start_date,
      end_date,
      created_by: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private/Admin
 */
exports.updateProject = async (req, res, next) => {
  try {
    const { name, description, status, start_date, end_date } = req.body;

    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.update({
      name,
      description,
      status,
      start_date,
      end_date,
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private/Admin
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/my-projects
 * @desc    Get logged in user's projects
 * @access  Private
 */
exports.getMyProjects = async (req, res, next) => {
  try {
    console.log('🔍 getMyProjects called for user:', req.user.id, req.user.email);
    
    const projectAssignments = await ProjectAssignment.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Project,
        as: 'project',
        attributes: ['id', 'name', 'description', 'status', 'start_date', 'end_date', 'created_at', 'updated_at']
      }],
      order: [['assigned_at', 'DESC']],
      raw: false,
      nest: true
    });
    
    // Convert Sequelize instances to plain JSON objects
    const projects = projectAssignments.map(pa => ({
      id: pa.id,
      user_id: pa.user_id,
      project_id: pa.project_id,
      assigned_at: pa.assigned_at,
      project: pa.project ? {
        id: pa.project.id,
        name: pa.project.name,
        description: pa.project.description,
        status: pa.project.status,
        start_date: pa.project.start_date,
        end_date: pa.project.end_date,
        created_at: pa.project.created_at,
        updated_at: pa.project.updated_at
      } : null
    }));
    
    console.log('📦 Projects found:', projects.length);
    console.log('📋 Sample project:', projects[0]);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('❌ Error in getMyProjects:', error);
    next(error);
  }
};

/**
 * @route   GET /api/projects/:id/team
 * @desc    Get project team members
 * @access  Private
 */
exports.getProjectTeam = async (req, res, next) => {
  try {
    const team = await ProjectAssignment.findAll({
      where: { project_id: req.params.id },
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] }
      }]
    });

    res.status(200).json({
      success: true,
      count: team.length,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/projects/:id/assign
 * @desc    Assign user to project
 * @access  Private/Admin
 */
exports.assignUserToProject = async (req, res, next) => {
  try {
    const { user_id, role, assigned_date } = req.body;

    const assignment = await ProjectAssignment.create({
      user_id,
      project_id: req.params.id,
      role,
      assigned_date
    });

    res.status(201).json({
      success: true,
      message: 'User assigned to project successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/projects/:id/assign/:userId
 * @desc    Remove user from project
 * @access  Private/Admin
 */
exports.removeUserFromProject = async (req, res, next) => {
  try {
    const assignment = await ProjectAssignment.findOne({
      where: {
        project_id: req.params.id,
        user_id: req.params.userId
      }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    await assignment.destroy();

    res.status(200).json({
      success: true,
      message: 'User removed from project successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/analytics/top
 * @desc    Get top projects by team size
 * @access  Private/Admin
 */
exports.getTopProjects = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    console.log('🔍 getTopProjects called with limit:', limit);
    
    const projects = await Project.findAll({
      include: [{
        model: User,
        as: 'users',
        attributes: [],
        through: { attributes: [] }
      }],
      attributes: [
        'id',
        'name',
        'description',
        'status',
        [sequelize.fn('COUNT', sequelize.col('users.id')), 'team_size']
      ],
      group: ['Project.id', 'Project.name', 'Project.description', 'Project.status'],
      order: [[sequelize.literal('team_size'), 'DESC']],
      limit,
      subQuery: false,
      raw: true
    });

    // Convert team_size from string to integer
    const formattedProjects = projects.map(p => ({
      ...p,
      team_size: parseInt(p.team_size) || 0
    }));

    console.log(`✅ Returning ${formattedProjects.length} top projects`);

    res.status(200).json({
      success: true,
      count: formattedProjects.length,
      data: formattedProjects
    });
  } catch (error) {
    console.error('❌ Error in getTopProjects:', error.message);
    next(error);
  }
};

/**
 * @route   GET /api/projects/analytics/status
 * @desc    Get project distribution by status
 * @access  Private/Admin
 */
exports.getProjectStatusDistribution = async (req, res, next) => {
  try {
    const distribution = await Project.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    res.status(200).json({
      success: true,
      count: distribution.length,
      data: distribution
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/analytics/overview
 * @desc    Get project overview statistics
 * @access  Private/Admin
 */
exports.getProjectOverview = async (req, res, next) => {
  try {
    const totalProjects = await Project.count();
    const activeProjects = await Project.count({ where: { status: 'Active' } });
    const completedProjects = await Project.count({ where: { status: 'Completed' } });
    const onHoldProjects = await Project.count({ where: { status: 'On Hold' } });

    const totalAssignments = await ProjectAssignment.count();
    
    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        completedProjects,
        onHoldProjects,
        totalAssignments,
        averageTeamSize: totalProjects > 0 ? (totalAssignments / totalProjects).toFixed(1) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};
