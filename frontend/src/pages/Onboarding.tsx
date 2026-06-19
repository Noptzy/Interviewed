import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Link2, ArrowRight, FileText, AlertTriangle, CheckCircle2, X, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import AppShell from '../components/AppShell'
import Button from '../components/Button'
import Input from '../components/Input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { ApiResponse, CvExtractResponse } from '../types/api'

export default function Onboarding() {
  const [file, setFile] = useState<File | null>(null)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [cvText, setCvText] = useState('')
  const [cvWarning, setCvWarning] = useState<string | null>(null)
  const [looksLikeCv, setLooksLikeCv] = useState<boolean | null>(null)
  const [step, setStep] = useState<'upload' | 'analyzing'>('upload')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const containerRef = useRef<HTMLDivElement>(null)

  const uploadCv = useMutation({
    mutationFn: async (f: File) => {
      const form = new FormData()
      form.append('file', f)
      const res = await api.post<ApiResponse<CvExtractResponse>>('/api/cv/upload', form)
      return res.data.data
    },
  })

  const analyzeProfile = useMutation({
    mutationFn: async ({ cvFullText, url }: { cvFullText: string; url: string }) => {
      const res = await api.post('/api/profile/analyze', { cvText: cvFullText, linkedinUrl: url || null })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      navigate('/dashboard')
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setError('')
    setCvWarning(null)
    setLooksLikeCv(null)
    try {
      const result = await uploadCv.mutateAsync(f)
      setCvText(result.fullText)
      setLooksLikeCv(result.looksLikeCv)
      setCvWarning(result.cvWarning)
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Failed to parse CV. Please upload a PDF or DOCX file.'
      )
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setCvText('')
    setCvWarning(null)
    setLooksLikeCv(null)
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cvText && !linkedinUrl) {
      setError('Please upload a CV or enter a LinkedIn URL')
      return
    }
    setStep('analyzing')
    analyzeProfile.mutate({ cvFullText: cvText, url: linkedinUrl })
  }

  // GSAP entrance + warning pulse
  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.ob-fade', {
        y: 18,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power3.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!cvWarning) return
    const el = document.querySelector('.cv-warning')
    if (!el) return
    gsap.fromTo(
      el,
      { x: -10, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    )
  }, [cvWarning])

  return (
    <AppShell>
      <div ref={containerRef} style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="ob-fade" style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '6px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600, marginBottom: 14 }}>
            <Sparkles size={12} /> Build your candidate profile
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#131f3d', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            Let's get you matched
          </h1>
          <p style={{ color: '#45464e', margin: 0, fontSize: 15 }}>
            Upload your CV and/or LinkedIn URL — the AI recruiter will read it and start asking questions.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* CV Upload */}
          <div className="card ob-fade" style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={18} color="#10b981" />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#131f3d', margin: 0 }}>Upload CV</h2>
                <p style={{ fontSize: 12, color: '#76777e', margin: 0 }}>PDF or DOCX, max 5MB</p>
              </div>
              <span className="badge badge-emerald">Required</span>
            </div>

            <div
              onClick={() => !file && fileRef.current?.click()}
              style={{
                border: `2px dashed ${file ? '#10b981' : '#c6c6ce'}`,
                borderRadius: 12,
                padding: 36,
                textAlign: 'center',
                cursor: file ? 'default' : 'pointer',
                transition: 'all 0.2s',
                background: file ? 'rgba(16,185,129,0.04)' : 'white',
              }}
            >
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={22} color="#10b981" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, color: '#131f3d', fontSize: 14 }}>{file.name}</div>
                      <div style={{ fontSize: 12, color: uploadCv.isPending ? '#0ea5a4' : (looksLikeCv === false ? '#ba1a1a' : '#10b981'), marginTop: 2 }}>
                        {uploadCv.isPending
                          ? 'Parsing your CV…'
                          : looksLikeCv === false
                            ? '⚠ Does not look like a CV'
                            : '✓ Parsed successfully'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemoveFile() }}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: '#f5fafb', border: '1px solid #e4e9ea',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    aria-label="Remove file"
                  >
                    <X size={14} color="#76777e" />
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f5fafb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Upload size={24} color="#0ea5a4" />
                  </div>
                  <div style={{ fontWeight: 600, color: '#131f3d', fontSize: 15 }}>Click to upload your CV</div>
                  <div style={{ fontSize: 13, color: '#76777e', marginTop: 4 }}>PDF or DOCX · max 5MB</div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.docx" onChange={handleFileChange} style={{ display: 'none' }} />

            {/* CV validation warning */}
            {cvWarning && (
              <div
                className="cv-warning"
                style={{
                  marginTop: 14,
                  padding: 14,
                  borderRadius: 12,
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={16} color="#b45309" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#92400e', fontSize: 13, marginBottom: 4 }}>
                    This doesn't look like a CV
                  </div>
                  <p style={{ color: '#78350f', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                    {cvWarning}
                  </p>
                </div>
              </div>
            )}

            {looksLikeCv === true && (
              <div style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 12,
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ color: '#065f46', fontSize: 13, fontWeight: 500 }}>
                  CV verified — the AI is ready to analyze it.
                </span>
              </div>
            )}
          </div>

          {/* LinkedIn */}
          <div className="card ob-fade" style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(14,165,164,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link2 size={18} color="#0ea5a4" />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#131f3d', margin: 0 }}>LinkedIn Profile</h2>
                <p style={{ fontSize: 12, color: '#76777e', margin: 0 }}>Boosts profile accuracy</p>
              </div>
              <span className="badge badge-teal">Optional</span>
            </div>
            <Input
              placeholder="https://linkedin.com/in/your-profile"
              value={linkedinUrl}
              onChange={e => setLinkedinUrl(e.target.value)}
            />
          </div>

          {error && (
            <p style={{
              color: '#ba1a1a', fontSize: 14, marginBottom: 16,
              padding: '10px 14px', background: '#ffdad6', borderRadius: 10,
              border: '1px solid rgba(186,26,26,0.2)',
            }}>
              {error}
            </p>
          )}

          <div className="ob-fade">
            <Button
              type="submit"
              loading={step === 'analyzing' || analyzeProfile.isPending || uploadCv.isPending}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px' }}
            >
              {step === 'analyzing' ? (
                <>
                  <Sparkles size={16} style={{ animation: 'spin 1.2s linear infinite' }} />
                  AI is analyzing your profile…
                </>
              ) : (
                <>
                  <span>Analyze with AI</span>
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </form>
      </div>
    </AppShell>
  )
}