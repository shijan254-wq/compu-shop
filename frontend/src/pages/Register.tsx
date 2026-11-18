import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Laptop } from "lucide-react"

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "", phone: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.password2) return toast.error("Passwords hazifanani")
    setLoading(true)
    try {
      await api.post("/auth/register/", form)
      toast.success("Umejisajili! Sasa ingia.")
      navigate("/login")
    } catch (err: any) {
      const msg = Object.values(err.response?.data || {}).flat().join(", ") || "Hitilafu"
      toast.error(msg as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-4">
              <Laptop className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold">Jisajili</h1>
            <p className="text-muted-foreground text-sm">Tengeneza akaunti mpya</p>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <Input placeholder="Username" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
            <Input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <Input placeholder="Namba ya simu" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <Input type="password" placeholder="Password (min 8)" required minLength={8} value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <Input type="password" placeholder="Rudia password" required value={form.password2} onChange={e => setForm({...form, password2: e.target.value})} />
            <Button size="lg" className="w-full" type="submit" disabled={loading}>{loading ? "Inatengeneza..." : "Jisajili"}</Button>
          </form>
          <p className="text-center text-sm mt-4 text-muted-foreground">
            Una akaunti? <Link to="/login" className="text-primary font-semibold">Ingia</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}