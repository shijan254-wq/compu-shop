import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistState {
  ids: number[]
  toggle: (id: number) => void
  has: (id: number) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const ids = get().ids
        set({ ids: ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id] })
      },
      has: (id) => get().ids.includes(id),
    }),
    { name: "wishlist-storage" }
  )
)