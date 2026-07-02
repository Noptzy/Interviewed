import { useQuery } from '@tanstack/react-query'
import api from '@/libs/api/client'
import type { ApiResponse, CurrentUser } from '@/types/api'

export function useCurrentUser() {
  return useQuery<CurrentUser | null>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<CurrentUser>>('/api/me')
      return res.data.data
    },
    retry: false,
  })
}
