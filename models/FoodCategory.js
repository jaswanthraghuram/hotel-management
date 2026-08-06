const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const FoodCategory = sequelize.define('FoodCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(50),
    defaultValue: 'fa-utensils'
  }
}, {
  tableName: 'food_categories',
  timestamps: true
})

module.exports = FoodCategory
