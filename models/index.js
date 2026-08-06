const { sequelize } = require('../config/database')
const Role = require('./Role')
const User = require('./User')
const RoomType = require('./RoomType')
const Room = require('./Room')
const RoomImage = require('./RoomImage')
const Booking = require('./Booking')
const BookingDetail = require('./BookingDetail')
const Payment = require('./Payment')
const FoodCategory = require('./FoodCategory')
const FoodItem = require('./FoodItem')
const FoodOrder = require('./FoodOrder')
const FoodOrderItem = require('./FoodOrderItem')
const Complaint = require('./Complaint')
const Review = require('./Review')
const Notification = require('./Notification')
const AuditLog = require('./AuditLog')

// Associations

// User - Role
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' })
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' })

// Room - RoomType
RoomType.hasMany(Room, { foreignKey: 'roomTypeId', as: 'rooms' })
Room.belongsTo(RoomType, { foreignKey: 'roomTypeId', as: 'roomType' })

// Room - RoomImage
Room.hasMany(RoomImage, { foreignKey: 'roomId', as: 'images', onDelete: 'CASCADE' })
RoomImage.belongsTo(Room, { foreignKey: 'roomId', as: 'room' })

// Booking - User
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' })
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Booking - BookingDetail
Booking.hasMany(BookingDetail, { foreignKey: 'bookingId', as: 'details', onDelete: 'CASCADE' })
BookingDetail.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' })

// BookingDetail - Room
Room.hasMany(BookingDetail, { foreignKey: 'roomId', as: 'bookingDetails' })
BookingDetail.belongsTo(Room, { foreignKey: 'roomId', as: 'room' })

// Booking - Payment
Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment', onDelete: 'CASCADE' })
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' })

// FoodItem - FoodCategory
FoodCategory.hasMany(FoodItem, { foreignKey: 'foodCategoryId', as: 'items' })
FoodItem.belongsTo(FoodCategory, { foreignKey: 'foodCategoryId', as: 'category' })

// FoodOrder - User
User.hasMany(FoodOrder, { foreignKey: 'userId', as: 'foodOrders' })
FoodOrder.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// FoodOrder - Room
Room.hasMany(FoodOrder, { foreignKey: 'roomId', as: 'foodOrders' })
FoodOrder.belongsTo(Room, { foreignKey: 'roomId', as: 'room' })

// FoodOrder - FoodOrderItem
FoodOrder.hasMany(FoodOrderItem, { foreignKey: 'foodOrderId', as: 'items', onDelete: 'CASCADE' })
FoodOrderItem.belongsTo(FoodOrder, { foreignKey: 'foodOrderId', as: 'order' })

// FoodOrderItem - FoodItem
FoodItem.hasMany(FoodOrderItem, { foreignKey: 'foodItemId', as: 'orderItems' })
FoodOrderItem.belongsTo(FoodItem, { foreignKey: 'foodItemId', as: 'foodItem' })

// Complaint - User & Room
User.hasMany(Complaint, { foreignKey: 'userId', as: 'complaints' })
Complaint.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Room.hasMany(Complaint, { foreignKey: 'roomId', as: 'complaints' })
Complaint.belongsTo(Room, { foreignKey: 'roomId', as: 'room' })

// Review - User
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' })
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Notification - User
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' })
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// AuditLog - User
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' })
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = {
  sequelize,
  Role,
  User,
  RoomType,
  Room,
  RoomImage,
  Booking,
  BookingDetail,
  Payment,
  FoodCategory,
  FoodItem,
  FoodOrder,
  FoodOrderItem,
  Complaint,
  Review,
  Notification,
  AuditLog
}
