import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'
import type { ApiResponse, InterviewSessionResponse, AnswerResponse } from '../../types/api'

export type ChatMessageStatus = 'sending' | 'sent' | 'error'

export type ChatMessage = InterviewSessionResponse['messages'][number] & {
  status?: ChatMessageStatus
}

const OPTIMISTIC_ID_PREFIX = -1

export function useInterviewSession(sessionId: string | undefined) {
  const queryClient = useQueryClient()
  const queryKey = ['interview', sessionId]

  const sessionQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get<ApiResponse<InterviewSessionResponse>>(`/api/interview/${sessionId}`)
      return res.data.data
    },
    enabled: !!sessionId,
  })

  const answerMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await api.post<ApiResponse<AnswerResponse>>(`/api/interview/${sessionId}/answer`, { text })
      return res.data.data
    },
    onMutate: async (text: string) => {
      const optimisticMessage: ChatMessage = {
        id: OPTIMISTIC_ID_PREFIX * Date.now(),
        role: 'USER',
        content: text,
        createdAt: new Date().toISOString(),
        status: 'sending',
      }
      queryClient.setQueryData<InterviewSessionResponse | undefined>(queryKey, (current) =>
        current ? { ...current, messages: [...current.messages, optimisticMessage] } : current
      )
      return { optimisticId: optimisticMessage.id }
    },
    onError: (_err, _text, context) => {
      queryClient.setQueryData<InterviewSessionResponse | undefined>(queryKey, (current) => {
        if (!current || !context) return current
        return {
          ...current,
          messages: current.messages.map((m) =>
            m.id === context.optimisticId ? { ...m, status: 'error' as const } : m
          ),
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })

  return { sessionQuery, answerMutation }
}
