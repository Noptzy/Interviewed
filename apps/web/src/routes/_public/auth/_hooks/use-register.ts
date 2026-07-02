import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api, { setAuthTokens } from '@/libs/api/client'
import type { ApiResponse, AuthResponse } from '@/types/api'

export function useRegister() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: { email: string; password: string; name: string }) => {
      const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data)
      return res.data.data
    },
    onSuccess: async (data) => {
      setAuthTokens(data)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      navigate('/users/dashboard')
    },
  })
}
