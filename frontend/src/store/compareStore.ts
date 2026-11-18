import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CompareState {
  ids: number[]
  toggle: (id: number) => void
  has: (id: number) => boolean
  clear: () => void
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const ids = get().ids
        if (ids.includes(id)) {
          set({ ids: ids.filter(i => i !== id) })
        } else {
          if (ids.length >= 4) return alert("Unaweza kulinganisha bidhaa 4 tu!")
          set({ ids: [...ids, id] })
        }
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "compare-storage" }
  )
)