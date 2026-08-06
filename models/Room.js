const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  roomTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Available', 'Reserved', 'Booked', 'Occupied', 'Cleaning', 'Maintenance', 'Out of Service'),
    allowNull: false,
    defaultValue: 'Available'
  },
  isBookable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  amenities: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'rooms',
  timestamps: true
})

module.exports = Room
