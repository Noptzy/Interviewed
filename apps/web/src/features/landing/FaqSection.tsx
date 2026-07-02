import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Faq {
  q: string
  a: string
}

const FAQS: Faq[] = [
  {
    q: 'Is my CV data safe?',
    a: 'Yes. Your CV content and interview answers are processed for analysis only and are never logged, sold, or shared with third parties.',
  },
  {
    q: 'How long does the AI interview take?',
    a: 'Most candidates finish in 5–10 minutes. Interviewed AI asks between 3 and 8 adaptive questions based on your profile.',
  },
  {
    q: 'Where do the job listings come from?',
    a: 'Listings are sourced live from real job boards, not a static internal database, so recommendations stay current.',
  },
  {
    q: 'Is Interviewed free to use?',
    a: 'Yes, uploading your CV, completing the AI interview, and receiving job recommendations is completely free.',
  },
  {
    q: 'Can I redo the interview if my answers change?',
    a: 'Yes. You can start a new interview session anytime to refresh your candidate profile and recommendations.',
  },
]

export default function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll('.faq-item'), {
        y: 18,
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
    <section ref={sectionRef} style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px 96px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span className="badge badge-teal">FAQ</span>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#131f3d', margin: '16px 0 0' }}>Frequently asked questions</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FAQS.map((f) => (
          <div key={f.q} className="card faq-item" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#131f3d', margin: '0 0 8px' }}>{f.q}</h3>
            <p style={{ color: '#45464e', fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
