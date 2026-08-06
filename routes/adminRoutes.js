const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const roomController = require('../controllers/roomController')
const bookingController = require('../controllers/bookingController')
const foodController = require('../controllers/foodController')
const complaintController = require('../controllers/complaintController')
const { isAdmin } = require('../middleware/authMiddleware')
const { uploadRoomImages } = require('../middleware/uploadMiddleware')

router.use(isAdmin)

// Executive Dashboard & Reports
router.get('/dashboard', adminController.getDashboard)
router.get('/reports', adminController.getReports)

// Room Inventory Management
router.get('/rooms', roomController.adminGetRooms)
router.get('/rooms/add', roomController.adminGetAddRoom)
router.post('/rooms/add', uploadRoomImages.array('roomImages', 5), roomController.adminPostAddRoom)
router.get('/rooms/edit/:id', roomController.adminGetEditRoom)
router.post('/rooms/edit/:id', uploadRoomImages.array('roomImages', 5), roomController.adminPostEditRoom)
router.post('/rooms/delete/:id', roomController.adminDeleteRoom)

// Bookings & Offline Walk-ins
router.get('/bookings', adminController.getBookings)
router.get('/bookings/walkin', bookingController.adminGetWalkinBooking)
router.post('/bookings/walkin', bookingController.adminPostWalkinBooking)
router.get('/bookings/:id', adminController.getBookingDetail)
router.post('/bookings/:id/checkin', bookingController.adminCheckIn)
router.post('/bookings/:id/checkout', bookingController.adminCheckOut)

// Food Orders
router.get('/food/orders', foodController.adminGetOrders)
router.post('/food/orders/:id/status', foodController.adminUpdateOrderStatus)

// Complaints Management
router.get('/complaints', complaintController.adminGetComplaints)
router.post('/complaints/:id/update', complaintController.adminUpdateComplaint)

module.exports = router
