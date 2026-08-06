const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const BookingDetail = sequelize.define('BookingDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  nights: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'booking_details',
  timestamps: true
})

module.exports = BookingDetail
