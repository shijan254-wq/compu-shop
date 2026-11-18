import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <h1 className="text-8xl md:text-9xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ukurasa Haupatikani</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Samahani, ukurasa unaoutafuta haupo au umeondolewa. Tafadhali rudi nyumbani au uangalie bidhaa zetu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/"><Button size="lg" className="w-full sm:w-auto rounded-xl gradient-primary text-white border-0"><Home className="w-5 h-5 mr-2" /> Rudi Nyumbani</Button></Link>
          <Link to="/shop"><Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl"><Search className="w-5 h-5 mr-2" /> Nenda Dukani</Button></Link>
        </div>
      </motion.div>
    </div>
  )
}