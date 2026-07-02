import { ArrowLeft } from 'lucide-react'

interface Props {
  status: string | undefined
  messageCount: number
  questionsAnswered: number
  elapsedMinutes: number
  onBack: () => void
}

export default function ChatHeader({ status, messageCount, questionsAnswered, elapsedMinutes, onBack }: Props) {
  const isActive = status === 'IN_PROGRESS'

  return (
    <div className="bg-gradient-to-br from-primary-container to-[#1e3a5f] px-5 py-4 flex items-center gap-3 shrink-0">
      <button
        onClick={onBack}
        aria-label="Back"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
      >
        <ArrowLeft size={18} />
      </button>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center shrink-0 text-xs font-bold text-white">
        AI
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-white font-semibold text-sm">Interviewed AI</span>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald' : 'bg-white/40'}`} />
        </div>
        <div className="text-white/60 text-xs truncate">
          {isActive ? 'Online' : status} · Interview berlangsung {elapsedMinutes} menit · {questionsAnswered} pertanyaan selesai
        </div>
      </div>
      <span className="ml-auto badge bg-white/10 text-white shrink-0">{messageCount} messages</span>
    </div>
  )
}
