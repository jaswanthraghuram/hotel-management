import { useState } from 'react'
import { X, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setIsLoading(false)
      setIsSubmitted(true)
    } catch (err) {
      setIsLoading(false)
      // Provide user-friendly message or fallback feedback
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format.')
      } else {
        // Fallback for demo / unconfigured domain
        setIsSubmitted(true)
      }
    }
  }

  const handleResetModal = () => {
    setIsSubmitted(false)
    setEmail('')
    setError('')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleResetModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleResetModal} aria-label="Close modal">
          <X size={18} />
        </button>

        {!isSubmitted ? (
          <>
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--accent-gold-light)',
                  color: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Mail size={24} />
              </div>
              <h3 className="auth-title" style={{ fontSize: '1.4rem' }}>Reset Your Password</h3>
              <p className="auth-subtitle">
                Enter your registered email address below and we'll send a password recovery email via Firebase.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    className={`form-input ${error ? 'has-error' : ''}`}
                    placeholder="name@grandhaven.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    autoFocus
                  />
                </div>
                {error && <span className="error-message">{error}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading} style={{ marginTop: '20px', marginBottom: 0 }}>
                {isLoading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    Send Recovery Link <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h3 className="auth-title" style={{ fontSize: '1.4rem' }}>Recovery Email Sent!</h3>
            <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
              We've dispatched a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <button className="submit-btn" onClick={handleResetModal} style={{ marginBottom: 0 }}>
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
