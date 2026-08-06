const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const RoomType = sequelize.define('RoomType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.ENUM('Single', 'Double', 'Deluxe', 'Family', 'Suite'),
    allowNull: false,
    unique: true
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  amenities: {
    type: DataTypes.TEXT, // Comma separated or JSON string
    allowNull: true
  }
}, {
  tableName: 'room_types',
  timestamps: true
})

module.exports = RoomType
