const { Booking, BookingDetail, Room, RoomType, Payment, User, AuditLog } = require('../models')
const { generateInvoicePDF } = require('../services/pdfService')

// Customer Create Booking Page
exports.getCreateBooking = async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.query
  try {
    const room = await Room.findByPk(roomId, { include: [{ model: RoomType, as: 'roomType' }] })
    if (!room) return res.redirect('/rooms')

    res.render('customer/create-booking', {
      title: 'Book Room — Grand Haven Resort',
      room,
      checkInDate: checkInDate || new Date().toISOString().split('T')[0],
      checkOutDate: checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]
    })
  } catch (error) {
    res.redirect('/rooms')
  }
}

// Customer Submit Online Booking
exports.postCreateBooking = async (req, res) => {
  const { roomId, checkInDate, checkOutDate, paymentMethod, specialRequests } = req.body
  const userId = req.session.user ? req.session.user.id : null

  try {
    const room = await Room.findByPk(roomId)
    if (!room || room.status !== 'Available') {
      return res.status(400).render('error', { title: 'Room Unavailable', statusCode: 400, message: 'Selected room is no longer available.' })
    }

    // Calculate Nights & Total
    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    const diffTime = Math.abs(end - start)
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    const subtotal = parseFloat(room.price) * nights
    const gstAmount = subtotal * 0.12
    const serviceCharge = subtotal * 0.05
    const finalTotal = subtotal + gstAmount + serviceCharge

    const bookingNumber = 'GH-ONLINE-' + Date.now().toString().slice(-6)

    // Create Booking Record
    const booking = await Booking.create({
      bookingNumber,
      userId,
      customerName: req.session.user.fullName,
      customerEmail: req.session.user.email,
      customerPhone: req.session.user.phone || '+1 800-555-0100',
      bookingType: 'Online',
      checkInDate,
      checkOutDate,
      status: 'Confirmed',
      totalAmount: subtotal,
      specialRequests
    })

    // Create Detail
    await BookingDetail.create({
      bookingId: booking.id,
      roomId: room.id,
      pricePerNight: room.price,
      nights,
      subtotal
    })

    // Create Payment Record
    const paymentNumber = 'PAY-' + Date.now().toString().slice(-6)
    await Payment.create({
      bookingId: booking.id,
      paymentNumber,
      amount: subtotal,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'Paid',
      gstAmount,
      serviceCharge,
      finalTotal,
      paidAt: new Date()
    })

    // Update Room Status to Reserved/Booked
    await room.update({ status: 'Reserved' })

    res.redirect(`/customer/bookings/${booking.id}?success=1`)
  } catch (error) {
    console.error('[Booking Create Error]', error)
    res.status(500).render('error', { title: 'Booking Error', statusCode: 500, message: 'Failed to process reservation.' })
  }
}

// Admin Offline Walk-In Booking Wizard
exports.adminGetWalkinBooking = async (req, res) => {
  try {
    const availableRooms = await Room.findAll({
      where: { status: 'Available', isBookable: true },
      include: [{ model: RoomType, as: 'roomType' }]
    })

    res.render('admin/bookings/walkin', {
      title: 'Offline Walk-In Booking — Admin Portal',
      availableRooms
    })
  } catch (error) {
    res.redirect('/admin/dashboard')
  }
}

exports.adminPostWalkinBooking = async (req, res) => {
  const { customerName, customerEmail, customerPhone, roomId, checkInDate, checkOutDate, paymentMethod } = req.body

  try {
    const room = await Room.findByPk(roomId)
    if (!room) return res.redirect('/admin/bookings/walkin')

    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    const nights = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)))
    const subtotal = parseFloat(room.price) * nights
    const gstAmount = subtotal * 0.12
    const serviceCharge = subtotal * 0.05
    const finalTotal = subtotal + gstAmount + serviceCharge

    const bookingNumber = 'GH-WALKIN-' + Date.now().toString().slice(-6)

    const booking = await Booking.create({
      bookingNumber,
      customerName,
      customerEmail,
      customerPhone,
      bookingType: 'Offline',
      checkInDate,
      checkOutDate,
      status: 'CheckedIn', // Direct Check-in for Walk-ins
      totalAmount: subtotal
    })

    await BookingDetail.create({
      bookingId: booking.id,
      roomId: room.id,
      pricePerNight: room.price,
      nights,
      subtotal
    })

    await Payment.create({
      bookingId: booking.id,
      paymentNumber: 'PAY-WALKIN-' + Date.now().toString().slice(-6),
      amount: subtotal,
      paymentMethod: paymentMethod || 'Cash',
      paymentStatus: 'Paid',
      gstAmount,
      serviceCharge,
      finalTotal,
      paidAt: new Date()
    })

    // Mark Room Occupied Immediately for Walk-in Check-in
    await room.update({ status: 'Occupied' })

    res.redirect(`/admin/bookings/${booking.id}?walkin=success`)
  } catch (error) {
    console.error('[Walk-in Error]', error)
    res.redirect('/admin/bookings/walkin')
  }
}

// Admin Check-In Action
exports.adminCheckIn = async (req, res) => {
  const { id } = req.params
  try {
    const booking = await Booking.findByPk(id, { include: [{ model: BookingDetail, as: 'details' }] })
    if (booking) {
      await booking.update({ status: 'CheckedIn' })
      if (booking.details && booking.details.length > 0) {
        for (const detail of booking.details) {
          await Room.update({ status: 'Occupied' }, { where: { id: detail.roomId } })
        }
      }
    }
    res.redirect(`/admin/bookings/${id}`)
  } catch (error) {
    res.redirect('/admin/bookings')
  }
}

// Admin Check-Out Action
// CRITICAL REQUIREMENT: Room becomes Available automatically after Check-Out!
exports.adminCheckOut = async (req, res) => {
  const { id } = req.params
  try {
    const booking = await Booking.findByPk(id, { include: [{ model: BookingDetail, as: 'details' }] })
    if (booking) {
      await booking.update({ status: 'CheckedOut' })
      if (booking.details && booking.details.length > 0) {
        for (const detail of booking.details) {
          // Room becomes Available automatically!
          await Room.update({ status: 'Available' }, { where: { id: detail.roomId } })
        }
      }

      await AuditLog.create({
        userId: req.session.user ? req.session.user.id : null,
        userName: req.session.user ? req.session.user.fullName : 'Admin',
        action: 'CHECK_OUT',
        details: `Booking ${booking.bookingNumber} checked out. Rooms marked Available automatically.`
      }).catch(() => {})
    }
    res.redirect(`/admin/bookings/${id}`)
  } catch (error) {
    res.redirect('/admin/bookings')
  }
}

// Download PDF Invoice
exports.downloadInvoice = async (req, res) => {
  const { id } = req.params
  try {
    const booking = await Booking.findByPk(id, {
      include: [
        { model: BookingDetail, as: 'details', include: [{ model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] }] },
        { model: Payment, as: 'payment' }
      ]
    })

    if (!booking) return res.status(404).send('Booking invoice not found.')

    generateInvoicePDF(booking, booking.payment, res)
  } catch (error) {
    console.error('[Invoice Download Error]', error)
    res.status(500).send('Error generating invoice PDF.')
  }
}
