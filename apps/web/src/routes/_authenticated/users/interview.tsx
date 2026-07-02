import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MessageSquare, PartyPopper } from 'lucide-react'
import AppShell from '@/routes/_authenticated/_components/app-shell'
import MessageBubble from './interview/_components/message-bubble'
import TypingIndicator from './interview/_components/typing-indicator'
import ChatHeader from './interview/_components/chat-header'
import InsightPanel from './interview/_components/insight-panel'
import ComposerInput from './interview/_components/composer-input'
import { useInterviewSession } from './interview/_hooks/use-interview-session'
import api from '@/libs/api/client'
import type { ApiResponse, ProfileResponse } from '@/types/api'
import { useStartInterview } from './_hooks/use-start-interview'

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
  const startInterview = useStartInterview()

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

  if (!sessionId) {
    return (
      <AppShell area="user" size="narrow">
        <div className="card" style={{ textAlign: 'center', padding: 42 }}>
          <div style={{ width: 58, height: 58, borderRadius: 16, background: 'linear-gradient(135deg, #0ea5a4, #10b981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <MessageSquare size={26} color="white" />
          </div>
          <h1 style={{ fontSize: 24, color: '#131f3d', margin: '0 0 8px' }}>Start AI Interview</h1>
          <p style={{ color: '#64748b', margin: '0 0 22px', fontSize: 14 }}>Create a new interview session before sending answers.</p>
          <button className="btn-primary" disabled={startInterview.isPending} onClick={() => startInterview.mutate()}>
            {startInterview.isPending ? 'Starting...' : 'Start Interview'}
          </button>
        </div>
      </AppShell>
    )
  }

  if (isLoading) {
    return (
      <AppShell area="user">
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
    <AppShell area="user" size="wide">
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
                <button onClick={() => navigate('/users/jobs')} className="btn-primary">View Job Matches</button>
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
