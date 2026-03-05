/**
 * SkillRequest Model - Sequelize
 * Table for skill requests from employees requiring admin approval
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SkillRequest = sequelize.define('SkillRequest', {
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
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'skills',
      key: 'id',
    },
  },
  proficiency_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    validate: {
      min: 1,
      max: 5
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
  request_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  admin_response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reviewed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'skill_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = SkillRequest;
