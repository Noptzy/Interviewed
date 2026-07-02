import { LogOut, User } from 'lucide-react'
import { useCurrentUser } from '../../../hooks/use-current-user'
import { useLogout } from '../../../hooks/use-logout'

interface Props {
  collapsed: boolean
}

export default function SidebarFooter({ collapsed }: Props) {
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  return (
    <div style={{ padding: collapsed ? 12 : 20, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#0ea5a4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <User size={16} color="white" />
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'white', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.58)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
        )}
      </div>
      <button
        onClick={() => logout.mutate()}
        title={collapsed ? 'Sign out' : undefined}
        style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8, width: '100%', height: 36, border: 0, borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.72)', cursor: 'pointer', fontWeight: 600 }}
      >
        <LogOut size={15} />
        {!collapsed && <span>Sign out</span>}
      </button>
    </div>
  )
}
