/**
 * ProjectAssignment Model - Sequelize
 * Junction table for many-to-many relationship between Users and Projects
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ProjectAssignment = sequelize.define('ProjectAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  assigned_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'project_assignments',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'project_id'],
    },
  ],
});

module.exports = ProjectAssignment;
