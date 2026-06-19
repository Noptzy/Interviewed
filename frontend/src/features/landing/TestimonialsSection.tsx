import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Quote, Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  name: string
  role: string
  quote: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Aditya Pratama',
    role: 'Backend Engineer',
    quote:
      'The AI interview actually felt like talking to a recruiter who read my CV. The recommendations explained exactly why I matched.',
  },
  {
    name: 'Maya Ramadhani',
    role: 'Product Designer',
    quote: 'I uploaded my CV on a Sunday night and had three solid job matches with clear explanations by Monday morning.',
  },
  {
    name: 'Farhan Saputra',
    role: 'Data Analyst',
    quote:
      'Instead of guessing what recruiters wanted, Interviewed AI told me exactly which skills I was missing for the roles I wanted.',
  },
]

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll('.testimonial-card'), {
        y: 30,
        opacity: 0,
        scale: 0.97,
        duration: 0.55,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 90px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span className="badge badge-navy">Candidate stories</span>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#131f3d', margin: '16px 0 12px' }}>
          Trusted by job seekers like you
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="card testimonial-card" style={{ textAlign: 'left' }}>
            <Quote size={24} color="#0ea5a4" style={{ marginBottom: 12 }} />
            <p style={{ color: '#171c1e', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px' }}>&ldquo;{t.quote}&rdquo;</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #10b981, #0ea5a4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {t.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#131f3d' }}>{t.name}</div>
                <div style={{ fontSize: 12.5, color: '#76777e' }}>{t.role}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={13} color="#f59e0b" fill="#f59e0b" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
