import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/libs/api/client'
import type { ApiResponse, GlobalSettings, ModelOption } from '@/types/api'

export function useGlobalSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<GlobalSettings>>('/api/admin/settings')
      return res.data.data
    },
  })
}

export function useUpdateGlobalSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { model: string; temperature: number; systemPrompt: string }) => {
      const res = await api.put<ApiResponse<GlobalSettings>>('/api/admin/settings', data)
      return res.data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-settings'] }),
  })
}

export function useAdminModels() {
  return useQuery({
    queryKey: ['admin-models'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ModelOption[]>>('/api/admin/settings/models')
      return res.data.data
    },
  })
}

export function useAvailableModels() {
  return useQuery({
    queryKey: ['admin-models-available'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<ModelOption[]>>('/api/admin/settings/models/available')
      return res.data.data
    },
    retry: 1,
  })
}

export function useCreateAdminModel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ModelOption) => {
      const res = await api.post<ApiResponse<ModelOption>>('/api/admin/settings/models', data)
      return res.data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-models'] }),
  })
}

export function useDeleteAdminModel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/settings/models?id=${encodeURIComponent(id)}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-models'] }),
  })
}
