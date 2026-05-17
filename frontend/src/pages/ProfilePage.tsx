import { useState } from 'react'
import { useAuthStore } from '../store/auth'
import { api } from '../lib/axios'
import { useTodoStats } from '../hooks/useTodos'
import { User, Mail, Calendar, CheckCircle, Clock, AlertCircle, Edit2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const { data: stats } = useTodoStats()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!name.trim() || name.length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }
    setIsLoading(true)
    try {
      const { data } = await api.patch('/auth/me', { name })
      setUser(data)
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>Profile</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Manage your account information</p>
      </div>

      {/* Avatar + Info */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ maxWidth: '220px' }}
                  autoFocus
                />
                <button onClick={handleSave} disabled={isLoading} className="btn-primary" style={{ padding: '8px 12px' }}>
                  <Check size={15} />
                </button>
                <button onClick={() => { setEditing(false); setName(user?.name || '') }} className="btn-secondary" style={{ padding: '8px 12px' }}>
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{user?.name}</h2>
                <button onClick={() => setEditing(true)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '6px', padding: '5px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={16} color="#3b82f6" />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>Email</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={16} color="#059669" />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>Member since</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color="#d97706" />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>Total Todos</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>{stats?.total || 0} tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Task Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: '#d97706', bg: '#fef3c7' },
            { label: 'In Progress', value: stats?.inProgress || 0, icon: AlertCircle, color: '#2563eb', bg: '#dbeafe' },
            { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle, color: '#059669', bg: '#d1fae5' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <Icon size={20} color={color} style={{ margin: '0 auto 6px' }} />
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>{value}</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{label}</p>
            </div>
          ))}
        </div>

        {stats && stats.total > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Completion rate</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#059669' }}>
                {Math.round((stats.completed / stats.total) * 100)}%
              </span>
            </div>
            <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${(stats.completed / stats.total) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #059669)', borderRadius: '8px', transition: 'width 0.8s ease' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
