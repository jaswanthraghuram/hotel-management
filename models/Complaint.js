const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  complaintNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  roomNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM(
      'AC Problem',
      'TV Problem',
      'WiFi Problem',
      'Bathroom Problem',
      'Water Leakage',
      'Electricity',
      'Cleaning Request',
      'Food Issue',
      'Room Service Delay',
      'Other'
    ),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'),
    defaultValue: 'Submitted'
  },
  assignedStaffId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  assignedStaffName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  resolutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'complaints',
  timestamps: true
})

module.exports = Complaint
