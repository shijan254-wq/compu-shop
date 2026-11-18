import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils"
import { X } from "lucide-react"
import { useCompareStore } from "@/store/compareStore"

export default function Compare() {
  const { ids, toggle, clear } = useCompareStore()
  const { data: products } = useQuery({
    queryKey: ["compare", ids],
    queryFn: async () => {
      if (ids.length === 0) return []
      const { data } = await api.get("/products/")
      return data.results.filter((p: any) => ids.includes(p.id))
    },
    enabled: ids.length > 0,
  })

  if (ids.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 pt-32 text-center">
        <h2 className="text-2xl font-bold mb-2">Hakuna bidhaa za kulinganisha</h2>
        <p className="text-muted-foreground mb-6">Ongeza bidhaa kwenye duka ili uzilinganishe</p>
        <Link to="/shop"><Button size="lg" className="rounded-xl">Nenda Dukani</Button></Link>
      </div>
    )
  }

  const specs = [
    { label: "Bei", key: "final_price", format: formatPrice },
    { label: "Brand", key: "brand_name" },
    { label: "Aina", key: "product_type" },
    { label: "Hali", key: "condition" },
    { label: "Stock", key: "stock" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold">Linganisha Bidhaa</h1>
        <Button variant="outline" onClick={clear} className="rounded-xl">Ondoa Zote</Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border shadow-lg bg-card">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left bg-secondary/50 rounded-tl-2xl font-bold">Kipengele</th>
              {products?.map((p: any) => (
                <th key={p.id} className="p-4 min-w-[200px] bg-secondary/50">
                  <div className="flex flex-col items-center">
                    <button onClick={() => toggle(p.id)} className="self-end mb-2 text-muted-foreground hover:text-destructive transition-colors"><X className="w-5 h-5" /></button>
                    {p.image_url ? <img src={p.image_url} className="w-24 h-24 object-cover rounded-xl mb-2" /> : <div className="w-24 h-24 bg-muted rounded-xl mb-2 flex items-center justify-center text-3xl font-bold text-primary/20">{p.name[0]}</div>}
                    <Link to={`/product/${p.slug}`} className="font-bold text-center hover:text-primary transition-colors line-clamp-2">{p.name}</Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, i) => (
              <tr key={spec.key} className={i % 2 === 0 ? "bg-background" : "bg-secondary/10"}>
                <td className="p-4 font-semibold border-t border-border">{spec.label}</td>
                {products?.map((p: any) => (
                  <td key={p.id} className="p-4 text-center border-t border-border">
                    {spec.format ? spec.format(p[spec.key]) : p[spec.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4 font-semibold border-t border-border">Vitendo</td>
              {products?.map((p: any) => (
                <td key={p.id} className="p-4 text-center border-t border-border">
                  <Link to={`/product/${p.slug}`}><Button size="sm" className="rounded-lg gradient-primary text-white border-0">Angalia</Button></Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}