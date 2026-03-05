/**
 * EmployeeSkill Model - Sequelize
 * Junction table for many-to-many relationship between Users and Skills
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const EmployeeSkill = sequelize.define('EmployeeSkill', {
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
  tableName: 'employee_skills',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'skill_id'],
    },
  ],
});

module.exports = EmployeeSkill;
