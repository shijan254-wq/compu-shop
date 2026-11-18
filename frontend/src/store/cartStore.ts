import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: number; product: any; quantity: number; subtotal: string
}

interface CartState {
  items: CartItem[]
  total: string
  itemCount: number
  setCart: (data: any) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [], total: "0", itemCount: 0,
      setCart: (data) => set({ items: data.items || [], total: data.total || "0", itemCount: data.item_count || 0 }),
      clear: () => set({ items: [], total: "0", itemCount: 0 }),
    }),
    { name: "cart-storage" }
  )
)