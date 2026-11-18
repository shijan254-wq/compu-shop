import { Link } from "react-router-dom"
import { useCartStore } from "@/store/cartStore"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { formatPrice } from "@/lib/utils"
import { Trash2, ShoppingBag } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function Cart() {
  const { items, total, setCart } = useCartStore()

  const updateQty = async (id: number, qty: number) => {
    const { data } = await api.patch(`/cart/items/${id}/`, { quantity: qty })
    setCart(data)
  }
  const removeItem = async (id: number) => {
    const { data } = await api.delete(`/cart/items/${id}/`)
    setCart(data)
    toast.success("Imeondolewa")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Kikapu chako ni tupu</h2>
        <p className="text-muted-foreground mb-6">Anza kununua bidhaa zetu bora</p>
        <Link to="/shop"><Button size="lg">Nenda Dukani</Button></Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">Kikapu Chako</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary/40">{item.product.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.product.final_price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateQty(item.id, item.quantity - 1)}>−</Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => updateQty(item.id, item.quantity + 1)}>+</Button>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit sticky top-20">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Muhtasari</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm"><span>Jumla ndogo</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-sm"><span>Usafirishaji</span><span className="text-green-600">Bure</span></div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Jumla</span><span>{formatPrice(total)}</span></div>
            </div>
            <Link to="/checkout"><Button size="lg" className="w-full">Endelea Malipo</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}