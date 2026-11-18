import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "@/lib/api"

interface AuthState {
  user: any | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  loadProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username, password) => {
        const { data } = await api.post("/auth/login/", { username, password })
        localStorage.setItem("access_token", data.access)
        localStorage.setItem("refresh_token", data.refresh)
        const profile = await api.get("/auth/profile/")
        set({ user: profile.data, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        set({ user: null, isAuthenticated: false })
      },
      loadProfile: async () => {
        try {
          const { data } = await api.get("/auth/profile/")
          set({ user: data, isAuthenticated: true })
        } catch {
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    { name: "auth-storage", partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
)