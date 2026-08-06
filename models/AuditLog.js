const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  userName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  timestamps: true
})

module.exports = AuditLog
