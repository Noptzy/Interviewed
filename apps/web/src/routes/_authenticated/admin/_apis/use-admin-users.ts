import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/libs/api/client'
import type { AdminUser, ApiResponse } from '@/types/api'

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<AdminUser[]>>('/api/admin/users')
      return res.data.data
    },
  })
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { email: string; name: string; password: string; role: 'USER' | 'ADMIN' }) => {
      const res = await api.post<ApiResponse<AdminUser>>('/api/admin/users', data)
      return res.data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; email?: string; name?: string; password?: string; role?: 'USER' | 'ADMIN' }) => {
      const res = await api.put<ApiResponse<AdminUser>>(`/api/admin/users/${id}`, data)
      return res.data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })
}
