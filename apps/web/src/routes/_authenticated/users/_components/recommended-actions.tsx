import { useNavigate } from 'react-router-dom'
import { Upload, MessageSquare, Briefcase, Search, Rocket } from 'lucide-react'
import type { CurrentUser, RecommendationResponse } from '@/types/api'

type Props = {
  user: CurrentUser | null | undefined
  experiences: string[]
  skills: string[]
  recommendations: RecommendationResponse[] | undefined
  isInterviewPending: boolean
  onStartInterview: () => void
}

export default function RecommendedActions({ user, experiences, skills, recommendations, isInterviewPending, onStartInterview }: Props) {
  const navigate = useNavigate()
  const hasProfile = !!user?.isProfileCompleted
  const hasExp = experiences.length > 0
  const hasSkills = skills.length > 0
  const recCount = recommendations?.length ?? 0

  return (
    <div className="card fade-in-up" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Rocket size={18} color="#0ea5a4" />
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#131f3d', margin: 0 }}>Recommended next steps</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {!hasProfile && (
          <button onClick={() => navigate('/users/upload-cv')} className="card card-hover" style={{ textAlign: 'left', cursor: 'pointer', border: '1.5px solid #e4e9ea', padding: 16 }}>
            <Upload size={18} color="#10b981" />
            <div style={{ fontWeight: 600, color: '#131f3d', marginTop: 8, fontSize: 14 }}>Upload CV</div>
            <div style={{ fontSize: 12, color: '#76777e', marginTop: 4 }}>Build your base profile</div>
          </button>
        )}
        {!hasExp && (
          <button onClick={onStartInterview} disabled={isInterviewPending} className="card card-hover" style={{ textAlign: 'left', cursor: 'pointer', border: '1.5px solid #e4e9ea', padding: 16 }}>
            <MessageSquare size={18} color="#0ea5a4" />
            <div style={{ fontWeight: 600, color: '#131f3d', marginTop: 8, fontSize: 14 }}>Complete AI Interview</div>
            <div style={{ fontSize: 12, color: '#76777e', marginTop: 4 }}>5 questions, ~3 minutes</div>
          </button>
        )}
        {recCount === 0 && hasSkills && (
          <button onClick={() => navigate('/users/jobs')} className="card card-hover" style={{ textAlign: 'left', cursor: 'pointer', border: '1.5px solid #e4e9ea', padding: 16 }}>
            <Briefcase size={18} color="#131f3d" />
            <div style={{ fontWeight: 600, color: '#131f3d', marginTop: 8, fontSize: 14 }}>Generate job matches</div>
            <div style={{ fontSize: 12, color: '#76777e', marginTop: 4 }}>See roles curated for you</div>
          </button>
        )}
        {recCount > 0 && (
          <button onClick={() => navigate('/users/jobs')} className="card card-hover" style={{ textAlign: 'left', cursor: 'pointer', border: '1.5px solid #e4e9ea', padding: 16 }}>
            <Search size={18} color="#8b5cf6" />
            <div style={{ fontWeight: 600, color: '#131f3d', marginTop: 8, fontSize: 14 }}>Browse matches</div>
            <div style={{ fontSize: 12, color: '#76777e', marginTop: 4 }}>{recCount} role{recCount === 1 ? '' : 's'} ready</div>
          </button>
        )}
      </div>
    </div>
  )
}
