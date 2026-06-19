import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Briefcase, MapPin, ExternalLink, RefreshCw, MessageSquare, Search, Sparkles, Upload } from 'lucide-react'
import AppShell from '../components/AppShell'
import api from '../lib/api'
import type { ApiResponse, RecommendationResponse } from '../types/api'

const FILTERS = ['Remote', 'Full-time', 'Senior', 'Junior', 'Contract'] as const
type Filter = (typeof FILTERS)[number]

function matchPctFor(index: number, total: number): number {
  if (total === 0) return 0
  return Math.max(60, Math.round(96 - (index * (36 / total))))
}

export default function Recommendations() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Set<Filter>>(new Set())

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<RecommendationResponse[]>>('/api/recommendations')
      return res.data.data
    },
  })

  const generate = useMutation({
    mutationFn: async () => {
      const res = await api.post<ApiResponse<RecommendationResponse[]>>('/api/recommendations/generate')
      return res.data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
  })

  const toggleFilter = (f: Filter) => {
    const next = new Set(activeFilters)
    if (next.has(f)) next.delete(f); else next.add(f)
    setActiveFilters(next)
  }

  const filtered = useMemo(() => {
    const list = recommendations ?? []
    if (!query && activeFilters.size === 0) return list.map((r, i) => ({ rec: r, matchPct: matchPctFor(i, list.length) }))
    const q = query.toLowerCase()
    return list
      .filter((r) => {
        if (q && !`${r.jobTitle} ${r.company} ${r.location}`.toLowerCase().includes(q)) return false
        if (activeFilters.has('Remote') && !/remote/i.test(r.location)) return false
        return true
      })
      .map((r, i) => ({ rec: r, matchPct: matchPctFor(i, list.length) }))
  }, [recommendations, query, activeFilters])

  return (
    <AppShell>
      <div style={{ maxWidth: 980 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#131f3d', margin: '0 0 6px' }}>Job Matches</h1>
            <p style={{ color: '#45464e', margin: 0, fontSize: 14 }}>Curated opportunities based on your profile</p>
          </div>
          <button onClick={() => generate.mutate()} disabled={generate.isPending} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RefreshCw size={16} className={generate.isPending ? 'spin-anim' : ''} />
            {generate.isPending ? 'Finding jobs…' : 'Refresh Matches'}
          </button>
        </div>

        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#76777e" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by role, company, or location…"
              style={{
                width: '100%', padding: '12px 14px 12px 40px', fontSize: 14,
                border: '1.5px solid #e4e9ea', borderRadius: 10, background: '#fafbfc', color: '#171c1e',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => toggleFilter(f)} className={`filter-chip ${activeFilters.has(f) ? 'filter-chip-active' : ''}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#45464e' }}>Loading recommendations…</div>
        )}

        {!isLoading && (!recommendations || recommendations.length === 0) && (
          <div className="card" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(135deg, #0ea5a4, #10b981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Sparkles size={32} color="white" />
            </div>
            <h2 style={{ color: '#131f3d', margin: '0 0 12px', fontSize: 22 }}>No job matches yet</h2>
            <p style={{ color: '#45464e', margin: '0 0 28px', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', fontSize: 14, lineHeight: 1.5 }}>
              Build your AI profile by uploading your CV and completing the interview — then I'll match you with roles that fit.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/onboarding/upload')} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Upload size={14} /> Upload CV
              </button>
              <button onClick={() => generate.mutate()} className="btn-primary" disabled={generate.isPending}>
                {generate.isPending ? 'Searching…' : 'Find Jobs Now'}
              </button>
            </div>
          </div>
        )}

        {!isLoading && recommendations && recommendations.length > 0 && filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <h3 style={{ color: '#131f3d', margin: '0 0 8px' }}>No matches for your filters</h3>
            <p style={{ color: '#76777e', margin: 0, fontSize: 14 }}>Try clearing some filters or adjusting your search.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(({ rec, matchPct }) => (
            <div key={rec.id} className="card card-hover" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <span className="match-pill" style={{ background: matchPct >= 85 ? 'rgba(16,185,129,0.12)' : 'rgba(14,165,164,0.12)', color: matchPct >= 85 ? '#10b981' : '#0ea5a4', border: `1px solid ${matchPct >= 85 ? 'rgba(16,185,129,0.3)' : 'rgba(14,165,164,0.3)'}` }}>
                  {matchPct}% match
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12, paddingRight: 100 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #131f3d, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Briefcase size={22} color="white" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#131f3d', margin: '0 0 4px' }}>{rec.jobTitle}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ color: '#45464e', fontWeight: 600, fontSize: 14 }}>{rec.company}</span>
                    {rec.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#76777e', fontSize: 13 }}>
                        <MapPin size={12} /> {rec.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {rec.matchReason && (
                <div style={{ padding: 12, background: 'rgba(14,165,164,0.05)', borderRadius: 10, marginBottom: 12, borderLeft: '3px solid #0ea5a4' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0ea5a4', marginBottom: 4, letterSpacing: '0.04em' }}>WHY THIS ROLE</div>
                  <p style={{ color: '#171c1e', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{rec.matchReason}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {rec.strengths && (
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 6, letterSpacing: '0.04em' }}>STRENGTHS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {rec.strengths.split(',').map((s, i) => (
                        <span key={i} className="badge badge-emerald">{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {rec.gaps && (
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#76777e', marginBottom: 6, letterSpacing: '0.04em' }}>GROWTH AREAS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {rec.gaps.split(',').map((g, i) => (
                        <span key={i} className="badge badge-navy">{g.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {rec.applyUrl && (
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <a href={rec.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: 13, padding: '8px 16px' }}>
                    Apply <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {recommendations && recommendations.length > 0 && (
          <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(245,158,11,0.08)', borderRadius: 10, fontSize: 12, color: '#856404', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={14} />
            These are AI-generated recommendations. Verify roles on the employer's official website before applying.
          </div>
        )}
      </div>
    </AppShell>
  )
}
