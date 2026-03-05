/**
 * Models Index
 * Sets up Sequelize models and their associations
 */

const sequelize = require('../config/sequelize');
const User = require('./UserModel');
const Skill = require('./SkillModel');
const Project = require('./ProjectModel');
const EmployeeSkill = require('./EmployeeSkillModel');
const ProjectAssignment = require('./ProjectAssignmentModel');
const SkillRequest = require('./SkillRequestModel');

// Define associations

// User <-> Skills (Many-to-Many through EmployeeSkill)
User.belongsToMany(Skill, {
  through: EmployeeSkill,
  foreignKey: 'user_id',
  otherKey: 'skill_id',
  as: 'skills',
});

Skill.belongsToMany(User, {
  through: EmployeeSkill,
  foreignKey: 'skill_id',
  otherKey: 'user_id',
  as: 'users',
});

// User <-> Projects (Many-to-Many through ProjectAssignment)
User.belongsToMany(Project, {
  through: ProjectAssignment,
  foreignKey: 'user_id',
  otherKey: 'project_id',
  as: 'projects',
});

Project.belongsToMany(User, {
  through: ProjectAssignment,
  foreignKey: 'project_id',
  otherKey: 'user_id',
  as: 'users',
});

// Direct associations for junction tables
EmployeeSkill.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
EmployeeSkill.belongsTo(Skill, { foreignKey: 'skill_id', as: 'skill' });

ProjectAssignment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ProjectAssignment.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// SkillRequest associations
SkillRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
SkillRequest.belongsTo(Skill, { foreignKey: 'skill_id', as: 'skill' });
SkillRequest.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

// Sync database (only in development, comment out in production)
const syncDatabase = async () => {
  try {
    // alter: true will attempt to sync without dropping tables
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Database sync error:', error);
  }
};

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Skill,
  Project,
  EmployeeSkill,
  ProjectAssignment,
  SkillRequest,
  syncDatabase,
};
