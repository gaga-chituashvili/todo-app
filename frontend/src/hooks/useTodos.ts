import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { TodoFilters } from '../types'

export const useTodos = (filters: TodoFilters = {}) => {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.priority) params.append('priority', filters.priority)
  if (filters.search) params.append('search', filters.search)
  if (filters.sortBy) params.append('sortBy', filters.sortBy)
  if (filters.order) params.append('order', filters.order)

  return useQuery({
    queryKey: ['todos', filters],
    queryFn: () => api.get(`/todos?${params}`).then((r) => r.data),
  })
}

export const useTodoStats = () =>
  useQuery({
    queryKey: ['todo-stats'],
    queryFn: () => api.get('/todos/stats').then((r) => r.data),
  })

export const useCreateTodo = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.post('/todos', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] })
      qc.invalidateQueries({ queryKey: ['todo-stats'] })
    },
  })
}

export const useUpdateTodo = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.patch(`/todos/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] })
      qc.invalidateQueries({ queryKey: ['todo-stats'] })
    },
  })
}

export const useDeleteTodo = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/todos/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] })
      qc.invalidateQueries({ queryKey: ['todo-stats'] })
    },
  })
}
