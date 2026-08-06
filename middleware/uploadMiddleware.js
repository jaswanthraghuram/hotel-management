const multer = require('multer')
const path = require('path')
const fs = require('fs')

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true'

// Ensure upload folders exist
const baseUploadPath = isVercel ? '/tmp' : path.join(__dirname, '../public/uploads')
const roomUploadDir = path.join(baseUploadPath, 'rooms')
const foodUploadDir = path.join(baseUploadPath, 'food')

try {
  if (!fs.existsSync(roomUploadDir)) fs.mkdirSync(roomUploadDir, { recursive: true })
  if (!fs.existsSync(foodUploadDir)) fs.mkdirSync(foodUploadDir, { recursive: true })
} catch (e) {
  // Ignore filesystem error in read-only environment
}

// Room Image Storage Strategy
const roomStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, roomUploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'room-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// Food Image Storage Strategy
const foodStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, foodUploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'food-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const imageFileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(new Error('Only image files (JPG, PNG, GIF, WEBP) are allowed!'))
  }
}

const uploadRoomImages = multer({
  storage: roomStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFileFilter
})

const uploadFoodImage = multer({
  storage: foodStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFileFilter
})

module.exports = { uploadRoomImages, uploadFoodImage }
