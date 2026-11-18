import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, FileText } from "lucide-react"
import { motion } from "framer-motion"

export default function OrderDetail() {
  const { id } = useParams()
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => (await api.get(`/orders/${id}/`)).data,
  })

  if (isLoading) return <div className="container mx-auto px-4 py-32"><div className="h-96 rounded-xl bg-muted animate-pulse" /></div>
  if (!order) return <div className="container mx-auto px-4 py-32 text-center"><p>Oda haipatikani</p></div>

  const statusSteps = [
    { key: "pending", label: "Imepokelewa", icon: Clock },
    { key: "paid", label: "Imelipiwa", icon: CheckCircle },
    { key: "shipped", label: "Imesafirishwa", icon: Truck },
    { key: "delivered", label: "Imefikishwa", icon: Package },
  ]

  const currentIndex = statusSteps.findIndex(s => s.key === order.status)

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
      <Link to="/account" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Rudi kwenye Akaunti
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Oda #{order.order_number}</h1>
          <p className="text-muted-foreground">{new Date(order.created_at).toLocaleString("sw-TZ")}</p>
        </div>
        <Badge className={
          order.status === "pending" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
          order.status === "paid" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
          order.status === "shipped" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
          order.status === "delivered" ? "bg-green-500/10 text-green-600 border-green-500/20" :
          "bg-destructive/10 text-destructive"
        }>{order.status}</Badge>
      </div>

      <Card className="mb-6 border-0 shadow-lg shadow-black/5">
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-6">Hali ya Oda</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                {i < statusSteps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-1 rounded-full ${i < currentIndex ? "bg-primary" : "bg-border"}`} />
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500 ${i <= currentIndex ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" : "bg-muted text-muted-foreground"}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <p className={`text-xs mt-2 text-center font-semibold ${i <= currentIndex ? "text-primary" : "text-muted-foreground"}`}>{step.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-0 shadow-lg shadow-black/5">
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4">Bidhaa ({order.items?.length})</h2>
          <div className="space-y-3">
            {order.items?.map((item: any, i: number) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 border border-border/50">
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary/40">{item.product_name[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">Idadi: {item.quantity} Ã— {formatPrice(item.price)}</p>
                </div>
                <p className="font-bold">{formatPrice(item.subtotal)}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg shadow-black/5">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4">Taarifa za Usafirishaji</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Jina:</span> {order.full_name}</p>
              <p><span className="text-muted-foreground">Simu:</span> {order.phone}</p>
              <p><span className="text-muted-foreground">Email:</span> {order.email}</p>
              <p><span className="text-muted-foreground">Anwani:</span> {order.address}</p>
              <p><span className="text-muted-foreground">Mji:</span> {order.city}</p>
              <p><span className="text-muted-foreground">Nchi:</span> {order.country}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-black/5">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4">Muhtasari wa Malipo</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Jumla ndogo</span><span>{formatPrice(order.total_amount)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Usafirishaji</span><span className="text-green-600 font-semibold">Bure</span></div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-lg"><span>Jumla</span><span className="text-primary">{formatPrice(order.total_amount)}</span></div>
            </div>
            {order.notes && <p className="mt-4 text-sm text-muted-foreground italic">"{order.notes}"</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
