import { useParams, Link } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, ArrowLeft, Shield, Truck, Star, Heart, Scale } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { useCompareStore } from "@/store/compareStore"
import { toast } from "sonner"
import { useState } from "react"

export default function ProductDetail() {
  const { slug } = useParams()
  const queryClient = useQueryClient()
  const { setCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlistStore()
  const { toggle: toggleCompare, has: hasCompare } = useCompareStore()

  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)

  // Fetch product
  const { data: p, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => (await api.get(`/products/${slug}/`)).data,
  })

  // Fetch related products
  const { data: related } = useQuery({
    queryKey: ["related-products", p?.category?.id],
    queryFn: async () => {
      if (!p?.category?.id) return []
      const { data } = await api.get(`/products/?category=${p.category.id}`)
      return data.results.filter((r: any) => r.id !== p.id).slice(0, 4)
    },
    enabled: !!p?.category?.id,
  })

  const addToCart = async () => {
    if (!isAuthenticated) return toast.error("Ingia kwanza")
    const { data } = await api.post("/cart/add/", { product_id: p.id, quantity: 1 })
    setCart(data)
    toast.success("Imeongezwa kwenye kikapu!")
  }

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error("Ingia kwanza")
    try {
      await api.post("/wishlist/", { product_id: p.id })
      toggleWishlist(p.id)
      toast.success(hasWishlist(p.id) ? "Imeondolewa kwenye wishlist" : "Imeongezwa kwenye wishlist!")
    } catch (e) {
      toast.error("Hitilafu imetokea")
    }
  }

  const handleCompare = () => {
    toggleCompare(p.id)
    toast.success(hasCompare(p.id) ? "Imeondolewa kwenye ulinganisho" : "Imeongezwa kwenye ulinganisho!")
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) return toast.error("Ingia kwanza kuweka maoni")
    try {
      await api.post("/reviews/", { product_id: p.id, rating: reviewRating, comment: reviewText })
      toast.success("Maoni yamewekwa!")
      setReviewText("")
      queryClient.invalidateQueries({ queryKey: ["product", slug] })
    } catch (err) {
      toast.error("Imeshindikana kuweka maoni")
    }
  }

  if (isLoading) return <div className="container mx-auto px-4 py-20"><div className="h-96 rounded-xl bg-muted animate-pulse" /></div>
  if (!p) return <div className="container mx-auto px-4 py-20 text-center"><p>Bidhaa haipatikani</p></div>

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Rudi Dukani
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24">
          <div className="aspect-square rounded-3xl bg-secondary/30 flex items-center justify-center overflow-hidden border border-border shadow-xl">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-9xl font-bold text-primary/20">{p.name[0]}</div>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition">{p.brand?.name}</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{p.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-extrabold gradient-text">{formatPrice(p.final_price)}</span>
            {p.discount_price && <span className="text-xl text-muted-foreground line-through">{formatPrice(p.price)}</span>}
          </div>

          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{p.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-secondary/20 p-6 rounded-2xl border border-border/50">
            {p.processor && <div><span className="text-sm text-muted-foreground block">Processor</span><span className="font-semibold">{p.processor}</span></div>}
            {p.ram && <div><span className="text-sm text-muted-foreground block">RAM</span><span className="font-semibold">{p.ram}</span></div>}
            {p.storage && <div><span className="text-sm text-muted-foreground block">Storage</span><span className="font-semibold">{p.storage}</span></div>}
            {p.os && <div><span className="text-sm text-muted-foreground block">OS</span><span className="font-semibold">{p.os}</span></div>}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Badge className={p.in_stock ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
              {p.in_stock ? `Ipo (${p.stock})` : "Haipo"}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button size="lg" className="flex-1 h-14 rounded-2xl gradient-primary text-white border-0 shadow-lg shadow-primary/30" onClick={addToCart} disabled={!p.in_stock}>
              <ShoppingCart className="w-5 h-5 mr-2" /> Ongeza Kwenye Kikapu
            </Button>
            <Button size="lg" variant="outline" className={`h-14 w-14 rounded-2xl ${hasWishlist(p.id) ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20" : ""}`} onClick={handleWishlist}>
              <Heart className={`w-6 h-6 ${hasWishlist(p.id) ? "fill-current" : ""}`} />
            </Button>
            <Button size="lg" variant="outline" className={`h-14 w-14 rounded-2xl ${hasCompare(p.id) ? "text-primary border-primary/30 bg-primary/5" : ""}`} onClick={handleCompare}>
              <Scale className="w-6 h-6" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
            <div className="flex items-center gap-3 text-sm"><Shield className="w-6 h-6 text-primary" /> Dhamana 1 Mwaka</div>
            <div className="flex items-center gap-3 text-sm"><Truck className="w-6 h-6 text-primary" /> Usafirishaji Bure</div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-extrabold mb-6">Maoni ya Wateja ({p.reviews?.length || 0})</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {p.reviews?.length === 0 ? (
              <p className="text-muted-foreground">Hakuna maoni bado. Kuwa wa kwanza kuweka maoni!</p>
            ) : (
              p.reviews?.map((rev: any) => (
                <Card key={rev.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{rev.user_name}</span>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < rev.rating ? "fill-current" : "text-gray-300"}`} />)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{rev.comment}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <Card className="border-0 shadow-lg bg-secondary/10 h-fit">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Andika Maoni</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(num => (
                      <button type="button" key={num} onClick={() => setReviewRating(num)}>
                        <Star className={`w-6 h-6 ${num <= reviewRating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-primary outline-none" 
                  rows={4} 
                  placeholder="Maoni yako..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full rounded-xl gradient-primary text-white border-0">Tuma Maoni</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <div className="mt-20 border-t border-border pt-12">
          <h2 className="text-3xl font-extrabold mb-8">Bidhaa <span className="gradient-text">Zinazofanana</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((r: any) => (
              <Card key={r.id} className="card-hover overflow-hidden border-0 shadow-md bg-card group rounded-2xl">
                <Link to={`/product/${r.slug}`}>
                  <div className="aspect-square bg-secondary/30 flex items-center justify-center overflow-hidden">
                    {r.image_url ? <img src={r.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <span className="text-4xl font-bold text-primary/20">{r.name[0]}</span>}
                  </div>
                </Link>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{r.name}</h3>
                  <p className="font-bold text-primary mt-1">{formatPrice(r.final_price)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}