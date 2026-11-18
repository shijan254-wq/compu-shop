import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice } from "@/lib/utils"
import { ArrowRight, ShoppingCart, Star, Zap, Shield, Truck, Sparkles } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { Helmet } from "react-helmet-async"

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => (await api.get("/products/?is_featured=true")).data,
  })
  const { setCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const addToCart = async (id: number) => {
    if (!isAuthenticated) return toast.error("Tafadhali ingia kwanza")
    const { data } = await api.post("/cart/add/", { product_id: id, quantity: 1 })
    setCart(data)
    toast.success("Imeongezwa kwenye kikapu!")
  }

  return (
    <div className="pt-24 pb-12">
      <Helmet>
        <title>CompuShop — Kompyuta na Simu Bora Tanzania</title>
        <meta name="description" content="Nunua Laptops, Simu, Tablets na vifaa vya kisasa kwa bei nafuu Tanzania. Ubora wa hali ya juu, uhakika wa asilimia 100." />
      </Helmet>
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <Badge className="bg-primary/10 text-primary mb-6 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 mr-2" /> Ofa za Wiki Hii
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1]">
              Teknolojia <span className="gradient-text">Bora</span> kwa Maisha Bora.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Laptops, simu, na vifaa vya kisasa kwa bei nafuu. Ubora wa hali ya juu, uhakika wa asilimia 100.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/shop"><Button size="lg" className="rounded-2xl h-14 px-8 gradient-primary text-white border-0 shadow-xl shadow-primary/30 hover:scale-105 transition-transform"><ShoppingCart className="w-5 h-5 mr-2" /> Nunua Sasa</Button></Link>
              <Link to="/shop?product_type=laptop"><Button variant="outline" size="lg" className="rounded-2xl h-14 px-8 glass border-2 hover:bg-accent">Angalia Laptops</Button></Link>
            </div>
            
            <div className="flex items-center gap-6 mt-10">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center font-bold text-xs">U{i}</div>)}
              </div>
              <div>
                <div className="flex text-yellow-500"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                <p className="text-sm font-semibold mt-1">Wateja 10,000+ wanatuamini</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, type: "spring" }} className="relative hidden md:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[3rem] opacity-20 blur-2xl transform rotate-6" />
              <div className="relative h-full w-full glass rounded-[3rem] p-8 border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden group">
                <Zap className="w-48 h-48 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-8 left-8 right-8 glass p-4 rounded-2xl border border-white/20">
                  <p className="text-sm font-bold text-muted-foreground mb-1">Promax Deals</p>
                  <p className="text-2xl font-extrabold gradient-text">Punguzo hadi 40%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Usafirishaji Bure", desc: "Oda zaidi ya 500K" },
            { icon: Shield, title: "Dhamana 1 Mwaka", desc: "Bidhaa zote" },
            { icon: Zap, title: "Malipo ya Haraka", desc: "M-Pesa, Tigo" },
            { icon: Star, title: "Ubora wa 5-Star", desc: "Wateja 10,000+" },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <Card className="card-hover h-full border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-8 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">Bidhaa <span className="gradient-text">Maarufu</span></h2>
            <p className="text-muted-foreground text-lg">Chaguo bora kwa wateja wetu</p>
          </div>
          <Link to="/shop"><Button variant="outline" className="rounded-xl hidden md:flex">Zote <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data?.results?.slice(0, 8).map((p: any, i: number) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <Card className="card-hover h-full overflow-hidden border-0 shadow-lg shadow-black/5 bg-card group rounded-3xl">
                  <Link to={`/product/${p.slug}`}>
                    <div className="aspect-[4/5] bg-secondary/30 flex items-center justify-center overflow-hidden relative">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="text-6xl font-bold text-primary/20">{p.name[0]}</div>
                      )}
                      {p.discount_price && <Badge className="absolute top-4 right-4 bg-red-500 text-white border-0 shadow-lg shadow-red-500/30">-{Math.round((1 - p.discount_price/p.price)*100)}%</Badge>}
                    </div>
                  </Link>
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{p.brand_name}</p>
                    <Link to={`/product/${p.slug}`}><h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{p.name}</h3></Link>
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-extrabold text-xl">{formatPrice(p.final_price)}</p>
                      {p.discount_price && <p className="text-sm text-muted-foreground line-through">{formatPrice(p.price)}</p>}
                    </div>
                    <Button size="sm" className="w-full rounded-xl gradient-primary text-white border-0 shadow-md shadow-primary/20 opacity-90 group-hover:opacity-100 transition-opacity" onClick={() => addToCart(p.id)}>
                      <ShoppingCart className="w-4 h-4 mr-2" /> Ongeza
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
