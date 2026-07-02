import { Briefcase, ArrowRight } from 'lucide-react'
import type { RecommendationResponse } from '../types/api'

type Props = {
  jobs: RecommendationResponse[]
  onSeeAll: () => void
}

export default function TopJobPreview({ jobs, onSeeAll }: Props) {
  if (jobs.length === 0) return null
  return (
    <div className="card fade-in-up" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#131f3d', margin: 0 }}>Top job matches</h2>
          <p style={{ fontSize: 12, color: '#76777e', margin: '4px 0 0' }}>AI-curated based on your profile</p>
        </div>
        <button onClick={onSeeAll} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0ea5a4', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          View all <ArrowRight size={14} />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {jobs.map((job) => (
          <div key={job.id} className="card card-hover" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg, #0ea5a4, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Briefcase size={20} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: '#131f3d', fontSize: 15 }}>{job.jobTitle}</div>
              <div style={{ fontSize: 13, color: '#45464e', marginTop: 2 }}>{job.company}{job.location ? ` · ${job.location}` : ''}</div>
            </div>
            {job.applyUrl && (
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
                Apply <ArrowRight size={13} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
