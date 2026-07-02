import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useSidebar } from '../../../hooks/use-sidebar'
import AdminSidebar from '../admin/_components/admin-sidebar'
import UserSidebar from '../users/_components/user-sidebar'
import PageContainer from './page-container'

interface Props {
  area: 'admin' | 'user'
  children: React.ReactNode
  size?: 'default' | 'wide' | 'narrow'
}

export default function AppShell({ area, children, size = 'default' }: Props) {
  const { collapsed, toggle } = useSidebar()
  const sidebarWidth = collapsed ? 88 : 280

  return (
    <div className="app-shell">
      <div style={{ display: 'grid', minHeight: '100vh', gridTemplateColumns: `${sidebarWidth}px minmax(0, 1fr)`, transition: 'grid-template-columns 220ms ease' }}>
        <aside className={area === 'admin' ? 'app-sidebar app-sidebar-admin' : 'app-sidebar app-sidebar-user'}>
          <div className={collapsed ? 'app-sidebar-head app-sidebar-head-collapsed' : 'app-sidebar-head'}>
            {!collapsed && (
              <div>
                <div className="app-brand">Interviewed</div>
                <div className="app-brand-subtitle">{area === 'admin' ? 'Admin Area' : 'Candidate Workspace'}</div>
              </div>
            )}
            <button onClick={toggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="app-sidebar-toggle">
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>
          {area === 'admin' ? <AdminSidebar collapsed={collapsed} /> : <UserSidebar collapsed={collapsed} />}
        </aside>
        <main style={{ minWidth: 0, width: '100%' }}>
          <PageContainer size={size}>{children}</PageContainer>
        </main>
      </div>
    </div>
  )
}
