import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api, { setAuthTokens } from '@/libs/api/client'
import type { ApiResponse, AuthResponse } from '@/types/api'

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', data)
      return res.data.data
    },
    onSuccess: (data) => {
      setAuthTokens(data)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/users/dashboard')
    },
  })
}
