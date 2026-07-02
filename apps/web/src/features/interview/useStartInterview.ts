import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import type { ApiResponse, StartInterviewResponse } from '../../types/api'

export function useStartInterview() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const res = await api.post<ApiResponse<StartInterviewResponse>>('/api/interview/start')
      return res.data.data
    },
    onSuccess: (data) => {
      navigate(`/interview/${data.sessionId}`)
    },
  })
}
