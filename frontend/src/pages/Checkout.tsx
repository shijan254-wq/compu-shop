import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCartStore } from "@/store/cartStore"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { formatPrice } from "@/lib/utils"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function Checkout() {
  const { total, clear } = useCartStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "", city: "", notes: "" })
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post("/checkout/", form)
      clear()
      toast.success(`Oda imefanikiwa! #${data.order_number}`)
      navigate("/account")
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Hitilafu imetokea")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-extrabold mb-6">Maliza Oda</h1>
      <form onSubmit={submit}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-bold text-lg">Taarifa za Usafirishaji</h2>
            <Input placeholder="Jina kamili" required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
            <Input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <Input placeholder="Namba ya simu" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <Input placeholder="Anwani" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            <Input placeholder="Mji" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            <textarea className="w-full rounded-lg border p-3 text-sm" rows={3} placeholder="Maelezo ya ziada (hiari)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardContent className="p-6">
            <div className="flex justify-between font-bold text-lg mb-4"><span>Jumla:</span><span>{formatPrice(total)}</span></div>
            <Button size="lg" className="w-full" type="submit" disabled={loading}>{loading ? "Inatuma..." : "Weka Oda"}</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}