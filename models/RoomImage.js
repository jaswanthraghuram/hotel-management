const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const RoomImage = sequelize.define('RoomImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'room_images',
  timestamps: true
})

module.exports = RoomImage
