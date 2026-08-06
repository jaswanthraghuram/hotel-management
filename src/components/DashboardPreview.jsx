import { ShieldCheck, LogOut, BedDouble, Users, DollarSign, Sparkles, Bell, Calendar } from 'lucide-react'

export default function DashboardPreview({ user, onLogout }) {
  return (
    <div className="dashboard-screen">
      <div className="dash-header">
        <div className="dash-user-info">
          <div className="user-avatar-large">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
                Welcome back, {user?.name || 'Manager'}
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: 'var(--accent-gold-light)',
                  color: 'var(--accent-gold)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  border: '1px solid var(--accent-gold)',
                }}
              >
                {user?.role || 'Administrator'}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Grand Haven Resort & Spa Portal — {user?.email || 'admin@grandhaven.com'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-secondary">
            <Bell size={16} /> Notifications
          </button>
          <button className="btn-secondary" onClick={onLogout} style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <span>Occupancy Rate</span>
            <BedDouble size={20} color="var(--accent-gold)" />
          </div>
          <div className="dash-card-value">94.8%</div>
          <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
            +6.2% vs last weekend
          </p>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <span>VIP Guests In-House</span>
            <Users size={20} color="var(--accent-primary)" />
          </div>
          <div className="dash-card-value">38 Suites</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            14 Presidential, 24 Royal Villas
          </p>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <span>Daily Revenue</span>
            <DollarSign size={20} color="#10b981" />
          </div>
          <div className="dash-card-value">$84,250</div>
          <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
            Target Achieved (112%)
          </p>
        </div>
      </div>

      <div
        style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              Two-Factor Authentication Active
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Your account is protected with enterprise security & encrypted sessions.
            </div>
          </div>
        </div>

        <button className="btn-secondary" style={{ background: 'var(--panel-bg)' }}>
          <Sparkles size={16} color="var(--accent-gold)" /> Manage Access
        </button>
      </div>
    </div>
  )
}
