import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils"
import { ArrowLeft, Printer } from "lucide-react"

export default function Invoice() {
  const { id } = useParams()
  const { data: order } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => (await api.get(`/orders/${id}/`)).data,
  })

  if (!order) return null

  const handlePrint = () => window.print()

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-3xl print:py-0 print:pt-0">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link to="/account"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Rudi</Button></Link>
        <Button onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print / Save PDF</Button>
      </div>

      <div className="bg-white text-black p-8 rounded-xl border print:border-0 print:shadow-none">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold">CompuShop</h1>
          <p className="text-gray-500">Dar es Salaam, Tanzania | info@compushop.tz</p>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <h2 className="font-bold text-lg mb-2">Mteja:</h2>
            <p>{order.full_name}</p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
            <p>{order.address}, {order.city}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-lg mb-2">Risiti #:</h2>
            <p>{order.order_number}</p>
            <p>{new Date(order.created_at).toLocaleDateString("sw-TZ")}</p>
          </div>
        </div>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2">Bidhaa</th>
              <th className="text-center py-2">Idadi</th>
              <th className="text-right py-2">Bei</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">{item.product_name}</td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">{formatPrice(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end border-t-2 border-gray-300 pt-4">
          <div className="text-right">
            <p className="text-lg font-bold">Jumla:</p>
            <p className="text-2xl font-extrabold">{formatPrice(order.total_amount)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}