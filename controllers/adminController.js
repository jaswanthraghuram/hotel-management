const { getDashboardMetrics } = require('../services/reportService')
const { Room, Booking, Payment, FoodOrder, Complaint, User, AuditLog } = require('../models')

// Admin Dashboard & Analytics
exports.getDashboard = async (req, res) => {
  try {
    const metrics = await getDashboardMetrics()

    const recentBookings = await Booking.findAll({
      limit: 6,
      order: [['createdAt', 'DESC']]
    })

    const recentComplaints = await Complaint.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    })

    res.render('admin/dashboard', {
      title: 'Executive Command Center — Grand Haven Admin',
      metrics,
      recentBookings,
      recentComplaints
    })
  } catch (error) {
    console.error('[Admin Dashboard Error]', error)
    res.status(500).render('error', { title: 'Dashboard Error', statusCode: 500, message: 'Failed to load executive dashboard.' })
  }
}

// Admin Reports Page (Daily, Weekly, Monthly, Annual, Revenue, Occupancy, Food Sales)
exports.getReports = async (req, res) => {
  try {
    const totalPayments = await Payment.findAll({ order: [['createdAt', 'DESC']], limit: 20 })
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']], limit: 20 })
    const foodOrders = await FoodOrder.findAll({ order: [['createdAt', 'DESC']], limit: 20 })

    res.render('admin/reports/index', {
      title: 'Executive Financial & Analytics Reports — Admin Portal',
      payments: totalPayments,
      bookings,
      foodOrders
    })
  } catch (error) {
    res.redirect('/admin/dashboard')
  }
}

// Admin All Bookings List
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']]
    })

    res.render('admin/bookings/list', {
      title: 'Manage Bookings & Walk-ins — Admin Portal',
      bookings
    })
  } catch (error) {
    res.redirect('/admin/dashboard')
  }
}

// Admin Booking Detail View
exports.getBookingDetail = async (req, res) => {
  const { id } = req.params
  try {
    const booking = await Booking.findByPk(id, {
      include: [
        { model: Payment, as: 'payment' }
      ]
    })

    if (!booking) return res.redirect('/admin/bookings')

    res.render('admin/bookings/detail', {
      title: `Booking ${booking.bookingNumber} — Admin Portal`,
      booking
    })
  } catch (error) {
    res.redirect('/admin/bookings')
  }
}
