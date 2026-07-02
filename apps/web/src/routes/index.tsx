import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Star, ArrowRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StatsSection from '@/routes/_public/_components/stats-section'
import HowItWorksSection from '@/routes/_public/_components/how-it-works-section'
import FeaturesSection from '@/routes/_public/_components/features-section'
import TestimonialsSection from '@/routes/_public/_components/testimonials-section'
import FaqSection from '@/routes/_public/_components/faq-section'

gsap.registerPlugin(ScrollTrigger)

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('.hero-anim'), {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
        })
      }
      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 18,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
        })
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f5fafb', fontFamily: 'Geist, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e4e9ea', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(45deg, #10b981, #0ea5a4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 20, color: '#131f3d' }}>Interviewed</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/auth/login" style={{ padding: '8px 20px', borderRadius: 10, border: '1.5px solid #0ea5a4', color: '#0ea5a4', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>Sign In</Link>
          <Link to="/auth/register" className="btn-primary" style={{ padding: '8px 20px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>Get Started</Link>
        </div>
      </nav>

      <section ref={heroRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px 60px', textAlign: 'center' }}>
        <div className="hero-anim" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '6px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          <Star size={14} /> AI-Powered Career Assistant
        </div>
        <h1 className="hero-anim" style={{ fontSize: 56, fontWeight: 700, color: '#131f3d', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 24px' }}>
          Land your dream job<br />
          <span style={{ background: 'linear-gradient(45deg, #10b981, #0ea5a4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with AI guidance</span>
        </h1>
        <p className="hero-anim" style={{ fontSize: 20, color: '#45464e', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Upload your CV, complete an interview with Interviewed AI, and get personalized job recommendations with match explanations.
        </p>
        <div className="hero-anim" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/auth/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 16, padding: '14px 32px' }}>
            Start for free <ArrowRight size={18} />
          </Link>
          <Link to="/auth/login" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 16, padding: '14px 32px' }}>
            Sign in
          </Link>
        </div>
      </section>

      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />

      <section ref={ctaRef} style={{ background: '#131f3d', padding: '60px 32px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 32, fontWeight: 700, margin: '0 0 16px' }}>Ready to get hired?</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32, fontSize: 16 }}>Join thousands of candidates who found their next role.</p>
        <Link to="/auth/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: 16, padding: '14px 40px', display: 'inline-block' }}>
          Create free account
        </Link>
      </section>

      <footer style={{ background: 'white', borderTop: '1px solid #e4e9ea', padding: '24px 32px', textAlign: 'center' }}>
        <p style={{ color: '#76777e', fontSize: 13, margin: 0 }}>© 2025 Interviewed. Built for Java Lanjut UAS.</p>
      </footer>
    </div>
  )
}
