module.exports = {
  // Ensure user is logged in
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return next()
    }
    req.flash ? req.flash('error_msg', 'Please log in to access this page.') : null
    return res.redirect('/auth/login')
  },

  // Ensure user is an Admin
  isAdmin: (req, res, next) => {
    if (req.session && req.session.user && (req.session.user.roleId === 1 || req.session.user.role === 'Admin')) {
      return next()
    }
    req.flash ? req.flash('error_msg', 'Access denied. Administrator privileges required.') : null
    return res.redirect('/')
  },

  // Ensure user is a Customer or Admin
  isCustomer: (req, res, next) => {
    if (req.session && req.session.user) {
      return next()
    }
    return res.redirect('/auth/login')
  },

  // Inject current user into res.locals for EJS views
  setUserLocals: (req, res, next) => {
    res.locals.currentUser = req.session ? req.session.user || null : null
    res.locals.cart = req.session ? req.session.cart || [] : []
    res.locals.path = req.path
    next()
  }
}
