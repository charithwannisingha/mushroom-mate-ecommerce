// ============================================================
// නිෂ්පාදන විස්තර පිටුව (Product detail)
// ============================================================
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Minus, Plus, MapPin, Phone, ArrowLeft, Check, Package } from 'lucide-react'
import client from '../api/client'
import { useCart } from '../context/CartContext'
import { lkr } from '../api/helpers'
import { PageLoader, EmptyState } from '../components/ui'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    client.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (loading) return <PageLoader />
  if (!product) return <EmptyState icon={Package} title="Product not found"
    action={<Link to="/shop" className="btn-primary mt-4">Back to marketplace</Link>} />

  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock <= product.low_stock_at

  return (
    <div className="container-x py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* රූපය (image) */}
        <div className="rounded-3xl overflow-hidden bg-cream-200 aspect-square">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* විස්තර (details) */}
        <div>
          <span className="badge bg-pine-50 text-pine-700">{product.category}</span>
          <h1 className="mt-3 font-display font-700 text-3xl md:text-4xl text-pine-700 leading-tight">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display font-700 text-3xl text-pine-700">{lkr(product.price)}</span>
            <span className="text-soil/50">/ {product.unit}</span>
          </div>

          {/* තොග තත්ත්වය (stock status) */}
          <div className="mt-3">
            {outOfStock ? (
              <span className="badge bg-rose-100 text-rose-700">Out of stock</span>
            ) : lowStock ? (
              <span className="badge bg-amber-100 text-amber-700">Only {product.stock} {product.unit} left</span>
            ) : (
              <span className="badge bg-emerald-100 text-emerald-700"><Check className="w-3.5 h-3.5" /> In stock</span>
            )}
          </div>

          <p className="mt-5 text-soil/70 leading-relaxed">{product.description}</p>

          {/* ගොවියා (farmer info) */}
          <div className="mt-6 card p-4 bg-cream-100">
            <p className="text-xs font-bold uppercase tracking-wider text-soil/40 mb-2">Sold by</p>
            <p className="font-display font-600 text-pine-700">{product.farm_name || product.farmer_name}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-soil/60">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {product.farm_city}</span>
              {product.farmer_phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {product.farmer_phone}</span>}
            </div>
          </div>

          {/* ප්‍රමාණය + කරත්තයට එක් කිරීම (qty + add to cart) */}
          {!outOfStock && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-pine-100 rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-pine-50"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-3 hover:bg-pine-50"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAdd} className={`flex-1 min-w-[200px] py-3 ${added ? 'btn-primary' : 'btn-spore'}`}>
                {added ? (<><Check className="w-5 h-5" /> Added to cart</>) : (<><ShoppingCart className="w-5 h-5" /> Add to cart — {lkr(product.price * qty)}</>)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
