const express = require('express')
const router = express.Router()
const { Room, RoomType, RoomImage } = require('../models')

router.get('/', async (req, res) => {
  try {
    const featuredRooms = await Room.findAll({
      where: { status: 'Available' },
      limit: 3,
      include: [
        { model: RoomType, as: 'roomType' },
        { model: RoomImage, as: 'images' }
      ]
    })

    res.render('guest/index', {
      title: 'Grand Haven Resort & Spa — 5-Star Oceanfront Luxury',
      featuredRooms
    })
  } catch (error) {
    console.error('[Index Error]', error)
    res.render('guest/index', {
      title: 'Grand Haven Resort & Spa',
      featuredRooms: []
    })
  }
})

module.exports = router
