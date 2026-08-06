const express = require('express')
const path = require('path')
const session = require('express-session')
const cors = require('cors')
require('dotenv').config()

const { initializeDatabase } = require('./config/database')
const seedDatabase = require('./seeders/seedData')
const { setUserLocals } = require('./middleware/authMiddleware')
const { apiLimiter, configureSecurity } = require('./middleware/securityMiddleware')
const errorHandler = require('./middleware/errorHandler')

// Import Routes
const indexRoutes = require('./routes/indexRoutes')
const authRoutes = require('./routes/authRoutes')
const roomRoutes = require('./routes/roomRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const foodRoutes = require('./routes/foodRoutes')
const complaintRoutes = require('./routes/complaintRoutes')
const customerRoutes = require('./routes/customerRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()
const PORT = process.env.PORT || 3000

// Initialize Database & Seeders safely for serverless
let initPromise = null
const initApp = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await initializeDatabase()
        await seedDatabase()
      } catch (err) {
        console.error('[App Init Warning]', err)
      }
    })()
  }
  return initPromise
}

// Middleware to ensure DB init on serverless request
app.use(async (req, res, next) => {
  try {
    await initApp()
  } catch (err) {
    // Continue gracefully
  }
  next()
})

// Security Configurations
configureSecurity(app)
app.use(cors())

// Body Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// View Engine & Static Directory
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'grandhaven_resort_secret_key_2026!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}))

// Local View Variables Middleware
app.use(setUserLocals)

// Mount Routes
app.use('/', indexRoutes)
app.use('/auth', authRoutes)
app.use('/rooms', roomRoutes)
app.use('/bookings', bookingRoutes)
app.use('/food', foodRoutes)
app.use('/complaints', complaintRoutes)
app.use('/customer', customerRoutes)
app.use('/admin', adminRoutes)

// Global Error Handler MUST be registered LAST after all routes!
app.use(errorHandler)

// Database & Server Startup for Local Dev
if (require.main === module) {
  initApp().then(() => {
    app.listen(PORT, () => {
      console.log(`=======================================================`)
      console.log(`🚀 Grand Haven Hotel Management Server Running!`)
      console.log(`🌐 Local URL: http://localhost:${PORT}/`)
      console.log(`🛡️  Admin Account: admin@grandhaven.com | Pass: admin123`)
      console.log(`👤 Customer Account: customer@grandhaven.com | Pass: customer123`)
      console.log(`=======================================================`)
    })
  })
}

module.exports = app
