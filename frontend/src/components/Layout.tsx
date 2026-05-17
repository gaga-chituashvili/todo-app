import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import toast from 'react-hot-toast'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', padding: '20px 12px', position: 'fixed', top: 0, left: 0, bottom: 0 }}>
        <div style={{ marginBottom: '28px', padding: '0 8px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6' }}>✅ TodoApp</h1>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{user?.name}</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {[
            { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
            { to: '/todos', icon: CheckSquare, label: 'My Todos' },
            { to: '/profile', icon: User, label: 'Profile' },
          ].map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', fontSize: '14px',
                fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s',
                background: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#3b82f6' : '#4b5563',
              })}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', width: '100%' }}
        >
          <LogOut size={17} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '220px', flex: 1, padding: '28px', maxWidth: 'calc(100vw - 220px)' }}>
        <Outlet />
      </main>
    </div>
  )
}
