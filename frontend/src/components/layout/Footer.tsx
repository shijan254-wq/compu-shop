import { Link } from "react-router-dom"
import { Laptop, Globe, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30 mt-20">
      <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl mb-4">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Laptop className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">CompuShop</span>
          </Link>
          <p className="text-sm text-muted-foreground mb-4">Duka lako la kuaminika kwa kompyuta na simu Tanzania.</p>
          <div className="flex gap-3">
            <Globe className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition" />
            <Mail className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition" />
            <Phone className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition" />
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4">Duka</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop?product_type=laptop" className="hover:text-primary">Laptops</Link></li>
            <li><Link to="/shop?product_type=phone" className="hover:text-primary">Simu</Link></li>
            <li><Link to="/shop?product_type=tablet" className="hover:text-primary">Tablets</Link></li>
            <li><Link to="/shop?product_type=accessory" className="hover:text-primary">Vifaa</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Kampuni</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">Kuhusu Sisi</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Wasiliana</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Masharti</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Faragha</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Mawasiliano</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +255 700 000 000</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@compushop.tz</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Dar es Salaam</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CompuShop. Haki zote zimehifadhiwa.
      </div>
    </footer>
  )
}