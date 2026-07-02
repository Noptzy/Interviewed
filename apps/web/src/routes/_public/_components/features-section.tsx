import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FileText, MessageSquare, Target, Briefcase, ShieldCheck, Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Feature {
  icon: React.ComponentType<{ size?: number; color?: string }>
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: 'Smart CV Parsing',
    desc: 'PDF, DOCX, or LinkedIn URL — your skills, experience, and projects are extracted automatically, no manual form-filling.',
  },
  {
    icon: MessageSquare,
    title: 'Adaptive AI Interview',
    desc: 'Interviewed AI asks follow-up questions based on your actual answers, just like a real recruiter would.',
  },
  {
    icon: Target,
    title: 'Explainable Matches',
    desc: 'Every recommendation comes with the why: your strengths, the gaps, and how closely you fit the role.',
  },
  {
    icon: Briefcase,
    title: 'Real Job Listings',
    desc: 'Opportunities are pulled from live job sources, not a stale internal database.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'Your CV content and interview answers are never logged or shared. You stay in control of your data.',
  },
  {
    icon: Clock,
    title: 'Minutes, Not Weeks',
    desc: 'From upload to recommendation in one sitting — no recruiter back-and-forth, no waiting.',
  },
]

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll('.feature-card'), {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 90px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span className="badge badge-emerald">Why Interviewed</span>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#131f3d', margin: '16px 0 12px' }}>
          Everything a job search needs, nothing it doesn't
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {FEATURES.map((f) => (
          <div key={f.title} className="card feature-card" style={{ textAlign: 'left' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(16,185,129,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <f.icon size={22} color="#10b981" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#131f3d', margin: '0 0 8px' }}>{f.title}</h3>
            <p style={{ color: '#45464e', fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
