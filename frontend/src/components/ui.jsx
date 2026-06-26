// ============================================================
// පොදු UI සංරචක (shared UI components)
// ============================================================
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ShoppingCart, MapPin, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { lkr } from '../api/helpers'

// ---- නිෂ්පාදන කාඩ්පත (product card) ----
export function ProductCard({ product }) {
  const { addItem } = useCart()
  const outOfStock = product.stock <= 0

  return (
    <div className="card overflow-hidden group flex flex-col">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img src={product.image} alt={product.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-3 left-3 badge bg-cream/95 text-pine-700 backdrop-blur">{product.category}</span>
        {outOfStock && (
          <span className="absolute top-3 right-3 badge bg-clay text-cream">Sold out</span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-600 text-pine-700 leading-snug line-clamp-2 hover:text-spore-600 transition">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-soil/50 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {product.farm_name || product.farmer_name} · {product.farm_city}
        </p>
        <div className="mt-3 flex items-end justify-between pt-2 mt-auto">
          <div>
            <span className="font-display font-700 text-lg text-pine-700">{lkr(product.price)}</span>
            <span className="text-xs text-soil/50"> / {product.unit}</span>
          </div>
          <button onClick={() => addItem(product)} disabled={outOfStock}
            className="btn-spore p-2.5 rounded-xl" aria-label="Add to cart">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- ආරක්ෂිත මාර්ග (protected route by role) ----
export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

// ---- පූරණ දර්ශකය (loading spinner) ----
export function PageLoader() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <Loader2 className="w-8 h-8 text-spore-600 animate-spin" />
    </div>
  )
}

// ---- හිස් තත්ත්වය (empty state) ----
export function EmptyState({ icon: Icon = AlertCircle, title, message, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="grid place-items-center w-16 h-16 rounded-2xl bg-pine-50 mx-auto mb-4">
        <Icon className="w-8 h-8 text-pine-700/60" />
      </div>
      <h3 className="font-display font-600 text-xl text-pine-700">{title}</h3>
      {message && <p className="mt-2 text-soil/60 max-w-sm mx-auto">{message}</p>}
      {action}
    </div>
  )
}

// ---- සංඛ්‍යාලේඛන කාඩ්පත (stat card for dashboards) ----
export function StatCard({ icon: Icon, label, value, accent = 'pine' }) {
  const accents = {
    pine: 'bg-pine-50 text-pine-700',
    spore: 'bg-spore/15 text-spore-600',
    clay: 'bg-clay/10 text-clay',
    blue: 'bg-blue-50 text-blue-600',
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`grid place-items-center w-12 h-12 rounded-xl ${accents[accent]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-display font-700 text-pine-700 leading-none">{value}</p>
        <p className="text-sm text-soil/55 mt-1">{label}</p>
      </div>
    </div>
  )
}
