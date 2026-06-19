import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { Check, Clock, AlertCircle } from 'lucide-react'
import type { ChatMessage } from './useInterviewSession'

gsap.registerPlugin(TextPlugin)

const TYPEWRITER_MS_PER_CHAR = 14

interface Props {
  message: ChatMessage
}

export default function MessageBubble({ message }: Props) {
  const isAi = message.role === 'AI'
  const bubbleRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!bubbleRef.current) return
    const entrance = gsap.from(bubbleRef.current, {
      opacity: 0,
      y: 14,
      x: isAi ? -10 : 10,
      duration: 0.35,
      ease: 'power2.out',
    })

    const typewriter = isAi && textRef.current
      ? gsap.fromTo(
          textRef.current,
          { text: '' },
          {
            text: message.content,
            duration: Math.min(2.2, message.content.length * (TYPEWRITER_MS_PER_CHAR / 1000)),
            ease: 'none',
          }
        )
      : undefined

    return () => {
      entrance.revert()
      typewriter?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={bubbleRef} className={`flex mb-4 ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-teal flex items-center justify-center mr-2.5 shrink-0 text-[11px] font-bold text-white">
          AI
        </div>
      )}
      <div className="max-w-[72%] flex flex-col gap-1">
        <div
          className={`px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
            isAi
              ? 'bg-white text-on-surface rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-md'
              : 'bg-gradient-to-br from-emerald to-teal text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-md shadow-none'
          }`}
        >
          {isAi ? <p ref={textRef} className="m-0 whitespace-pre-wrap" /> : <p className="m-0 whitespace-pre-wrap">{message.content}</p>}
        </div>
        {!isAi && (
          <span className="flex items-center gap-1 self-end text-[11px] text-outline px-1">
            {message.status === 'sending' && <><Clock size={11} /> Sending…</>}
            {message.status === 'error' && <><AlertCircle size={11} className="text-error" /> Failed to send</>}
            {message.status !== 'sending' && message.status !== 'error' && <><Check size={11} className="text-teal" /> Sent</>}
          </span>
        )}
      </div>
    </div>
  )
}
