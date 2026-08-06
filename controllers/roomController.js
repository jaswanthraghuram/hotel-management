const { Room, RoomType, RoomImage } = require('../models')
const { Op } = require('sequelize')

// Public Room Catalog Page
exports.getRooms = async (req, res) => {
  const { roomTypeId, minPrice, maxPrice, status } = req.query

  const whereClause = {}
  if (roomTypeId) whereClause.roomTypeId = roomTypeId
  if (status) whereClause.status = status
  if (minPrice || maxPrice) {
    whereClause.price = {}
    if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice)
    if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice)
  }

  try {
    const rooms = await Room.findAll({
      where: whereClause,
      include: [
        { model: RoomType, as: 'roomType' },
        { model: RoomImage, as: 'images' }
      ],
      order: [['roomNumber', 'ASC']]
    })

    const roomTypes = await RoomType.findAll()

    res.render('guest/rooms', {
      title: 'Luxury Accommodations & Suites — Grand Haven',
      rooms,
      roomTypes,
      query: req.query
    })
  } catch (error) {
    console.error('[Room Controller Error]', error)
    res.status(500).render('error', { title: 'Error', statusCode: 500, message: 'Failed to load rooms.' })
  }
}

// Room Details Page
exports.getRoomDetail = async (req, res) => {
  const { id } = req.params
  try {
    const room = await Room.findByPk(id, {
      include: [
        { model: RoomType, as: 'roomType' },
        { model: RoomImage, as: 'images' }
      ]
    })

    if (!room) {
      return res.status(404).render('error', { title: 'Room Not Found', statusCode: 404, message: 'The requested suite could not be found.' })
    }

    res.render('guest/room-detail', {
      title: `Room ${room.roomNumber} (${room.roomType ? room.roomType.name : 'Suite'}) — Grand Haven`,
      room
    })
  } catch (error) {
    console.error('[Room Detail Error]', error)
    res.status(500).render('error', { title: 'Error', statusCode: 500, message: 'Failed to load room details.' })
  }
}

// Admin List Rooms
exports.adminGetRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        { model: RoomType, as: 'roomType' },
        { model: RoomImage, as: 'images' }
      ],
      order: [['roomNumber', 'ASC']]
    })
    const roomTypes = await RoomType.findAll()

    res.render('admin/rooms/list', {
      title: 'Manage Room Inventory — Admin Portal',
      rooms,
      roomTypes
    })
  } catch (error) {
    console.error('[Admin Room Error]', error)
    res.status(500).render('error', { title: 'Error', statusCode: 500, message: 'Failed to load admin room list.' })
  }
}

// Admin Add Room Page & Post
exports.adminGetAddRoom = async (req, res) => {
  const roomTypes = await RoomType.findAll()
  res.render('admin/rooms/add', { title: 'Add New Room — Admin Portal', roomTypes })
}

exports.adminPostAddRoom = async (req, res) => {
  const { roomNumber, roomTypeId, floor, price, status, isBookable, description, amenities } = req.body

  try {
    const newRoom = await Room.create({
      roomNumber,
      roomTypeId,
      floor: parseInt(floor) || 1,
      price: parseFloat(price),
      status: status || 'Available',
      isBookable: isBookable === 'on' || isBookable === 'true',
      description,
      amenities
    })

    // Handle Uploaded Images
    if (req.files && req.files.length > 0) {
      const imageRecords = req.files.map((file, idx) => ({
        roomId: newRoom.id,
        imageUrl: `/uploads/rooms/${file.filename}`,
        isPrimary: idx === 0
      }))
      await RoomImage.bulkCreate(imageRecords)
    }

    res.redirect('/admin/rooms')
  } catch (error) {
    console.error('[Add Room Error]', error)
    const roomTypes = await RoomType.findAll()
    res.render('admin/rooms/add', { title: 'Add New Room', roomTypes, error: 'Failed to create room. Room number may already exist.' })
  }
}

// Admin Edit Room Page & Post
exports.adminGetEditRoom = async (req, res) => {
  const { id } = req.params
  try {
    const room = await Room.findByPk(id, { include: [{ model: RoomImage, as: 'images' }] })
    const roomTypes = await RoomType.findAll()

    if (!room) return res.redirect('/admin/rooms')

    res.render('admin/rooms/edit', {
      title: `Edit Room ${room.roomNumber} — Admin Portal`,
      room,
      roomTypes
    })
  } catch (error) {
    res.redirect('/admin/rooms')
  }
}

exports.adminPostEditRoom = async (req, res) => {
  const { id } = req.params
  const { roomNumber, roomTypeId, floor, price, status, isBookable, description, amenities } = req.body

  try {
    const room = await Room.findByPk(id)
    if (room) {
      await room.update({
        roomNumber,
        roomTypeId,
        floor: parseInt(floor),
        price: parseFloat(price),
        status,
        isBookable: isBookable === 'on' || isBookable === 'true',
        description,
        amenities
      })

      // Handle New Uploaded Images
      if (req.files && req.files.length > 0) {
        const imageRecords = req.files.map((file, idx) => ({
          roomId: room.id,
          imageUrl: `/uploads/rooms/${file.filename}`,
          isPrimary: idx === 0
        }))
        await RoomImage.bulkCreate(imageRecords)
      }
    }
    res.redirect('/admin/rooms')
  } catch (error) {
    console.error('[Edit Room Error]', error)
    res.redirect('/admin/rooms')
  }
}

// Admin Delete Room
exports.adminDeleteRoom = async (req, res) => {
  const { id } = req.params
  try {
    await Room.destroy({ where: { id } })
    res.redirect('/admin/rooms')
  } catch (error) {
    console.error('[Delete Room Error]', error)
    res.redirect('/admin/rooms')
  }
}
