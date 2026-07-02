import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, MessageSquare, Briefcase, CheckCircle, ArrowRight, Sparkles, FileSearch, TrendingUp, Zap, Brain, Target, Rocket, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import { gsap } from 'gsap'
import AppShell from '@/routes/_authenticated/_components/app-shell'
import RecommendedActions from './_components/recommended-actions'
import TopJobPreview from './_components/top-job-preview'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useStartInterview } from './_hooks/use-start-interview'
import { useQuery } from '@tanstack/react-query'
import api from '@/libs/api/client'
import type { ApiResponse, RecommendationResponse, ProfileResponse } from '@/types/api'

type Step = { key: string; label: string; desc: string; done: boolean; action: () => void; icon: React.ComponentType<{ size?: number; color?: string }> }

const GAP_SKILLS = ['docker', 'kubernetes', 'system design', 'aws', 'graphql', 'testing', 'ci/cd']

function safeJsonArray(s: string | null | undefined): string[] {
  if (!s) return []
  try { const v = JSON.parse(s); return Array.isArray(v) ? v.map(String) : [] } catch { return [] }
}

function StatCard({ icon: Icon, label, value, hint, tone, progress }: {
  icon: React.ComponentType<{ size?: number; color?: string }>
  label: string; value: string | number; hint?: string
  tone: 'emerald' | 'teal' | 'navy' | 'amber' | 'purple'
  progress?: number
}) {
  const color = { emerald: '#10b981', teal: '#0ea5a4', navy: '#131f3d', amber: '#f59e0b', purple: '#8b5cf6' }[tone]
  return (
    <div className="card stat-card card-hover">
      <div style={{ position: 'absolute', top: 14, right: 14, opacity: 0.12 }}>
        <Icon size={40} color={color} />
      </div>
      <div style={{ fontSize: 11, color: '#76777e', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#131f3d', marginTop: 8, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: '#45464e', marginTop: 8, fontWeight: 500 }}>{hint}</div>}
      {progress != null && (
        <div className="progress-bar" style={{ marginTop: 12 }}>
          <div className="progress-fill" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { data: user } = useCurrentUser()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<RecommendationResponse[]>>('/api/recommendations')
      return res.data.data
    },
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<ProfileResponse>>('/api/profile')
        return res.data.data
      } catch { return null }
    },
  })

  const startInterview = useStartInterview()

  const skills = safeJsonArray(profile?.skillsJson)
  const experiences = safeJsonArray(profile?.experiencesJson)
  const topJobs = (recommendations ?? []).slice(0, 3)

  const aiOnline = !!user?.isProfileCompleted
  const profilePct = user?.isProfileCompleted ? 100 : Math.min(85, skills.length * 5 + experiences.length * 10)
  const matchPct = recommendations?.length ? Math.min(96, 60 + recommendations.length * 4) : 0
  const interviewReady = experiences.length > 0

  const steps: Step[] = [
    { key: 'upload', label: 'Upload CV', desc: 'Import your resume', done: !!user?.isProfileCompleted, action: () => navigate('/users/upload-cv'), icon: Upload },
    { key: 'parse', label: 'AI Profile Analysis', desc: 'AI reads your background', done: skills.length > 0 || !!profile?.summary, action: () => navigate('/users/upload-cv'), icon: Brain },
    { key: 'interview', label: 'AI Interview', desc: 'Tell your story in 5 questions', done: experiences.length > 0, action: () => startInterview.mutate(), icon: MessageSquare },
    { key: 'skills', label: 'Skills Extraction', desc: 'AI maps your strengths', done: skills.length >= 5, action: () => navigate('/users/upload-cv'), icon: Target },
    { key: 'match', label: 'Job Matching', desc: 'Find roles that fit', done: (recommendations?.length ?? 0) > 0, action: () => navigate('/users/jobs'), icon: Briefcase },
    { key: 'apply', label: 'Apply to Jobs', desc: 'Submit your first application', done: false, action: () => navigate('/users/jobs'), icon: Rocket },
  ]

  const completedSteps = steps.filter(s => s.done).length
  const journeyPct = Math.round((completedSteps / steps.length) * 100)

  const strengths = skills.slice(0, 4)
  const haveSet = new Set(skills.map(s => s.toLowerCase()))
  const gaps = GAP_SKILLS.filter(w => !haveSet.has(w)).slice(0, 4)

  const summary = recommendations && recommendations.length > 0
    ? `${recommendations.length} curated role${recommendations.length === 1 ? '' : 's'} waiting — strongest match scores ${matchPct}%.`
    : skills.length > 0
      ? `${skills.length} skills mapped. Run the AI interview to unlock tailored job matches.`
      : 'Upload your CV to let the AI build your profile and start matching you to roles.'

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.fade-in-up', { y: 20, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' })
      gsap.from('.stat-card', { scale: 0.94, opacity: 0, duration: 0.45, stagger: 0.08, ease: 'back.out(1.3)' })
      gsap.from('.stepper-row', { x: -14, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.25 })
    }, containerRef)
    return () => ctx.revert()
  }, [recommendations, profile])

  return (
    <AppShell area="user">
      <div ref={containerRef} style={{ width: '100%' }}>

        <div className="fade-in-up" style={{
          marginBottom: 32, padding: '28px 32px',
          background: 'linear-gradient(135deg, #131f3d 0%, #1e3a5f 100%)',
          borderRadius: 'var(--radius-card)', color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div className={aiOnline ? 'ai-chip ai-chip-online' : 'ai-chip ai-chip-idle'} style={{ background: aiOnline ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.12)', color: aiOnline ? '#a7f3d0' : 'rgba(255,255,255,0.7)', borderColor: aiOnline ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.2)' }}>
                <span className="ai-pulse" style={{ background: aiOnline ? '#10b981' : '#94a3b8', boxShadow: aiOnline ? undefined : 'none', animation: aiOnline ? undefined : 'none' }} />
                {aiOnline ? 'AI Recruiter Active' : 'AI Idle'}
              </div>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', margin: 0, fontSize: 15, lineHeight: 1.5, maxWidth: 540 }}>{summary}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/users/upload-cv')} className="btn-primary" style={{ background: '#10b981' }}>
              <Upload size={16} style={{ marginRight: 6 }} /> Upload CV
            </button>
            <button onClick={() => startInterview.mutate()} className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.25)' }} disabled={startInterview.isPending}>
              <MessageSquare size={16} style={{ marginRight: 6 }} /> {startInterview.isPending ? 'Starting…' : 'Start AI Interview'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
          <StatCard icon={FileSearch} label="Profile" value={`${profilePct}%`} hint={profilePct === 100 ? 'Completed' : 'Keep going'} tone="emerald" progress={profilePct} />
          <StatCard icon={Brain} label="Skills detected" value={skills.length} hint="From CV & interview" tone="teal" />
          <StatCard icon={Briefcase} label="Job matches" value={recommendations?.length ?? 0} hint="Curated for you" tone="navy" />
          <StatCard icon={Target} label="AI confidence" value={`${matchPct}%`} hint="Match quality" tone="purple" progress={matchPct} />
          <StatCard icon={TrendingUp} label="Interview readiness" value={interviewReady ? 'Ready' : 'Pending'} hint={interviewReady ? 'Completed' : 'Start interview'} tone="amber" progress={interviewReady ? 100 : 30} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginBottom: 24 }}>

          <div className="card fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #131f3d, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} color="#10b981" />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#131f3d', margin: 0 }}>Your Journey</h2>
                  <p style={{ fontSize: 12, color: '#76777e', margin: 0 }}>{completedSteps} of {steps.length} complete</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#131f3d', letterSpacing: '-0.02em' }}>{journeyPct}%</div>
                <div style={{ width: 80, marginTop: 4 }}><div className="progress-bar"><div className="progress-fill" style={{ width: `${journeyPct}%` }} /></div></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {steps.map((step, idx) => (
                <div key={step.key} className={`stepper-row ${step.done ? 'stepper-done' : 'stepper-pending'}`} onClick={() => !step.done && step.action()}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: step.done ? 'rgba(16,185,129,0.18)' : '#eaeff0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    color: step.done ? '#10b981' : '#45464e', fontWeight: 700, fontSize: 13,
                  }}>
                    {step.done ? <CheckCircle size={20} /> : idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: step.done ? '#131f3d' : '#171c1e', fontSize: 14 }}>{step.label}</div>
                    <div style={{ fontSize: 12, color: '#76777e', marginTop: 2 }}>{step.desc}</div>
                  </div>
                  <div style={{ fontSize: 11, color: step.done ? '#10b981' : '#76777e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {step.done ? 'Done' : 'Pending'}
                  </div>
                  {!step.done && <ArrowRight size={14} color="#0ea5a4" />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card fade-in-up" style={{ background: 'linear-gradient(135deg, #131f3d, #1e3a5f)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Zap size={20} color="#10b981" />
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'white', margin: 0 }}>AI Insights</h2>
              </div>
              <p style={{ color: profile?.summary ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {profile?.summary ?? 'Upload your CV and complete the AI recruiter interview to unlock a personalized summary of your strengths.'}
              </p>
            </div>

            <div className="card fade-in-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Lightbulb size={18} color="#0ea5a4" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#131f3d', margin: 0 }}>Strengths</h3>
              </div>
              {strengths.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {strengths.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#171c1e' }}>
                      <CheckCircle2 size={15} color="#10b981" />{s}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: '#76777e', margin: 0 }}>Complete your profile to surface strengths.</p>
              )}
            </div>

            <div className="card fade-in-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Target size={18} color="#f59e0b" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#131f3d', margin: 0 }}>Missing skills</h3>
              </div>
              {gaps.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {gaps.map((g, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#45464e' }}>
                      <XCircle size={15} color="#f59e0b" />{g}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: '#10b981', margin: 0, fontWeight: 600 }}>All key skills covered.</p>
              )}
            </div>
          </div>
        </div>

        <RecommendedActions
          user={user}
          experiences={experiences}
          skills={skills}
          recommendations={recommendations}
          isInterviewPending={startInterview.isPending}
          onStartInterview={() => startInterview.mutate()}
        />

        <TopJobPreview jobs={topJobs} onSeeAll={() => navigate('/users/jobs')} />

        {topJobs.length === 0 && skills.length === 0 && (
          <div className="card fade-in-up" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #0ea5a4, #10b981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Sparkles size={28} color="white" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#131f3d', margin: '0 0 8px' }}>Let's build your AI profile</h2>
            <p style={{ color: '#45464e', margin: '0 0 24px', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', fontSize: 14 }}>
              Upload your CV and the AI recruiter will extract your skills, score your experience, and match you with roles.
            </p>
            <button onClick={() => navigate('/users/upload-cv')} className="btn-primary">
              <Upload size={16} style={{ marginRight: 6 }} /> Upload CV to get started
            </button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
