const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const FoodOrder = sequelize.define('FoodOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
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
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Preparing', 'Ready', 'Delivered', 'Completed', 'Cancelled'),
    defaultValue: 'Pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'food_orders',
  timestamps: true
})

module.exports = FoodOrder
