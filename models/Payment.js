const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('Cash', 'Credit Card', 'Debit Card', 'UPI'),
    allowNull: false,
    defaultValue: 'Cash'
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Refunded', 'Failed'),
    defaultValue: 'Pending'
  },
  gstAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  serviceCharge: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  finalTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true
})

module.exports = Payment
