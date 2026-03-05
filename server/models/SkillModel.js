/**
 * Skill Model - Sequelize
 * Defines Skill schema and associations
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'skills',
  timestamps: false,
});

module.exports = Skill;
