const PDFDocument = require('pdfkit')

const generateInvoicePDF = (booking, payment, res) => {
  const doc = new PDFDocument({ margin: 50 })

  // Stream PDF to HTTP Response
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=Invoice-${booking.bookingNumber}.pdf`)
  doc.pipe(res)

  // Header Banner
  doc.fillColor('#0f172a').fontSize(22).text('GRAND HAVEN RESORT & SPA', { align: 'center' })
  doc.fontSize(10).fillColor('#64748b').text('742 Luxury Boulevard, Ocean Bay | Phone: +1 800-555-0199', { align: 'center' })
  doc.moveDown()
  doc.strokeColor('#d97706').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke()
  doc.moveDown()

  // Invoice Meta Info
  doc.fontSize(16).fillColor('#d97706').text('OFFICIAL INVOICE & RECEIPT', { underline: true })
  doc.moveDown(0.5)

  doc.fontSize(10).fillColor('#0f172a')
  doc.text(`Invoice No: ${payment ? payment.paymentNumber : 'INV-' + booking.bookingNumber}`)
  doc.text(`Booking Ref: ${booking.bookingNumber}`)
  doc.text(`Date: ${new Date().toLocaleDateString()}`)
  doc.text(`Payment Status: ${payment ? payment.paymentStatus : 'Paid'}`)
  doc.text(`Payment Method: ${payment ? payment.paymentMethod : 'Credit Card'}`)
  doc.moveDown()

  // Guest Info
  doc.fontSize(12).fillColor('#0f172a').text('GUEST INFORMATION:', { bold: true })
  doc.fontSize(10).fillColor('#475569')
  doc.text(`Guest Name: ${booking.customerName}`)
  doc.text(`Email: ${booking.customerEmail}`)
  doc.text(`Phone: ${booking.customerPhone}`)
  doc.text(`Check-In Date: ${booking.checkInDate}`)
  doc.text(`Check-Out Date: ${booking.checkOutDate}`)
  doc.moveDown()

  // Itemized Table Header
  const tableTop = doc.y
  doc.fillColor('#0f172a').fontSize(11)
  doc.text('Description', 50, tableTop, { width: 250 })
  doc.text('Rate', 300, tableTop, { width: 80, align: 'right' })
  doc.text('Nights/Qty', 380, tableTop, { width: 80, align: 'right' })
  doc.text('Amount', 470, tableTop, { width: 80, align: 'right' })

  doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).strokeColor('#cbd5e1').stroke()
  let y = doc.y + 25

  // Booking Details
  if (booking.details && booking.details.length > 0) {
    booking.details.forEach((detail) => {
      doc.fontSize(10).fillColor('#334155')
      const roomName = detail.room ? `Room ${detail.room.roomNumber} (${detail.room.roomType ? detail.room.roomType.name : 'Suite'})` : 'Luxury Suite'
      doc.text(roomName, 50, y, { width: 250 })
      doc.text(`$${parseFloat(detail.pricePerNight).toFixed(2)}`, 300, y, { width: 80, align: 'right' })
      doc.text(`${detail.nights}`, 380, y, { width: 80, align: 'right' })
      doc.text(`$${parseFloat(detail.subtotal).toFixed(2)}`, 470, y, { width: 80, align: 'right' })
      y += 20
    })
  } else {
    doc.fontSize(10).fillColor('#334155')
    doc.text('Room Accommodation Services', 50, y, { width: 250 })
    doc.text(`$${parseFloat(booking.totalAmount).toFixed(2)}`, 300, y, { width: 80, align: 'right' })
    doc.text('1', 380, y, { width: 80, align: 'right' })
    doc.text(`$${parseFloat(booking.totalAmount).toFixed(2)}`, 470, y, { width: 80, align: 'right' })
    y += 20
  }

  doc.moveTo(50, y).lineTo(550, y).strokeColor('#cbd5e1').stroke()
  y += 15

  // Summary Totals
  const subtotal = parseFloat(booking.totalAmount)
  const gst = payment ? parseFloat(payment.gstAmount) : subtotal * 0.12
  const serviceCharge = payment ? parseFloat(payment.serviceCharge) : subtotal * 0.05
  const discount = payment ? parseFloat(payment.discount) : 0
  const finalTotal = payment ? parseFloat(payment.finalTotal) : subtotal + gst + serviceCharge - discount

  doc.fontSize(10).fillColor('#475569')
  doc.text('Subtotal:', 350, y, { width: 100, align: 'right' })
  doc.text(`$${subtotal.toFixed(2)}`, 470, y, { width: 80, align: 'right' })
  y += 18

  doc.text('GST (12%):', 350, y, { width: 100, align: 'right' })
  doc.text(`$${gst.toFixed(2)}`, 470, y, { width: 80, align: 'right' })
  y += 18

  doc.text('Service Charge (5%):', 350, y, { width: 100, align: 'right' })
  doc.text(`$${serviceCharge.toFixed(2)}`, 470, y, { width: 80, align: 'right' })
  y += 18

  if (discount > 0) {
    doc.text('Discount:', 350, y, { width: 100, align: 'right' })
    doc.text(`-$${discount.toFixed(2)}`, 470, y, { width: 80, align: 'right' })
    y += 18
  }

  doc.fontSize(12).fillColor('#d97706').text('Final Total:', 350, y, { width: 100, align: 'right' })
  doc.fontSize(12).fillColor('#d97706').text(`$${finalTotal.toFixed(2)}`, 470, y, { width: 80, align: 'right' })

  // Footer Note
  doc.moveDown(4)
  doc.fontSize(9).fillColor('#94a3b8').text('Thank you for choosing Grand Haven Resort & Spa. We wish you a delightful stay!', { align: 'center' })

  doc.end()
}

module.exports = { generateInvoicePDF }
