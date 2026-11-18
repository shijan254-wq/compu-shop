import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useWishlistStore } from "@/store/wishlistStore"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"

export default function Wishlist() {
  const { data: wishlist, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => (await api.get("/wishlist/")).data,
  })
  const { toggle } = useWishlistStore()
  const { setCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const addToCart = async (id: number) => {
    if (!isAuthenticated) return toast.error("Ingia kwanza")
    const { data } = await api.post("/cart/add/", { product_id: id, quantity: 1 })
    setCart(data)
    toast.success("Imeongezwa kwenye kikapu!")
  }

  const removeFromWishlist = async (productId: number) => {
    await api.post("/wishlist/", { product_id: productId })
    toggle(productId)
    refetch()
    toast.success("Imeondolewa kwenye wishlist")
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 pt-32 text-center">
        <Heart className="w-20 h-20 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Wishlist yako ni tupu</h2>
        <p className="text-muted-foreground mb-6">Hifadhi bidhaa unazozipenda</p>
        <Link to="/shop"><Button size="lg" className="rounded-xl">Nenda Dukani</Button></Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-extrabold mb-6">Vipendwa Vyangu ({wishlist.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item: any) => (
          <Card key={item.id} className="card-hover h-full overflow-hidden group rounded-3xl border-0 shadow-lg shadow-black/5 bg-card">
            <Link to={`/product/${item.product.slug}`}>
              <div className="aspect-square bg-secondary/50 flex items-center justify-center overflow-hidden">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-6xl font-bold text-primary/20">{item.product.name[0]}</div>
                )}
              </div>
            </Link>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground mb-1">{item.product.brand_name}</p>
              <h3 className="font-semibold mb-2 line-clamp-2">{item.product.name}</h3>
              <p className="font-extrabold text-lg mb-3">{formatPrice(item.product.final_price)}</p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 rounded-xl gradient-primary text-white border-0" onClick={() => addToCart(item.product.id)}>
                  <ShoppingCart className="w-4 h-4 mr-1" /> Ongeza
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl text-destructive hover:bg-destructive/10" onClick={() => removeFromWishlist(item.product.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}