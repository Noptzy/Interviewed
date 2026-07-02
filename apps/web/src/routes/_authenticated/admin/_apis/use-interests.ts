import { useQuery } from '@tanstack/react-query'
import api from '@/libs/api/client'
import type { ApiResponse, InterestStat } from '@/types/api'

export function useInterests() {
  return useQuery({
    queryKey: ['admin-interests'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<InterestStat[]>>('/api/admin/analytics/interests')
      return res.data.data
    },
  })
}
