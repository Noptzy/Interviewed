import { Activity, BarChart3, Bot, CheckCircle2, Settings, Users } from 'lucide-react'
import type { ElementType, ReactNode } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import AppShell from '@/routes/_authenticated/_components/app-shell'
import { useAdminUsers } from './_apis/use-admin-users'
import { useInterests } from './_apis/use-interests'
import { useOverview } from './_apis/use-overview'

const CHART_COLORS = {
  teal: 'var(--color-teal)',
  emerald: 'var(--color-emerald)',
  navy: 'var(--color-primary-container)',
  grid: 'var(--color-surface-container)',
}

export default function AdminDashboard() {
  const { data: users, isLoading: isUsersLoading } = useAdminUsers()
  const { data: interests, isLoading: isInterestsLoading, isError: isInterestsError } = useInterests()
  const { data: overview, isLoading: isOverviewLoading, isError: isOverviewError } = useOverview()
  const totalCandidateUsers = Math.max((overview?.totalUsers ?? users?.length ?? 0) - (overview?.totalAdmins ?? 0), 0)
  const completedSessionRate = percentage(overview?.completedSessions ?? 0, overview?.totalSessions ?? 0)
  const signupDelta = overview?.signups.slice(-7).reduce((sum, item) => sum + item.count, 0) ?? 0
  const trendData = mergeTrendData(overview?.signups ?? [], overview?.sessions ?? [])
  const roleData = [
    { name: 'Users', value: totalCandidateUsers },
    { name: 'Admins', value: overview?.totalAdmins ?? 0 },
  ]
  const funnelRows = [
    { label: 'Profile complete', value: overview?.completedProfiles ?? 0, total: overview?.totalProfiles ?? 0 },
    { label: 'Interview sessions', value: overview?.totalSessions ?? 0, total: overview?.completedProfiles ?? 0 },
    { label: 'Sessions complete', value: overview?.completedSessions ?? 0, total: overview?.totalSessions ?? 0 },
  ]

  return (
    <AppShell area="admin" size="wide">
      <div className="admin-page">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">User growth, interview flow, recommendations, and AI readiness.</p>
          </div>
          <div className="admin-actions">
            <Link className="btn-secondary" to="/admin/users"><Users size={16} /> Users</Link>
            <Link className="btn-secondary" to="/admin/settings"><Settings size={16} /> Settings</Link>
          </div>
        </div>

        <div className="admin-grid-stats">
          <StatCard icon={Users} value={overview?.totalUsers ?? users?.length ?? 0} label="Registered users" badge={`+${signupDelta} this week`} loading={isOverviewLoading || isUsersLoading} />
          <StatCard icon={Activity} value={overview?.totalSessions ?? 0} label="Interview sessions" badge="Live flow" loading={isOverviewLoading} />
          <StatCard icon={CheckCircle2} value={`${completedSessionRate}%`} label="Sessions complete" badge={`${overview?.completedSessions ?? 0} done`} loading={isOverviewLoading} />
          <StatCard icon={Bot} value={overview?.totalRecommendations ?? 0} label="Recommendations" badge="AI output" loading={isOverviewLoading} />
        </div>

        <div className="admin-grid-main">
          <section className="card">
            <CardTitle icon={Activity} title="14-Day Activity" />
            {isOverviewLoading && <div className="loading-chart">Loading trend</div>}
            {isOverviewError && <div className="error-state-chart">Could not load overview</div>}
            {!isOverviewLoading && !isOverviewError && trendData.every(item => item.signups === 0 && item.sessions === 0) && <div className="empty-data-state">No activity yet</div>}
            {!isOverviewLoading && !isOverviewError && trendData.some(item => item.signups > 0 || item.sessions > 0) && (
              <div className="chart-box">
                <ResponsiveContainer>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="signups" stroke={CHART_COLORS.teal} fill={CHART_COLORS.teal} fillOpacity={0.14} strokeWidth={2} />
                    <Area type="monotone" dataKey="sessions" stroke={CHART_COLORS.emerald} fill={CHART_COLORS.emerald} fillOpacity={0.14} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="card">
            <CardTitle icon={CheckCircle2} title="Recruitment Funnel" />
            {isOverviewLoading && <div className="loading-chart">Loading funnel</div>}
            {isOverviewError && <div className="error-state-chart">Could not load funnel</div>}
            {!isOverviewLoading && !isOverviewError && (
              <div className="funnel-list">
                {funnelRows.map(row => (
                  <div className="funnel-row" key={row.label}>
                    <div className="funnel-meta">
                      <span>{row.label}</span>
                      <span>{row.value} / {row.total}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percentage(row.value, row.total)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="admin-grid-two">
          <section className="card">
            <CardTitle icon={Users} title="Role Split" />
            {isOverviewLoading && <div className="loading-chart">Loading roles</div>}
            {isOverviewError && <div className="error-state-chart">Could not load roles</div>}
            {!isOverviewLoading && !isOverviewError && roleData.every(item => item.value === 0) && <div className="empty-data-state">No users yet</div>}
            {!isOverviewLoading && !isOverviewError && roleData.some(item => item.value > 0) && (
              <div className="chart-box-small">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={4}>
                      <Cell fill={CHART_COLORS.teal} />
                      <Cell fill={CHART_COLORS.navy} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="card">
            <CardTitle icon={BarChart3} title="Interest Distribution" />
            {isInterestsLoading && <div className="loading-chart">Loading interests</div>}
            {isInterestsError && <div className="error-state-chart">Could not load interests</div>}
            {!isInterestsLoading && !isInterestsError && (interests ?? []).length === 0 && <div className="empty-data-state">No profile skills yet</div>}
            {!isInterestsLoading && !isInterestsError && (interests ?? []).length > 0 && (
              <div className="chart-box-small">
                <ResponsiveContainer>
                  <BarChart data={interests ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill={CHART_COLORS.teal} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  )
}

function StatCard({ icon: Icon, value, label, badge, loading }: { icon: ElementType; value: ReactNode; label: string; badge: string; loading: boolean }) {
  return (
    <section className="card stat-card">
      <div className="admin-stat-top">
        <span className="admin-icon"><Icon size={18} /></span>
        <span className="badge badge-emerald">{badge}</span>
      </div>
      {loading ? <div className="stat-loading" /> : <div className="admin-stat-value">{value}</div>}
      <div className="admin-stat-label">{label}</div>
    </section>
  )
}

function CardTitle({ icon: Icon, title }: { icon: ElementType; title: string }) {
  return (
    <div className="admin-card-title">
      <span className="admin-icon"><Icon size={18} /></span>
      <h2>{title}</h2>
    </div>
  )
}

function percentage(value: number, total: number) {
  if (total <= 0) {
    return 0
  }
  return Math.round((value / total) * 100)
}

function mergeTrendData(signups: Array<{ date: string; count: number }>, sessions: Array<{ date: string; count: number }>) {
  return signups.map(signup => {
    const session = sessions.find(item => item.date === signup.date)
    return {
      date: signup.date.slice(5),
      signups: signup.count,
      sessions: session?.count ?? 0,
    }
  })
}
