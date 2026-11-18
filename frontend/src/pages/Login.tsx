import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { toast } from "sonner"
import { Laptop } from "lucide-react"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      toast.success("Karibu tena!")
      navigate("/")
    } catch {
      toast.error("Jina au password si sahihi")
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
            <h1 className="text-2xl font-extrabold">Karibu Tena</h1>
            <p className="text-muted-foreground text-sm">Ingia kwenye akaunti yako</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <Input placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} />
            <Input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            <Button size="lg" className="w-full" type="submit" disabled={loading}>{loading ? "Inaingia..." : "Ingia"}</Button>
          </form>
          <p className="text-center text-sm mt-4 text-muted-foreground">
            Huna akaunti? <Link to="/register" className="text-primary font-semibold">Jisajili</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}