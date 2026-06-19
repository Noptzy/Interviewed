import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Upload, MessageSquare, Briefcase, Settings, LogOut, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { gsap } from 'gsap'
import { useCurrentUser } from '../features/auth/useCurrentUser'
import { useLogout } from '../features/auth/useLogout'
import { useSidebar } from '../contexts/SidebarContext'

interface Props { children: React.ReactNode }

const SIDEBAR_EXPANDED = 240
const SIDEBAR_COLLAPSED = 72

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/onboarding/upload', icon: Upload, label: 'Upload CV' },
  { to: '/recommendations', icon: Briefcase, label: 'Jobs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function AppShell({ children }: Props) {
  const { data: user } = useCurrentUser()
  const logout = useLogout()
  const { collapsed, toggle } = useSidebar()
  const asideRef = useRef<HTMLElement>(null)
  const mainRef = useRef<HTMLElement>(null)
  const labelsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    if (!asideRef.current || !mainRef.current) return
    const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED
    const margin = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

    gsap.to(asideRef.current, {
      width,
      duration: 0.35,
      ease: 'power3.out',
    })
    gsap.to(mainRef.current, {
      marginLeft: margin,
      duration: 0.35,
      ease: 'power3.out',
    })

    if (labelsRef.current.length) {
      gsap.to(labelsRef.current, {
        opacity: collapsed ? 0 : 1,
        x: collapsed ? -8 : 0,
        duration: 0.2,
        stagger: 0.02,
        ease: 'power2.out',
        onComplete: () => {
          labelsRef.current.forEach(el => {
            el.style.display = collapsed ? 'none' : ''
          })
        },
      })
      labelsRef.current.forEach(el => {
        el.style.display = ''
      })
    }
  }, [collapsed])

  const setLabelRef = (idx: number) => (el: HTMLSpanElement | null) => {
    if (el) labelsRef.current[idx] = el
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5fafb' }}>
      <aside
        ref={asideRef}
        style={{
          width: SIDEBAR_EXPANDED,
          background: '#131f3d',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 0',
          position: 'fixed',
          height: '100vh',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        <div style={{
          padding: collapsed ? '0 16px 20px' : '0 24px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 8,
          minHeight: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(45deg, #10b981, #0ea5a4)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <MessageSquare size={16} color="white" />
            </div>
            <span
              ref={setLabelRef(0)}
              style={{ color: 'white', fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap' }}
            >
              Interviewed
            </span>
          </div>
        </div>

        <button
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            position: 'absolute',
            top: 18,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.85)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(16,185,129,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ to, icon: Icon, label }, idx) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '10px' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 8,
                textDecoration: 'none',
                color: isActive ? '#10b981' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                borderLeft: isActive && !collapsed ? '3px solid #10b981' : '3px solid transparent',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              })}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span ref={setLabelRef(idx + 1)} style={{ overflow: 'hidden' }}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: collapsed ? '16px 12px' : '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 10,
            marginBottom: 12,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(45deg, #10b981, #0ea5a4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <User size={16} color="white" />
            </div>
            <div ref={setLabelRef(navItems.length + 1)} style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={() => logout.mutate()}
            title={collapsed ? 'Sign out' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'rgba(255,255,255,0.6)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              padding: '6px 0',
              width: '100%',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
          >
            <LogOut size={15} />
            <span ref={setLabelRef(navItems.length + 2)}>Sign out</span>
          </button>
        </div>
      </aside>

      <main ref={mainRef} style={{ marginLeft: SIDEBAR_EXPANDED, flex: 1, padding: 32 }}>
        {children}
      </main>
    </div>
  )
}