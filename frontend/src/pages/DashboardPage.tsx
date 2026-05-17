import { useAuthStore } from '../store/auth'
import { useTodoStats } from '../hooks/useTodos'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, PlayCircle, AlertCircle, Plus } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: stats, isLoading } = useTodoStats()
  const navigate = useNavigate()

  const statCards = [
    { label: 'Total Todos', value: stats?.total || 0, icon: CheckCircle, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: '#d97706', bg: '#fef3c7' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: PlayCircle, color: '#2563eb', bg: '#dbeafe' },
    { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle, color: '#059669', bg: '#d1fae5' },
    { label: 'High Priority', value: stats?.high || 0, icon: AlertCircle, color: '#dc2626', bg: '#fef2f2' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Here's an overview of your tasks
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isLoading ? <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '50%' }} /> : <Icon size={20} color={color} />}
            </div>
            <div>
              {isLoading ? (
                <>
                  <div className="skeleton" style={{ width: '40px', height: '24px', marginBottom: '4px' }} />
                  <div className="skeleton" style={{ width: '70px', height: '14px' }} />
                </>
              ) : (
                <>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{label}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/todos')} className="btn-primary">
            <Plus size={16} /> New Todo
          </button>
          <button onClick={() => navigate('/todos')} className="btn-secondary">
            <CheckCircle size={16} /> View All Todos
          </button>
        </div>
      </div>

      {/* Progress */}
      {stats && stats.total > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Overall Progress</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Completion rate</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#059669' }}>
              {Math.round((stats.completed / stats.total) * 100)}%
            </span>
          </div>
          <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${(stats.completed / stats.total) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #059669)', borderRadius: '8px', transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{stats.completed} completed</span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{stats.total} total</span>
          </div>
        </div>
      )}

      {stats?.total === 0 && !isLoading && (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No todos yet</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Create your first todo to get started</p>
          <button onClick={() => navigate('/todos')} className="btn-primary" style={{ margin: '0 auto' }}>
            <Plus size={16} /> Create First Todo
          </button>
        </div>
      )}
    </div>
  )
}
