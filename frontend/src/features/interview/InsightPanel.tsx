import { Sparkles, CheckCircle2 } from 'lucide-react'

interface Props {
  skills: string[]
  progressPct: number
}

export default function InsightPanel({ skills, progressPct }: Props) {
  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-4 p-5">
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-teal" />
          <h3 className="text-sm font-bold text-primary-container m-0">AI Insight</h3>
        </div>
        <p className="text-xs text-outline mb-3">Kemampuan terdeteksi dari CV</p>
        {skills.length > 0 ? (
          <div className="flex flex-col gap-2">
            {skills.slice(0, 6).map((skill) => (
              <div key={skill} className="flex items-center gap-2 text-[13px] text-on-surface">
                <CheckCircle2 size={14} className="text-emerald shrink-0" />
                {skill}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-outline m-0">Belum ada skill terdeteksi.</p>
        )}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-primary-container m-0">Progress interview</h3>
          <span className="text-xs font-semibold text-teal">{progressPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </aside>
  )
}
