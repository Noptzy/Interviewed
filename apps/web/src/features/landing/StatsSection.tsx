import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FileText, MessageSquare, Briefcase, Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Stat {
  icon: React.ComponentType<{ size?: number; color?: string }>
  end: number
  suffix: string
  label: string
}

const STATS: Stat[] = [
  { icon: FileText, end: 12400, suffix: '+', label: 'CVs Analyzed' },
  { icon: MessageSquare, end: 8200, suffix: '+', label: 'AI Interviews Completed' },
  { icon: Briefcase, end: 3150, suffix: '+', label: 'Job Matches Delivered' },
  { icon: Star, end: 4.8, suffix: '/5', label: 'Average Candidate Rating' },
]

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      const cards = sectionRef.current.querySelectorAll('.stat-anim')

      gsap.from(cards, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })

      cards.forEach((card) => {
        const valueEl = card.querySelector('.stat-value')
        const end = Number(card.getAttribute('data-end'))
        const decimals = end % 1 !== 0 ? 1 : 0
        if (!valueEl) return
        const counter = { val: 0 }
        gsap.to(counter, {
          val: end,
          duration: 1.4,
          ease: 'power1.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          onUpdate: () => {
            valueEl.textContent = counter.val.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {STATS.map((s) => (
          <div key={s.label} className="card stat-anim" data-end={s.end} style={{ textAlign: 'center' }}>
            <s.icon size={26} color="#0ea5a4" />
            <div style={{ fontSize: 30, fontWeight: 700, color: '#131f3d', marginTop: 10 }}>
              <span className="stat-value">0</span>
              {s.suffix}
            </div>
            <div style={{ fontSize: 13, color: '#45464e', marginTop: 6, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
