import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/axios'
import type { User } from '../types'

interface AuthStore {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({ user: data.user, accessToken: data.accessToken })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/register', { name, email, password })
          set({ user: data.user, accessToken: data.accessToken })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        await api.post('/auth/logout')
        set({ user: null, accessToken: null })
        delete api.defaults.headers.common['Authorization']
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data })
        } catch {
          set({ user: null, accessToken: null })
        }
      },
    }),
    {
      name: 'todo-auth',
      partialize: (s) => ({ accessToken: s.accessToken }),
    }
  )
)
