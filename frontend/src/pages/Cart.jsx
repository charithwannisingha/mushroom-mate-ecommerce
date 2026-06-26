// ============================================================
// කරත්ත පිටුව (Shopping Cart)
// ============================================================
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { lkr } from '../api/helpers'
import { EmptyState } from '../components/ui'

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const delivery = items.length ? 350 : 0   // නියමිත බෙදාහැරීම් ගාස්තුව (flat delivery fee)

  // checkout වෙත යාම - පිවිසී නැත්නම් login වෙත යවයි
  const goCheckout = () => {
    if (!user) return navigate('/login', { state: { from: '/checkout' } })
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-10">
        <EmptyState icon={ShoppingBag} title="Your cart is empty"
          message="Browse the marketplace to add fresh mushrooms and supplies."
          action={<Link to="/shop" className="btn-primary mt-5">Start shopping</Link>} />
      </div>
    )
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display font-700 text-3xl text-pine-700 mb-8">Your cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* අයිතම ලැයිස්තුව (item list) */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="font-display font-600 text-pine-700 hover:text-spore-600 line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sm text-soil/50">{lkr(item.price)} / {item.unit}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center border border-pine-100 rounded-lg">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1.5 hover:bg-pine-50"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="w-9 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, Math.min(item.stock, item.qty + 1))} className="p-1.5 hover:bg-pine-50"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-clay/70 hover:text-clay p-1.5" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="font-display font-700 text-pine-700">{lkr(item.price * item.qty)}</p>
            </div>
          ))}
        </div>

        {/* සාරාංශය (order summary) */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-600 text-lg text-pine-700 mb-4">Order summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-soil/70"><span>Subtotal</span><span>{lkr(total)}</span></div>
              <div className="flex justify-between text-soil/70"><span>Delivery</span><span>{lkr(delivery)}</span></div>
              <div className="h-px bg-pine-100 my-2" />
              <div className="flex justify-between font-display font-700 text-lg text-pine-700">
                <span>Total</span><span>{lkr(total + delivery)}</span>
              </div>
            </div>
            <button onClick={goCheckout} className="btn-primary w-full mt-6 py-3">
              Proceed to checkout <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/shop" className="block text-center text-sm text-pine-700 font-semibold mt-3 hover:underline">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
