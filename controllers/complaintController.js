const { Complaint, Room, User } = require('../models')

// Customer Raise Complaint Page & Post
exports.getCreateComplaint = async (req, res) => {
  res.render('customer/raise-complaint', {
    title: 'Raise Room Complaint / Service Request — Grand Haven',
    error: null
  })
}

exports.postCreateComplaint = async (req, res) => {
  const { roomNumber, category, description } = req.body
  const userId = req.session.user ? req.session.user.id : null

  try {
    const room = roomNumber ? await Room.findOne({ where: { roomNumber } }) : null
    const complaintNumber = 'CMP-' + Date.now().toString().slice(-5)

    await Complaint.create({
      complaintNumber,
      userId,
      roomId: room ? room.id : null,
      roomNumber: roomNumber || '201',
      category,
      description,
      status: 'Submitted'
    })

    res.redirect('/customer/complaints?submitted=1')
  } catch (error) {
    console.error('[Complaint Create Error]', error)
    res.render('customer/raise-complaint', {
      title: 'Raise Room Complaint',
      error: 'Failed to submit complaint ticket.'
    })
  }
}

// Customer View Complaints
exports.getCustomerComplaints = async (req, res) => {
  const userId = req.session.user ? req.session.user.id : null
  try {
    const complaints = await Complaint.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    })

    res.render('customer/complaints', {
      title: 'My Complaints & Service Tickets — Grand Haven',
      complaints
    })
  } catch (error) {
    res.redirect('/customer/dashboard')
  }
}

// Admin View All Complaints
exports.adminGetComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      order: [['createdAt', 'DESC']]
    })
    const staffMembers = await User.findAll({ where: { roleId: [1, 3] } })

    res.render('admin/complaints/list', {
      title: 'Manage Room Complaints — Admin Portal',
      complaints,
      staffMembers
    })
  } catch (error) {
    res.redirect('/admin/dashboard')
  }
}

// Admin Assign & Update Complaint Status
exports.adminUpdateComplaint = async (req, res) => {
  const { id } = req.params
  const { status, assignedStaffId, resolutionNotes } = req.body

  try {
    const complaint = await Complaint.findByPk(id)
    if (complaint) {
      const staff = assignedStaffId ? await User.findByPk(assignedStaffId) : null
      await complaint.update({
        status,
        assignedStaffId: assignedStaffId || complaint.assignedStaffId,
        assignedStaffName: staff ? staff.fullName : complaint.assignedStaffName,
        resolutionNotes
      })
    }
    res.redirect('/admin/complaints')
  } catch (error) {
    res.redirect('/admin/complaints')
  }
}
