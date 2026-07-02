import { Briefcase, LayoutDashboard, MessageSquare, Upload } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import SidebarFooter from '../../_components/sidebar-footer'

interface Props {
  collapsed: boolean
}

const items = [
  { to: '/users/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users/upload-cv', icon: Upload, label: 'Upload CV' },
  { to: '/users/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/users/interview', icon: MessageSquare, label: 'Interview' },
]

export default function UserSidebar({ collapsed }: Props) {
  return (
    <>
      <nav style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} title={collapsed ? label : undefined} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 12, minHeight: 42, padding: collapsed ? 0 : '0 12px', borderRadius: 10, color: isActive ? '#10b981' : 'rgba(255,255,255,0.72)', background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent', textDecoration: 'none', fontWeight: isActive ? 800 : 600 })}>
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <SidebarFooter collapsed={collapsed} />
    </>
  )
}
