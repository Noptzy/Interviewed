import { useQuery } from '@tanstack/react-query'
import api from '@/libs/api/client'
import type { ApiResponse, OverviewStats } from '@/types/api'

export function useOverview() {
  return useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<OverviewStats>>('/api/admin/analytics/overview')
      return res.data.data
    },
  })
}
