import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import LoginPage from './components/LoginPage'
import AdminLoginPage from './components/AdminLoginPage'
import DashboardPreview from './components/DashboardPreview'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

function App() {
  const [portalView, setPortalView] = useState('guest-login') // 'guest-login' | 'admin-login' | 'guest-dashboard' | 'admin-dashboard'
  const [user, setUser] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  // Listen to Firebase Auth state safely
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isExecutive = firebaseUser.email?.includes('admin')
        const formattedUser = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Resort Guest',
          email: firebaseUser.email || 'guest@grandhaven.com',
          role: isExecutive ? 'General Manager' : 'Verified Member',
          uid: firebaseUser.uid
        }

        if (isExecutive) {
          setAdminUser({
            ...formattedUser,
            adminId: 'ADM-99401-EXEC',
            securityClearance: 'Level 5 (Master Access)'
          })
          setPortalView('admin-dashboard')
        } else {
          setUser(formattedUser)
          setPortalView('guest-dashboard')
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  // Handlers for Guest Login
  const handleGuestLoginSuccess = (userData) => {
    setUser(userData)
    setPortalView('guest-dashboard')
  }

  const handleGuestLogout = async () => {
    try {
      await signOut(auth)
    } catch {
      // ignore
    }
    setUser(null)
    setPortalView('guest-login')
  }

  // Handlers for Admin Login
  const handleAdminLoginSuccess = (adminData) => {
    setAdminUser(adminData)
    setPortalView('admin-dashboard')
  }

  const handleAdminLogout = async () => {
    try {
      await signOut(auth)
    } catch {
      // ignore
    }
    setAdminUser(null)
    setPortalView('admin-login')
  }

  return (
    <div className="app-root-container" data-theme={theme} style={{ width: '100%', minHeight: '100vh' }}>
      {portalView === 'guest-login' && (
        <LoginPage
          onLoginSuccess={handleGuestLoginSuccess}
          onSwitchToAdmin={() => setPortalView('admin-login')}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {portalView === 'admin-login' && (
        <AdminLoginPage
          onAdminLoginSuccess={handleAdminLoginSuccess}
          onSwitchToGuest={() => setPortalView('guest-login')}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {portalView === 'guest-dashboard' && (
        user ? (
          <DashboardPreview user={user} onLogout={handleGuestLogout} />
        ) : (
          <LoginPage
            onLoginSuccess={handleGuestLoginSuccess}
            onSwitchToAdmin={() => setPortalView('admin-login')}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )
      )}

      {portalView === 'admin-dashboard' && (
        adminUser ? (
          <AdminDashboard adminUser={adminUser} onLogout={handleAdminLogout} />
        ) : (
          <AdminLoginPage
            onAdminLoginSuccess={handleAdminLoginSuccess}
            onSwitchToGuest={() => setPortalView('guest-login')}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )
      )}
    </div>
  )
}

export default App
