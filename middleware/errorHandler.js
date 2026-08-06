module.exports = (err, req, res, next) => {
  console.error('[Error Handler] Stack:', err.stack)

  const statusCode = err.statusCode || 500
  const message = err.message || 'An unexpected internal server error occurred.'

  if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
    return res.status(statusCode).json({ success: false, error: message })
  }

  res.status(statusCode).render('error', {
    title: 'Error Occurred — Grand Haven',
    statusCode,
    message,
    currentUser: req.session ? req.session.user : null
  })
}
