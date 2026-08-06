const { FoodCategory, FoodItem, FoodOrder, FoodOrderItem, Room } = require('../models')

// Public / Customer Food Menu Page
exports.getMenu = async (req, res) => {
  const { categoryId } = req.query
  try {
    const categories = await FoodCategory.findAll()
    const whereClause = { isAvailable: true }
    if (categoryId) whereClause.foodCategoryId = categoryId

    const foodItems = await FoodItem.findAll({
      where: whereClause,
      include: [{ model: FoodCategory, as: 'category' }]
    })

    res.render('guest/food-menu', {
      title: 'In-Room Gourmet Dining & Menu — Grand Haven',
      categories,
      foodItems,
      selectedCategoryId: categoryId || null,
      cart: req.session.cart || []
    })
  } catch (error) {
    res.status(500).render('error', { title: 'Error', statusCode: 500, message: 'Failed to load food menu.' })
  }
}

// Add Item to Room Service Cart (AJAX / POST)
exports.addToCart = async (req, res) => {
  const { foodItemId, quantity } = req.body
  const qty = parseInt(quantity) || 1

  try {
    const item = await FoodItem.findByPk(foodItemId)
    if (!item) return res.status(404).json({ success: false, message: 'Food item not found.' })

    if (!req.session.cart) req.session.cart = []

    const existingIndex = req.session.cart.findIndex(i => i.foodItemId === item.id)
    if (existingIndex > -1) {
      req.session.cart[existingIndex].quantity += qty
      req.session.cart[existingIndex].subtotal = (req.session.cart[existingIndex].quantity * parseFloat(item.price)).toFixed(2)
    } else {
      req.session.cart.push({
        foodItemId: item.id,
        name: item.name,
        price: parseFloat(item.price).toFixed(2),
        quantity: qty,
        subtotal: (qty * parseFloat(item.price)).toFixed(2)
      })
    }

    const totalCount = req.session.cart.reduce((sum, i) => sum + i.quantity, 0)
    const cartTotal = req.session.cart.reduce((sum, i) => sum + parseFloat(i.subtotal), 0).toFixed(2)

    return res.json({ success: true, cart: req.session.cart, totalCount, cartTotal })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Cart operation failed.' })
  }
}

// Clear Cart
exports.clearCart = (req, res) => {
  req.session.cart = []
  if (req.xhr || req.headers.accept.includes('json')) {
    return res.json({ success: true })
  }
  res.redirect('/food/menu')
}

// Checkout Room Service Order
exports.postCheckoutOrder = async (req, res) => {
  const { roomNumber, specialInstructions } = req.body
  const cart = req.session.cart || []

  if (cart.length === 0) {
    return res.redirect('/food/menu')
  }

  try {
    const totalAmount = cart.reduce((sum, i) => sum + parseFloat(i.subtotal), 0).toFixed(2)
    const orderNumber = 'FO-' + Date.now().toString().slice(-6)

    const room = roomNumber ? await Room.findOne({ where: { roomNumber } }) : null

    const order = await FoodOrder.create({
      orderNumber,
      userId: req.session.user ? req.session.user.id : 2,
      roomId: room ? room.id : null,
      roomNumber: roomNumber || 'Suite 201',
      status: 'Pending',
      totalAmount,
      specialInstructions
    })

    const orderItems = cart.map(i => ({
      foodOrderId: order.id,
      foodItemId: i.foodItemId,
      foodItemName: i.name,
      quantity: i.quantity,
      price: i.price,
      subtotal: i.subtotal
    }))

    await FoodOrderItem.bulkCreate(orderItems)

    // Reset Cart
    req.session.cart = []

    res.redirect(`/customer/food-orders?placed=1`)
  } catch (error) {
    console.error('[Food Checkout Error]', error)
    res.redirect('/food/menu')
  }
}

// Admin Food Orders Pipeline
exports.adminGetOrders = async (req, res) => {
  try {
    const orders = await FoodOrder.findAll({
      include: [{ model: FoodOrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    })

    res.render('admin/food/orders', {
      title: 'Manage Room Service Orders — Admin Portal',
      orders
    })
  } catch (error) {
    res.redirect('/admin/dashboard')
  }
}

// Admin Update Food Order Status
exports.adminUpdateOrderStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const order = await FoodOrder.findByPk(id)
    if (order) {
      await order.update({ status })
    }
    res.redirect('/admin/food/orders')
  } catch (error) {
    res.redirect('/admin/food/orders')
  }
}
