// ============================================================
// මගේ ඇණවුම් (My Orders) - ඇණවුම් ලුහුබැඳීම + තත්ත්ව badges
// ============================================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ShoppingBag, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react'
import client from '../../api/client'
import { lkr, fmtDate, STATUS_STYLES } from '../../api/helpers'
import { PageLoader, EmptyState } from '../../components/ui'

// තත්ත්ව අයිකන (status icons)
const STATUS_ICON = {
  pending: Clock, confirmed: CheckCircle2, shipped: Truck,
  delivered: CheckCircle2, cancelled: XCircle,
}

export default function MyOrders() {
  const [orders, setOrders] = useState(null)
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    client.get('/orders/my').then((res) => setOrders(res.data)).catch(() => setOrders([]))
  }, [])

  if (!orders) return <PageLoader />

  if (orders.length === 0) {
    return (
      <div className="container-x py-10">
        <h1 className="font-display font-700 text-3xl text-pine-700 mb-2">My Orders</h1>
        <EmptyState icon={ShoppingBag} title="No orders yet"
          message="When you place an order, it'll show up here for tracking."
          action={<Link to="/shop" className="btn-primary mt-5 inline-flex">Start shopping</Link>} />
      </div>
    )
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display font-700 text-3xl text-pine-700 mb-1">My Orders</h1>
      <p className="text-soil/60 mb-8">{orders.length} order{orders.length !== 1 && 's'} placed</p>

      <div className="space-y-4 max-w-3xl">
        {orders.map((o) => {
          const Icon = STATUS_ICON[o.status] || Package
          const open = openId === o.id
          return (
            <div key={o.id} className="card overflow-hidden">
              <button onClick={() => setOpenId(open ? null : o.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-pine-50/40 transition">
                <div className="grid place-items-center w-11 h-11 rounded-xl bg-pine-50 shrink-0">
                  <Icon className="w-5 h-5 text-pine-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-700 text-pine-700">Order #{o.id}</span>
                    <span className={`badge capitalize ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </div>
                  <p className="text-sm text-soil/55 mt-0.5">{fmtDate(o.created_at)} · {o.payment_method}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-700 text-pine-700">{lkr(o.total)}</p>
                  <ChevronDown className={`w-4 h-4 text-soil/40 ml-auto mt-1 transition ${open ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* ඇණවුම් විස්තර (order details — expand) */}
              {open && (
                <div className="px-5 pb-5 pt-1 border-t border-pine-100 animate-fade-in">
                  <div className="space-y-2 mt-3">
                    {o.items?.map((it) => (
                      <div key={it.id} className="flex justify-between text-sm">
                        <span className="text-soil/70">{it.name} × {it.qty}</span>
                        <span className="font-medium">{lkr(it.price * it.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-pine-100 my-3" />
                  <div className="text-sm text-soil/60 space-y-1">
                    <p><span className="font-semibold text-pine-700">Deliver to:</span> {o.ship_name}, {o.ship_address}, {o.ship_city}</p>
                    <p><span className="font-semibold text-pine-700">Phone:</span> {o.ship_phone}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
