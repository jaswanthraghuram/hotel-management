const express = require('express')
const router = express.Router()
const foodController = require('../controllers/foodController')

router.get('/menu', foodController.getMenu)
router.post('/cart/add', foodController.addToCart)
router.post('/cart/clear', foodController.clearCart)
router.post('/checkout', foodController.postCheckoutOrder)

module.exports = router
