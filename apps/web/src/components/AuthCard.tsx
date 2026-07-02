import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { MessageSquare } from 'lucide-react'
import { gsap } from 'gsap'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 18,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
        })
      }
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.55,
          ease: 'power3.out',
          delay: 0.18,
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f5fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(45deg, #10b981, #0ea5a4)', borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <MessageSquare size={24} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#131f3d', margin: '0 0 8px' }}>{title}</h1>
          <p style={{ color: '#45464e', margin: 0 }}>{subtitle}</p>
        </div>

        <div ref={cardRef} className="auth-card">
          {children}
        </div>

        {footer && <p className="auth-card-footer">{footer}</p>}
      </div>
    </div>
  )
}