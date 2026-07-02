import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api, { clearAuthTokens } from '@/libs/api/client'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('interviewed_refresh_token')
      return api.post('/api/auth/logout', { refreshToken })
    },
    onSuccess: () => {
      clearAuthTokens()
      queryClient.clear()
      navigate('/auth/login')
    },
    onError: () => {
      clearAuthTokens()
      queryClient.clear()
      navigate('/auth/login')
    },
  })
}
