const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

// General Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
})

// Login Auth Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // limit login attempts
  message: 'Too many login attempts, please try again after 15 minutes.'
})

// Configure Security Headers
const configureSecurity = (app) => {
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for inline script tags (Chart.js & FontAwesome CDN)
    crossOriginEmbedderPolicy: false
  }))
}

module.exports = { apiLimiter, authLimiter, configureSecurity }
