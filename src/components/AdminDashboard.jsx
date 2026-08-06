import { useState } from 'react'
import {
  ShieldCheck,
  LogOut,
  Sliders,
  Key,
  Activity,
  UserCheck,
  Lock,
  Unlock,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react'

export default function AdminDashboard({ adminUser, onLogout }) {
  const [lockdownMode, setLockdownMode] = useState(false)
  const [overrideSuccess, setOverrideSuccess] = useState('')

  const handleTriggerOverride = (actionName) => {
    setOverrideSuccess(`${actionName} executed successfully. Event logged to Security Vault.`)
    setTimeout(() => setOverrideSuccess(''), 4000)
  }

  return (
    <div className="dashboard-screen" style={{ borderColor: 'var(--accent-gold)' }}>
      {/* Header */}
      <div className="dash-header">
        <div className="dash-user-info">
          <div className="user-avatar-large" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '2px solid #d97706', color: '#f59e0b' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
                {adminUser?.name || 'Lord Alexander Vance'}
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: 'rgba(217, 119, 6, 0.2)',
                  color: 'var(--accent-gold)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  border: '1px solid var(--accent-gold)',
                }}
              >
                {adminUser?.securityClearance || 'Level 5 Master Admin'}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Admin Security ID: <strong>{adminUser?.adminId || 'ADM-99401-EXEC'}</strong> | {adminUser?.email || 'admin.vance@grandhaven.com'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            onClick={() => setLockdownMode(!lockdownMode)}
            style={{
              borderColor: lockdownMode ? '#ef4444' : 'var(--accent-gold)',
              background: lockdownMode ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              color: lockdownMode ? '#ef4444' : 'var(--accent-gold)'
            }}
          >
            {lockdownMode ? <Lock size={16} /> : <Unlock size={16} />}
            {lockdownMode ? 'Lobby Security: LOCKED' : 'Emergency Lockdown'}
          </button>

          <button className="btn-secondary" onClick={onLogout} style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}>
            <LogOut size={16} /> Exit Admin Portal
          </button>
        </div>
      </div>

      {/* System Override Feedback Alert */}
      {overrideSuccess && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            color: '#10b981',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            marginBottom: '24px',
            fontWeight: 600
          }}
        >
          ✓ {overrideSuccess}
        </div>
      )}

      {/* Executive Quick Stats */}
      <div className="dash-grid">
        <div className="dash-card" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
          <div className="dash-card-header">
            <span>Active Keycards Issued</span>
            <Key size={20} color="var(--accent-gold)" />
          </div>
          <div className="dash-card-value">1,248 Keys</div>
          <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
            All RFID Smart Locks Synced
          </p>
        </div>

        <div className="dash-card" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
          <div className="dash-card-header">
            <span>Staff Shift Audit</span>
            <UserCheck size={20} color="var(--accent-primary)" />
          </div>
          <div className="dash-card-value">142 Active Staff</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            8 Managers, 134 Operators
          </p>
        </div>

        <div className="dash-card" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
          <div className="dash-card-header">
            <span>System Health Score</span>
            <Activity size={20} color="#10b981" />
          </div>
          <div className="dash-card-value">99.98%</div>
          <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
            Zero Vulnerabilities Detected
          </p>
        </div>
      </div>

      {/* Executive Controls Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="dash-card">
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-gold)" /> Quick Master Overrides
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Perform instant system-wide overrides with high-level administrator permissions.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn-secondary" onClick={() => handleTriggerOverride('Master Keycard Re-Sync')}>
              <Key size={16} /> Force Re-Sync Keycard Relays
            </button>
            <button className="btn-secondary" onClick={() => handleTriggerOverride('Financial Audit Export')}>
              <FileSpreadsheet size={16} /> Generate Master Financial Audit
            </button>
            <button className="btn-secondary" onClick={() => handleTriggerOverride('POS Terminals Reset')}>
              <AlertTriangle size={16} /> Reset Room POS Terminals
            </button>
          </div>
        </div>

        {/* Security Audit Stream */}
        <div className="dash-card">
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>
            Real-time Security Audit Stream
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem' }}>
            <div style={{ padding: '8px 12px', background: 'var(--panel-bg)', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
              <strong>11:30 AM</strong> - Admin <code>ADM-99401</code> authenticated via 2FA Token.
            </div>
            <div style={{ padding: '8px 12px', background: 'var(--panel-bg)', borderRadius: '8px', borderLeft: '3px solid var(--accent-gold)' }}>
              <strong>11:28 AM</strong> - Master Penthouse Suite 801 Smart Door unlocked via Master Key.
            </div>
            <div style={{ padding: '8px 12px', background: 'var(--panel-bg)', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)' }}>
              <strong>11:15 AM</strong> - Night Shift Manager closed daily register report ($84,250).
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
