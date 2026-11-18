import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { api } from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice } from "@/lib/utils"
import { Package } from "lucide-react"

export default function Account() {
  const { user } = useAuthStore()
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => (await api.get("/orders/")).data,
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold mb-2">Akaunti Yangu</h1>
      <p className="text-muted-foreground mb-6">Karibu, {user?.username}!</p>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="font-bold mb-3">Taarifa Zangu</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Username:</span> {user?.username}</div>
            <div><span className="text-muted-foreground">Email:</span> {user?.email}</div>
            <div><span className="text-muted-foreground">Simu:</span> {user?.phone || "-"}</div>
            <div><span className="text-muted-foreground">Aina:</span> <Badge>{user?.role}</Badge></div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Oda Zangu</h2>
      {orders?.results?.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground"><Package className="w-12 h-12 mx-auto mb-3 opacity-50" />Hakuna oda bado</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {orders?.results?.map((o: any) => (
            <Link to={`/order/${o.id}`} key={o.id}>
              <Card className="hover:shadow-lg transition cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">{o.order_number}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("sw-TZ")}</p>
                    </div>
                    <Badge>{o.status}</Badge>
                  </div>
                  <p className="font-extrabold">{formatPrice(o.total_amount)}</p>
                  <p className="text-sm text-muted-foreground">{o.items?.length} bidhaa</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}