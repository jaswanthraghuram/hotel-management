const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true // Nullable for walk-in guest without prior online account
  },
  customerName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  customerEmail: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  customerPhone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  bookingType: {
    type: DataTypes.ENUM('Online', 'Offline'),
    defaultValue: 'Online'
  },
  checkInDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkOutDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'),
    defaultValue: 'Pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: true
})

module.exports = Booking
