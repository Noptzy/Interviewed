import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function TypingIndicator() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.from(ref.current, { opacity: 0, y: 10, duration: 0.25, ease: 'power2.out' })
  }, [])

  return (
    <div ref={ref} className="flex items-end mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center mr-2.5 shrink-0 text-[11px] font-bold text-white">
        AI
      </div>
      <div className="bg-white rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-md px-4 py-3.5 shadow-sm flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}
