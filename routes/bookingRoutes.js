const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')
const { isAuthenticated } = require('../middleware/authMiddleware')

router.get('/create', isAuthenticated, bookingController.getCreateBooking)
router.post('/create', isAuthenticated, bookingController.postCreateBooking)

router.get('/:id/invoice', isAuthenticated, bookingController.downloadInvoice)

module.exports = router
