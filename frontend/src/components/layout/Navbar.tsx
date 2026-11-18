import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { Button } from "@/components/ui/Button"
import { ShoppingCart, User, LogOut, Laptop, Moon, Sun, Menu, X, Heart, Scale, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { itemCount } = useCartStore()
  const { ids: wishlistIds } = useWishlistStore()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  const links = [
    { to: "/", label: "Nyumbani" },
    { to: "/shop", label: "Duka" },
    { to: "/shop?product_type=laptop", label: "Laptops" },
    { to: "/shop?product_type=phone", label: "Simu" },
  ]

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto glass-nav rounded-2xl">
        <div className="px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <Laptop className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">CompuShop</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-secondary/50 rounded-full p-1">
            {links.map(l => (
              <NavLink 
                key={l.to} 
                to={l.to} 
                className={({isActive}) => cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300", 
                  isActive 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setDark(!dark)} className="p-2 rounded-xl hover:bg-accent transition text-muted-foreground hover:text-foreground">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <Link to="/compare" className="relative p-2 rounded-xl hover:bg-accent transition text-muted-foreground hover:text-foreground hidden md:block">
              <Scale className="w-5 h-5" />
            </Link>
            
            <Link to="/wishlist" className="relative p-2 rounded-xl hover:bg-accent transition text-muted-foreground hover:text-foreground hidden md:block">
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </Link>

            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-accent transition text-muted-foreground hover:text-foreground mx-1">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full gradient-primary text-white text-[10px] flex items-center justify-center font-bold shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="w-px h-6 bg-border mx-1 hidden md:block" />

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-1">
                <Link to="/account"><Button variant="ghost" size="sm" className="rounded-xl"><User className="w-4 h-4 mr-1" />{user?.username}</Button></Link>
                {user?.role === "admin" && (
                  <>
                    <Link to="/admin"><Button variant="outline" size="sm" className="rounded-xl">Admin</Button></Link>
                    <Link to="/admin/settings"><Button variant="ghost" size="sm" className="rounded-xl"><Settings className="w-4 h-4" /></Button></Link>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/") }} className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><LogOut className="w-4 h-4" /></Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm" className="rounded-xl">Ingia</Button></Link>
                <Link to="/register"><Button size="sm" className="rounded-xl gradient-primary text-white border-0 shadow-md shadow-primary/30">Jisajili</Button></Link>
              </div>
            )}

            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border/50 px-4 py-4 space-y-2 bg-background/95 backdrop-blur-xl rounded-b-2xl"
            >
              {links.map(l => (
                <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-accent transition">
                  {l.label}
                </NavLink>
              ))}
              <div className="flex gap-2 pt-4 border-t border-border/50">
                {isAuthenticated ? (
                  <Button variant="outline" className="flex-1 rounded-xl text-red-500" onClick={() => { logout(); setMobileOpen(false) }}>Toka</Button>
                ) : (
                  <>
                    <Link to="/login" className="flex-1"><Button variant="outline" className="w-full rounded-xl">Ingia</Button></Link>
                    <Link to="/register" className="flex-1"><Button className="w-full rounded-xl gradient-primary text-white border-0">Jisajili</Button></Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}