const { Booking, BookingDetail, Room, FoodOrder, Complaint, Payment } = require('../models')

exports.getDashboard = async (req, res) => {
  const userId = req.session.user ? req.session.user.id : null

  try {
    const activeBooking = await Booking.findOne({
      where: { userId, status: ['Confirmed', 'CheckedIn'] },
      include: [{ model: Payment, as: 'payment' }],
      order: [['createdAt', 'DESC']]
    })

    const previousBookings = await Booking.findAll({
      where: { userId, status: ['CheckedOut', 'Cancelled'] },
      limit: 5,
      order: [['createdAt', 'DESC']]
    })

    const foodOrders = await FoodOrder.findAll({
      where: { userId },
      limit: 5,
      order: [['createdAt', 'DESC']]
    })

    const complaints = await Complaint.findAll({
      where: { userId },
      limit: 5,
      order: [['createdAt', 'DESC']]
    })

    res.render('customer/dashboard', {
      title: 'Customer Dashboard — Grand Haven Resort',
      activeBooking,
      previousBookings,
      foodOrders,
      complaints
    })
  } catch (error) {
    console.error('[Customer Dashboard Error]', error)
    res.status(500).render('error', { title: 'Dashboard Error', statusCode: 500, message: 'Failed to load customer dashboard.' })
  }
}

exports.getBookings = async (req, res) => {
  const userId = req.session.user ? req.session.user.id : null
  try {
    const bookings = await Booking.findAll({
      where: { userId },
      include: [{ model: Payment, as: 'payment' }],
      order: [['createdAt', 'DESC']]
    })

    res.render('customer/bookings', {
      title: 'My Reservations History — Grand Haven',
      bookings
    })
  } catch (error) {
    res.redirect('/customer/dashboard')
  }
}

exports.getFoodOrders = async (req, res) => {
  const userId = req.session.user ? req.session.user.id : null
  try {
    const orders = await FoodOrder.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    })

    res.render('customer/food-orders', {
      title: 'My Room Service Orders — Grand Haven',
      orders
    })
  } catch (error) {
    res.redirect('/customer/dashboard')
  }
}
