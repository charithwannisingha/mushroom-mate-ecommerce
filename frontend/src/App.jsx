// ============================================================
// ප්‍රධාන යෙදුම් සංරචකය - සියලුම මාර්ග (routes) මෙහි අර්ථ දක්වයි
// ============================================================
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ProtectedRoute } from './components/ui'

// පොදු පිටු (public pages)
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import KnowledgeHub from './pages/KnowledgeHub'
import KnowledgeDetail from './pages/KnowledgeDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// පාරිභෝගික පිටු (customer pages)
import MyOrders from './pages/customer/MyOrders'
import Profile from './pages/customer/Profile'

// ගොවි පිටු (farmer pages)
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import FarmerProducts from './pages/farmer/FarmerProducts'
import FarmerOrders from './pages/farmer/FarmerOrders'

// පරිපාලක පිටු (admin pages)
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders'
// අලුතින් එකතු කළ පිටු (New Admin Pages)
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminKnowledge from './pages/admin/AdminKnowledge'

export default function App() {
  const location = useLocation()
  // dashboard පිටුවල footer නොපෙන්වයි (cleaner app feel)
  const hideFooter = ['/farmer', '/admin'].some((p) => location.pathname.startsWith(p))

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* පොදු මාර්ග */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/knowledge" element={<KnowledgeHub />} />
          <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* පාරිභෝගික පමණක් (customer only) */}
          <Route path="/checkout" element={<ProtectedRoute roles={['customer']}><Checkout /></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* ගොවි පමණක් (farmer only) */}
          <Route path="/farmer" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/farmer/products" element={<ProtectedRoute roles={['farmer']}><FarmerProducts /></ProtectedRoute>} />
          <Route path="/farmer/orders" element={<ProtectedRoute roles={['farmer']}><FarmerOrders /></ProtectedRoute>} />

          {/* පරිපාලක පමණක් (admin only) */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
          {/* අලුතින් එකතු කළ Admin Routes */}
          <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute roles={['admin']}><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/knowledge" element={<ProtectedRoute roles={['admin']}><AdminKnowledge /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}