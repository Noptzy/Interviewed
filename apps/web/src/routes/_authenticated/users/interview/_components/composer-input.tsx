import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Send } from 'lucide-react'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export default function ComposerInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleSend = () => {
    if (!text.trim() || disabled) return
    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' })
    }
    onSend(text.trim())
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2.5 p-4 bg-white border-t border-outline-variant/40 shrink-0">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ketik jawaban…"
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none px-3.5 py-2.5 rounded-xl border-[1.5px] border-outline-variant font-sans text-[15px] outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/15"
      />
      <button
        ref={buttonRef}
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className={`w-11 h-11 rounded-xl flex items-center justify-center self-end shrink-0 transition-colors ${
          disabled || !text.trim() ? 'bg-surface-container cursor-not-allowed' : 'bg-gradient-to-br from-emerald to-teal cursor-pointer hover:brightness-105'
        }`}
      >
        <Send size={18} color={disabled || !text.trim() ? '#76777e' : 'white'} />
      </button>
    </div>
  )
}
