import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PartyPopper } from 'lucide-react'
import AppShell from '../components/AppShell'
import MessageBubble from '../features/interview/MessageBubble'
import TypingIndicator from '../features/interview/TypingIndicator'
import ChatHeader from '../features/interview/ChatHeader'
import InsightPanel from '../features/interview/InsightPanel'
import ComposerInput from '../features/interview/ComposerInput'
import { useInterviewSession } from '../features/interview/useInterviewSession'
import api from '../lib/api'
import type { ApiResponse, ProfileResponse } from '../types/api'

const ESTIMATED_QUESTION_TARGET = 5

function parseSkills(skillsJson: string | null | undefined): string[] {
  if (!skillsJson) return []
  try {
    const parsed = JSON.parse(skillsJson)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export default function Interview() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { sessionQuery, answerMutation } = useInterviewSession(sessionId)
  const { data: session, isLoading } = sessionQuery

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<ProfileResponse>>('/api/profile')
        return res.data.data
      } catch {
        return null
      }
    },
  })

  const isComplete = session?.status === 'COMPLETED'
  const messages = session?.messages ?? []
  const questionsAnswered = messages.filter((m) => m.role === 'USER').length
  const progressPct = Math.min(100, Math.round((questionsAnswered / ESTIMATED_QUESTION_TARGET) * 100))
  const elapsedMinutes = messages.length > 1
    ? Math.max(
        1,
        Math.round(
          (new Date(messages[messages.length - 1].createdAt).getTime() - new Date(messages[0].createdAt).getTime()) / 60_000
        )
      )
    : 0
  const skills = parseSkills(profile?.skillsJson)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, answerMutation.isPending])

  if (isLoading) {
    return (
      <AppShell>
        <div className="-m-8 h-screen flex flex-col">
          <div className="bg-gradient-to-br from-primary-container to-[#1e3a5f] h-[68px] shrink-0" />
          <div className="flex-1 p-5 flex flex-col gap-4">
            <div className="h-16 w-2/3 rounded-2xl bg-surface-container animate-pulse" />
            <div className="h-16 w-1/2 rounded-2xl bg-surface-container animate-pulse self-end" />
            <div className="h-16 w-3/5 rounded-2xl bg-surface-container animate-pulse" />
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="-m-8 h-screen flex">
        <div className="flex-1 min-w-0 flex flex-col">
          <ChatHeader
            status={session?.status}
            messageCount={messages.length}
            questionsAnswered={questionsAnswered}
            elapsedMinutes={elapsedMinutes}
            onBack={() => navigate(-1)}
          />

          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 bg-background">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {answerMutation.isPending && <TypingIndicator />}
            {isComplete && (
              <div className="text-center py-8">
                <PartyPopper className="mx-auto mb-2 text-emerald" size={36} />
                <h3 className="text-primary-container font-bold m-0 mb-2">Interview Complete!</h3>
                <p className="text-on-surface-variant text-sm mb-4">Your profile has been updated. Get your job matches now.</p>
                <button onClick={() => navigate('/recommendations')} className="btn-primary">View Job Matches</button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!isComplete && (
            <ComposerInput onSend={(text) => answerMutation.mutate(text)} disabled={answerMutation.isPending} />
          )}

          <div className="shrink-0 px-5 py-2 bg-amber-50 text-[11px] text-amber-800 border-t border-amber-100">
            This is a recruitment simulation powered by AI. Outputs are recommendations only and do not constitute hiring decisions.
          </div>
        </div>

        <InsightPanel skills={skills} progressPct={progressPct} />
      </div>
    </AppShell>
  )
}
