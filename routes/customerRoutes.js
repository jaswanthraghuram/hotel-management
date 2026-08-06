const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')
const complaintController = require('../controllers/complaintController')
const { isAuthenticated } = require('../middleware/authMiddleware')

router.use(isAuthenticated)

router.get('/dashboard', customerController.getDashboard)
router.get('/bookings', customerController.getBookings)
router.get('/food-orders', customerController.getFoodOrders)
router.get('/complaints', complaintController.getCustomerComplaints)

module.exports = router
