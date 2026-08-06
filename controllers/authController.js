const { User, Role, AuditLog } = require('../models')

exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect(req.session.user.roleId === 1 ? '/admin/dashboard' : '/customer/dashboard')
  }
  res.render('guest/login', {
    title: 'Sign In — Grand Haven Resort',
    error: req.query.error || null,
    success: req.query.success || null
  })
}

exports.postLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email }, include: [{ model: Role, as: 'role' }] })

    if (!user) {
      return res.render('guest/login', {
        title: 'Sign In — Grand Haven Resort',
        error: 'Invalid email or password combination.',
        success: null
      })
    }

    const isMatch = await user.validPassword(password)
    if (!isMatch) {
      return res.render('guest/login', {
        title: 'Sign In — Grand Haven Resort',
        error: 'Invalid email or password combination.',
        success: null
      })
    }

    // Set Session
    req.session.user = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      role: user.role ? user.role.name : (user.roleId === 1 ? 'Admin' : 'Customer')
    }

    // Audit Log
    await AuditLog.create({
      userId: user.id,
      userName: user.fullName,
      action: 'USER_LOGIN',
      details: `User logged in as ${user.role ? user.role.name : 'User'}`,
      ipAddress: req.ip
    }).catch(() => {})

    if (user.roleId === 1) {
      return res.redirect('/admin/dashboard')
    } else {
      return res.redirect('/customer/dashboard')
    }
  } catch (error) {
    console.error('[Login Error]', error)
    res.render('guest/login', {
      title: 'Sign In — Grand Haven Resort',
      error: 'An unexpected error occurred. Please try again.',
      success: null
    })
  }
}

exports.getRegister = (req, res) => {
  if (req.session.user) {
    return res.redirect('/customer/dashboard')
  }
  res.render('guest/register', {
    title: 'Create Account — Grand Haven Resort',
    error: null
  })
}

exports.postRegister = async (req, res) => {
  const { fullName, email, phone, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.render('guest/register', {
      title: 'Create Account — Grand Haven Resort',
      error: 'Passwords do not match!'
    })
  }

  try {
    const existing = await User.findOne({ where: { email } })
    if (existing) {
      return res.render('guest/register', {
        title: 'Create Account — Grand Haven Resort',
        error: 'An account with this email address already exists.'
      })
    }

    const newUser = await User.create({
      roleId: 2, // Customer
      fullName,
      email,
      phone,
      password,
      status: 'active'
    })

    req.session.user = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      roleId: 2,
      role: 'Customer'
    }

    res.redirect('/customer/dashboard')
  } catch (error) {
    console.error('[Register Error]', error)
    res.render('guest/register', {
      title: 'Create Account — Grand Haven Resort',
      error: 'Failed to create account. Please check your details.'
    })
  }
}

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}
