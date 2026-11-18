import { useQuery } from "@tanstack/react-query"
import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Search } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { useState } from "react"

const CATEGORIES = [
  { label: "Zote", value: "" },
  { label: "Laptops", value: "laptop" },
  { label: "Simu", value: "phone" },
  { label: "Tablets", value: "tablet" },
  { label: "Desktop", value: "desktop" },
  { label: "Vifaa", value: "accessory" },
]

const SORTS = [
  { label: "Mpya Kwanza", value: "-created_at" },
  { label: "Bei: Chini â†’ Juu", value: "price" },
  { label: "Bei: Juu â†’ Chini", value: "-price" },
  { label: "Jina A-Z", value: "name" },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get("search") || "")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const handleSearchChange = async (val: string) => {
    setSearch(val)
    if (val.length < 2) return setSuggestions([])
    const { data } = await api.get(`/search/suggestions/?q=${val}`)
    setSuggestions(data)
  }
  const activeType = params.get("product_type") || ""
  const activeSort = params.get("ordering") || "-created_at"

  const { data, isLoading } = useQuery({
    queryKey: ["products", params.toString()],
    queryFn: async () => (await api.get(`/products/?${params.toString()}`)).data,
  })
  const { setCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const addToCart = async (id: number) => {
    if (!isAuthenticated) return toast.error("Tafadhali ingia kwanza")
    const { data } = await api.post("/cart/add/", { product_id: id, quantity: 1 })
    setCart(data)
    toast.success("Imeongezwa!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Duka Letu</h1>
      <p className="text-muted-foreground mb-6">{data?.count || 0} bidhaa zimepatikana</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map(c => (
          <Button
            key={c.value}
            variant={activeType === c.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("product_type", c.value)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        <div className="relative flex-1 max-w-md min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tafuta bidhaa..." value={search} onChange={e => handleSearchChange(e.target.value)} className="pl-10"
            onKeyDown={e => e.key === "Enter" && setFilter("search", search)} />
        </div>
        <select
          className="h-11 rounded-lg border border-input bg-background px-4 text-sm"
          value={activeSort}
          onChange={e => setFilter("ordering", e.target.value)}
        >
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <Button onClick={() => setFilter("search", search)}>Tafuta</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.results?.map((p: any, i: number) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="card-hover h-full overflow-hidden group">
                <Link to={`/product/${p.slug}`}>
                  <div className="aspect-square bg-secondary/50 flex items-center justify-center">
                    "{ p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> : <div className="text-6xl font-bold text-primary/20 group-hover:scale-110 transition-transform">{p.name[0]}</div> }"
                  </div>
                </Link>
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground mb-1">{p.brand_name}</p>
                  <Link to={`/product/${p.slug}`}><h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition">{p.name}</h3></Link>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-extrabold text-lg">{formatPrice(p.final_price)}</p>
                    {p.discount_price && <Badge className="bg-destructive/10 text-destructive">-{Math.round((1 - p.discount_price/p.price)*100)}%</Badge>}
                  </div>
                  <Button size="sm" className="w-full" onClick={() => addToCart(p.id)}>
                    <ShoppingCart className="w-4 h-4" /> Ongeza
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {data?.results?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">Hakuna bidhaa zilizopatikana</p>
        </div>
      )}
    </div>
  )
}

