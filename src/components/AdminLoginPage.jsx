import { useState } from 'react'
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Building2,
  Check,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Fingerprint
} from 'lucide-react'
import heroImage from '../assets/luxury_resort.png'

export default function AdminLoginPage({ onAdminLoginSuccess, onSwitchToGuest, theme, toggleTheme }) {
  const [adminId, setAdminId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberSession, setRememberSession] = useState(true)

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleQuickFillAdmin = () => {
    setErrors({})
    setGeneralError('')
    setAdminId('ADM-99401-EXEC')
    setEmail('admin.vance@grandhaven.com')
    setPassword('Executive#Admin2026!')
    setTwoFactorCode('849204')
  }

  const validateForm = () => {
    const newErrors = {}
    if (!adminId.trim()) {
      newErrors.adminId = 'Admin Security ID is required'
    }

    if (!email) {
      newErrors.email = 'Executive Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    }

    if (!twoFactorCode) {
      newErrors.twoFactorCode = '2FA Security Token is required'
    } else if (twoFactorCode.length < 6) {
      newErrors.twoFactorCode = '2FA code must be 6 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setGeneralError('')

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate High-Security 2FA Authentication API Call
    setTimeout(() => {
      setIsLoading(false)

      if (twoFactorCode === '000000') {
        setGeneralError('Invalid 2FA Authenticator Token. Session rejected.')
        return
      }

      onAdminLoginSuccess({
        name: 'Lord Alexander Vance',
        email: email,
        adminId: adminId,
        role: 'Chief Executive Administrator',
        securityClearance: 'Level 5 (Master Access)'
      })
    }, 1200)
  }

  return (
    <div className="auth-page-container">
      {/* Dark Gold Ambient Orbs for Executive Feel */}
      <div className="ambient-orb-1" style={{ background: 'radial-gradient(circle, rgba(217, 119, 6, 0.3) 0%, rgba(0,0,0,0) 70%)' }}></div>
      <div className="ambient-orb-2" style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(0,0,0,0) 70%)' }}></div>

      <div className="auth-split-wrapper" style={{ borderColor: 'rgba(217, 119, 6, 0.35)' }}>
        {/* Left Side: Admin Auth Form */}
        <div className="auth-form-side">
          <div>
            {/* Header & Back to Guest Login Switcher */}
            <div className="brand-header">
              <a href="#home" className="brand-logo">
                <div className="logo-badge" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid #d97706' }}>
                  <Building2 size={24} color="#f59e0b" />
                </div>
                <div>
                  <div className="brand-name" style={{ color: 'var(--accent-gold)' }}>ADMIN PORTAL</div>
                  <div className="brand-sub">Grand Haven Executive</div>
                </div>
              </a>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="theme-toggle-btn"
                  onClick={toggleTheme}
                  type="button"
                >
                  {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#0284c7" />}
                </button>

                <button
                  className="theme-toggle-btn"
                  onClick={onSwitchToGuest}
                  type="button"
                  style={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}
                >
                  <ArrowLeft size={14} /> Guest Login
                </button>
              </div>
            </div>

            {/* Restricted Area Alert Badge */}
            <div
              style={{
                background: 'rgba(217, 119, 6, 0.12)',
                border: '1px solid var(--accent-gold)',
                padding: '10px 14px',
                borderRadius: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.82rem',
                color: 'var(--accent-gold)',
                fontWeight: 600
              }}
            >
              <ShieldAlert size={18} />
              <span>Restricted System — Authorized Executive Personnel Only</span>
            </div>

            {/* Title */}
            <div className="auth-title-group">
              <h1 className="auth-title">Executive Admin Portal</h1>
              <p className="auth-subtitle">
                Enter your Admin Credentials & 2FA Security Token to access master hotel operations.
              </p>
            </div>

            {/* Demo Quick Fill for Admin */}
            <div className="demo-banner" style={{ background: 'rgba(15, 23, 42, 0.5)', borderColor: 'var(--accent-gold)' }}>
              <div className="demo-banner-title">
                <Sparkles size={14} /> Executive Testing Shortcut
              </div>
              <div className="demo-buttons-row">
                <button type="button" className="demo-chip" onClick={handleQuickFillAdmin} style={{ borderColor: 'var(--accent-gold)' }}>
                  <Fingerprint size={12} color="#f59e0b" /> Fill Admin Credentials + 2FA
                </button>
              </div>
            </div>

            {/* Error Message */}
            {generalError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={18} />
                <span>{generalError}</span>
              </div>
            )}

            {/* Admin Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Admin Security ID */}
              <div className="form-group">
                <label className="form-label">Admin Security ID</label>
                <div className="input-wrapper">
                  <Fingerprint className="input-icon" size={18} />
                  <input
                    type="text"
                    className={`form-input ${errors.adminId ? 'has-error' : ''}`}
                    placeholder="e.g. ADM-99401-EXEC"
                    value={adminId}
                    onChange={(e) => {
                      setAdminId(e.target.value)
                      if (errors.adminId) setErrors({ ...errors, adminId: null })
                    }}
                  />
                </div>
                {errors.adminId && <span className="error-message">{errors.adminId}</span>}
              </div>

              {/* Admin Email */}
              <div className="form-group">
                <label className="form-label">Executive Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                    placeholder="admin.vance@grandhaven.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: null })
                    }}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Master Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'has-error' : ''}`}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: null })
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* 2FA Token Code */}
              <div className="form-group">
                <label className="form-label">
                  2FA Authenticator Token
                </label>
                <div className="input-wrapper">
                  <KeyRound className="input-icon" size={18} />
                  <input
                    type="text"
                    maxLength={6}
                    className={`form-input ${errors.twoFactorCode ? 'has-error' : ''}`}
                    placeholder="6-digit PIN (e.g. 849204)"
                    value={twoFactorCode}
                    onChange={(e) => {
                      setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))
                      if (errors.twoFactorCode) setErrors({ ...errors, twoFactorCode: null })
                    }}
                    style={{ letterSpacing: '0.25em', fontWeight: 700 }}
                  />
                </div>
                {errors.twoFactorCode && <span className="error-message">{errors.twoFactorCode}</span>}
              </div>

              {/* Options Row */}
              <div className="options-bar">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <div className="custom-checkbox">
                    {rememberSession && <Check size={13} strokeWidth={3} />}
                  </div>
                  <span>Encrypted Admin Session</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  border: '1.5px solid #d97706',
                  color: '#f59e0b',
                  boxShadow: '0 10px 20px -5px rgba(0,0,0,0.5)'
                }}
              >
                {isLoading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <ShieldCheck size={20} color="#f59e0b" />
                    <span>Authenticate Admin Portal</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="auth-footer">
            Protected by 256-bit Hardware Security Module & IP Monitoring.
          </div>
        </div>

        {/* Right Side: Admin Hero Visual Panel */}
        <div
          className="auth-hero-side"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(9,13,22,0.95) 100%)' }} />

          <div className="hero-content-top">
            <div className="hero-badge" style={{ borderColor: '#d97706', background: 'rgba(217, 119, 6, 0.2)', color: '#f59e0b' }}>
              <ShieldCheck size={16} /> Executive Command Center
            </div>
          </div>

          <div className="hero-content-bottom">
            <div className="hero-quote-card" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
              <p className="hero-quote-text">
                "Centralized control over high-priority guest reservations, room security keycard overrides, and real-time financial audits."
              </p>
              <div className="hero-author">
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#0f172a',
                    border: '2px solid #d97706',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  AV
                </div>
                <div>
                  <div className="author-name">Alexander Vance, Lord Admin</div>
                  <div className="author-role">Chief Administrator & System Governance</div>
                </div>
              </div>
            </div>

            <div className="hero-stats-row">
              <div className="stat-box" style={{ borderColor: 'rgba(217, 119, 6, 0.2)' }}>
                <div className="stat-value">100%</div>
                <div className="stat-label">Audit Compliance</div>
              </div>
              <div className="stat-box" style={{ borderColor: 'rgba(217, 119, 6, 0.2)' }}>
                <div className="stat-value">0ms</div>
                <div className="stat-label">Latency Guard</div>
              </div>
              <div className="stat-box" style={{ borderColor: 'rgba(217, 119, 6, 0.2)' }}>
                <div className="stat-value">Level 5</div>
                <div className="stat-label">Clearance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
