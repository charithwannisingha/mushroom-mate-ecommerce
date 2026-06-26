// ============================================================
// ගෙවීම් පිටුව (Checkout) - බෙදාහැරීම් විස්තර + ඇණවුම තැබීම
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Truck, Wallet, ArrowLeft } from 'lucide-react'
import client from '../api/client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { lkr } from '../api/helpers'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const delivery = 350

  const [form, setForm] = useState({
    ship_name: user?.name || '', ship_phone: user?.phone || '',
    ship_address: user?.address || '', ship_city: user?.city || '',
    payment_method: 'Cash on Delivery',
  })
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // ඇණවුම තැබීම (place order)
  const placeOrder = async (e) => {
    e.preventDefault()
    setPlacing(true); setError('')
    try {
      const payload = { ...form, items: items.map((i) => ({ id: i.id, qty: i.qty })) }
      const res = await client.post('/orders', payload)
      clear()
      setDone(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'ඇණවුම අසාර්ථකයි (Order failed)')
    } finally {
      setPlacing(false)
    }
  }

  // සාර්ථක තිර පිටුව (success screen)
  if (done) {
    return (
      <div className="container-x py-20">
        <div className="max-w-md mx-auto text-center card p-10">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-5">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="font-display font-700 text-2xl text-pine-700">Order placed!</h1>
          <p className="mt-2 text-soil/60">Order <b>#{done.orderId}</b> for <b>{lkr(done.total)}</b> is confirmed.
            The farmer has been notified.</p>
          <div className="mt-6 flex flex-col gap-2">
            <button onClick={() => navigate('/account/orders')} className="btn-primary">Track my orders</button>
            <button onClick={() => navigate('/shop')} className="btn-ghost">Continue shopping</button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) { navigate('/cart'); return null }

  return (
    <div className="container-x py-10">
      <button onClick={() => navigate('/cart')} className="btn-ghost mb-6 -ml-2"><ArrowLeft className="w-4 h-4" /> Back to cart</button>
      <h1 className="font-display font-700 text-3xl text-pine-700 mb-8">Checkout</h1>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-8">
        {/* බෙදාහැරීම් විස්තර (delivery form) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-display font-600 text-lg text-pine-700 mb-5">
              <Truck className="w-5 h-5 text-spore-600" /> Delivery details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">Full name</label><input required value={form.ship_name} onChange={set('ship_name')} className="input" /></div>
              <div><label className="label">Phone number</label><input required value={form.ship_phone} onChange={set('ship_phone')} className="input" placeholder="07X XXX XXXX" /></div>
              <div className="sm:col-span-2"><label className="label">Address</label><input required value={form.ship_address} onChange={set('ship_address')} className="input" placeholder="House no, street" /></div>
              <div className="sm:col-span-2"><label className="label">City / Town</label><input required value={form.ship_city} onChange={set('ship_city')} className="input" placeholder="e.g. Colombo" /></div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-display font-600 text-lg text-pine-700 mb-5">
              <Wallet className="w-5 h-5 text-spore-600" /> Payment method
            </h2>
            {['Cash on Delivery', 'Bank Transfer'].map((m) => (
              <label key={m} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer mb-2 transition
                ${form.payment_method === m ? 'border-spore bg-spore/5' : 'border-pine-100'}`}>
                <input type="radio" name="pay" checked={form.payment_method === m} onChange={() => setForm({ ...form, payment_method: m })} className="accent-spore-600" />
                <span className="font-medium text-soil/80">{m}</span>
              </label>
            ))}
            <p className="text-xs text-soil/40 mt-2">Online card payments coming soon — currently Cash on Delivery island-wide.</p>
          </div>
        </div>

        {/* සාරාංශය (summary) */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-600 text-lg text-pine-700 mb-4">Your order</h2>
            <div className="space-y-2.5 max-h-52 overflow-auto mb-4">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-soil/70 line-clamp-1 pr-2">{i.name} × {i.qty}</span>
                  <span className="font-medium shrink-0">{lkr(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-pine-100 my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-soil/70"><span>Subtotal</span><span>{lkr(total)}</span></div>
              <div className="flex justify-between text-soil/70"><span>Delivery</span><span>{lkr(delivery)}</span></div>
              <div className="flex justify-between font-display font-700 text-lg text-pine-700 pt-2"><span>Total</span><span>{lkr(total + delivery)}</span></div>
            </div>
            {error && <p className="mt-3 text-sm text-clay bg-clay/5 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={placing} className="btn-primary w-full mt-5 py-3">
              {placing ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
