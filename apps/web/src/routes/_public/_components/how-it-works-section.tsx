import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Upload, Sparkles, MessageSquare, Target } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Step {
  icon: React.ComponentType<{ size?: number; color?: string }>
  title: string
  desc: string
}

const STEPS: Step[] = [
  {
    icon: Upload,
    title: 'Upload Your CV or LinkedIn',
    desc: 'Upload a PDF or DOCX resume, or paste your LinkedIn URL. Interviewed AI extracts your skills, experience, education, and projects in seconds.',
  },
  {
    icon: Sparkles,
    title: 'AI Profile Analysis',
    desc: 'Your background is structured into a candidate profile — seniority, domain strengths, and key skills — ready for a real conversation.',
  },
  {
    icon: MessageSquare,
    title: 'AI Recruiter Interview',
    desc: 'Chat with Interviewed AI through 3–8 adaptive questions that probe your experience the way a real recruiter would.',
  },
  {
    icon: Target,
    title: 'Curated Job Recommendations',
    desc: 'Receive ranked job matches with clear explanations of why each role fits, your strengths, and the gaps to watch.',
  },
]

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      gsap.from(sectionRef.current.querySelectorAll('.step-anim'), {
        x: -24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'bottom 60%', scrub: true },
          },
        )
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ maxWidth: 880, margin: '0 auto', padding: '0 32px 90px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <span className="badge badge-teal">How it works</span>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#131f3d', margin: '16px 0 12px' }}>
          From CV to job offer, guided by AI
        </h2>
        <p style={{ color: '#45464e', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
          Four steps stand between your resume and your next role.
        </p>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 27, top: 8, bottom: 8, width: 2, background: '#e4e9ea' }} />
        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            left: 27,
            top: 8,
            bottom: 8,
            width: 2,
            background: 'linear-gradient(180deg, #10b981, #0ea5a4)',
            transformOrigin: 'top',
          }}
        />
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="step-anim"
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '56px 1fr',
              gap: 24,
              marginBottom: i === STEPS.length - 1 ? 0 : 44,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'white',
                border: '2px solid #0ea5a4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <step.icon size={22} color="#0ea5a4" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0ea5a4', marginBottom: 4, letterSpacing: '0.06em' }}>
                STEP {i + 1}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: '#131f3d', margin: '0 0 8px' }}>{step.title}</h3>
              <p style={{ color: '#45464e', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
