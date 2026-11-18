import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ScrollProgress } from "@/components/ui/ScrollProgress"
import { BackToTop } from "@/components/ui/BackToTop"

const Home = lazy(() => import("@/pages/Home"))
const Shop = lazy(() => import("@/pages/Shop"))
const ProductDetail = lazy(() => import("@/pages/ProductDetail"))
const Cart = lazy(() => import("@/pages/Cart"))
const Checkout = lazy(() => import("@/pages/Checkout"))
const Login = lazy(() => import("@/pages/Login"))
const Register = lazy(() => import("@/pages/Register"))
const Account = lazy(() => import("@/pages/Account"))
const OrderDetail = lazy(() => import("@/pages/OrderDetail"))
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"))
const AdminSettings = lazy(() => import("@/pages/AdminSettings"))
const Wishlist = lazy(() => import("@/pages/Wishlist"))
const Compare = lazy(() => import("@/pages/Compare"))
const Invoice = lazy(() => import("@/pages/Invoice"))
const NotFound = lazy(() => import("@/pages/NotFound"))

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-xl">Inapakia...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}