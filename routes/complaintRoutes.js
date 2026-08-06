const express = require('express')
const router = express.Router()
const complaintController = require('../controllers/complaintController')
const { isAuthenticated } = require('../middleware/authMiddleware')

router.get('/raise', isAuthenticated, complaintController.getCreateComplaint)
router.post('/raise', isAuthenticated, complaintController.postCreateComplaint)

module.exports = router
