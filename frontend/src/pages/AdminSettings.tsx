import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Save } from "lucide-react"

export default function AdminSettings() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ site_name: "", contact_email: "", contact_phone: "", address: "" })

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => (await api.get("/settings/")).data,
  })

  useEffect(() => {
    if (settings) setForm(settings)
  }, [settings])

  const updateSettings = useMutation({
    mutationFn: async (data: any) => await api.patch("/settings/", data),
    onSuccess: () => {
      toast.success("Mipangilio imehifadhiwa!")
      queryClient.invalidateQueries({ queryKey: ["site-settings"] })
    },
  })

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-6">Mipangilio ya Duka</h1>
      <Card className="border-0 shadow-lg shadow-black/5">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">Jina la Duka</label>
            <Input value={form.site_name} onChange={e => setForm({...form, site_name: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Email ya Mawasiliano</label>
            <Input type="email" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Namba ya Simu</label>
            <Input value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Anwani</label>
            <Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <Button size="lg" className="w-full rounded-xl mt-4 gradient-primary text-white border-0" onClick={() => updateSettings.mutate(form)}>
            <Save className="w-5 h-5 mr-2" /> Hifadhi Mipangilio
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}