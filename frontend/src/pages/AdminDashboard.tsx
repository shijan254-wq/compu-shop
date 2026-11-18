import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice } from "@/lib/utils"
import { DollarSign, Package, ShoppingBag, TrendingUp, Users } from "lucide-react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

export default function AdminDashboard() {
  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => (await api.get("/orders/")).data,
  })
  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => (await api.get("/products/")).data,
  })

  const totalRevenue = orders?.results?.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0) || 0
  const orderCount = orders?.results?.length || 0
  const productCount = products?.count || 0
  const pendingOrders = orders?.results?.filter((o: any) => o.status === "pending").length || 0

  const stats = [
    { label: "Mapato Yote", value: formatPrice(totalRevenue), icon: DollarSign, color: "text-green-600", bg: "bg-green-500/10" },
    { label: "Oda Zote", value: orderCount, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Bidhaa", value: productCount, icon: Package, color: "text-purple-600", bg: "bg-purple-500/10" },
    { label: "Zinasubiri", value: pendingOrders, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-500/10" },
  ]

  // Mock Data kwa ajili ya Grafu (Inaweza kubadilishwa kuwa dynamic baadaye)
  const salesData = [
    { name: "Jan", mauzo: 4000 },
    { name: "Feb", mauzo: 3000 },
    { name: "Mar", mauzo: 5000 },
    { name: "Apr", mauzo: 4500 },
    { name: "May", mauzo: 6000 },
    { name: "Jun", mauzo: 5500 },
  ]

  const pieData = [
    { name: "Laptops", value: 45 },
    { name: "Simu", value: 35 },
    { name: "Tablets", value: 15 },
    { name: "Vifaa", value: 5 },
  ]
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b']

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Muhtasari wa biashara yako</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="card-hover border-0 shadow-lg shadow-black/5">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
                <p className="text-2xl font-extrabold">{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-black/5">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-6">Mwenendo wa Mauzo (Miezi 6)</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="mauzo" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/5">
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-6">Mauzo kwa Aina</h2>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-lg shadow-black/5">
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4">Oda za Hivi Karibuni</h2>
          {orders?.results?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Hakuna oda bado</p>
          ) : (
            <div className="space-y-3">
              {orders?.results?.slice(0, 10).map((o: any) => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition">
                  <div>
                    <p className="font-semibold">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">{o.full_name} • {new Date(o.created_at).toLocaleDateString("sw-TZ")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-extrabold">{formatPrice(o.total_amount)}</p>
                    <Badge className={
                      o.status === "pending" ? "bg-orange-500/10 text-orange-600" :
                      o.status === "paid" ? "bg-blue-500/10 text-blue-600" :
                      o.status === "delivered" ? "bg-green-500/10 text-green-600" :
                      "bg-muted"
                    }>{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}