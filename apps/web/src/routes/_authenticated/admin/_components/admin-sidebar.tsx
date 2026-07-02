import { BarChart3, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import SidebarFooter from '../../_components/sidebar-footer'

interface Props {
  collapsed: boolean
}

const items = [
  { to: '/admin/dashboard', icon: BarChart3, label: 'Admin Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminSidebar({ collapsed }: Props) {
  return (
    <>
      {!collapsed && <div className="admin-sidebar-kicker">Admin Area</div>}
      <nav className="admin-sidebar-nav">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} title={collapsed ? label : undefined} className={({ isActive }) => `admin-sidebar-link ${collapsed ? 'admin-sidebar-link-collapsed' : ''} ${isActive ? 'admin-sidebar-link-active' : ''}`}>
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <SidebarFooter collapsed={collapsed} />
    </>
  )
}
