const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const FoodOrderItem = sequelize.define('FoodOrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  foodOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  foodItemId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  foodItemName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'food_order_items',
  timestamps: true
})

module.exports = FoodOrderItem
