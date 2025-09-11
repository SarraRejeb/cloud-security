const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const QuizResult = sequelize.define('QuizResult', {
  riskScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recommendations: {
    type: DataTypes.JSONB, // Store recommendations as JSONB
    defaultValue: [],
  },
  owaspIssues: {
    type: DataTypes.JSONB, // Store OWASP issues as JSONB
    defaultValue: [],
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(QuizResult);
QuizResult.belongsTo(User);

module.exports = QuizResult;