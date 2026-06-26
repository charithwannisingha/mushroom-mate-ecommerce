// ============================================================
// ගොවියාට ලැබුණු ඇණවුම් (Farmer Orders)
// පැමිණෙන ඇණවුම් + තත්ත්වය යාවත්කාලීන කිරීම (FR-4)
// ============================================================
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Boxes, ClipboardList, MapPin, Phone, Package,
} from 'lucide-react'
import client from '../../api/client'
import { lkr, fmtDate, STATUS_STYLES } from '../../api/helpers'
import { PageLoader, EmptyState } from '../../components/ui'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/farmer/products', label: 'My Products', icon: Boxes },
  { to: '/farmer/orders', label: 'Orders', icon: ClipboardList },
]

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function FarmerOrders() {
  const [orders, setOrders] = useState(null)

  const load = () => client.get('/orders/farmer').then((r) => setOrders(r.data)).catch(() => setOrders([]))
  useEffect(() => { load() }, [])

  // ඇණවුම් තත්ත්වය වෙනස් කිරීම (update status)
  const updateStatus = async (orderId, status) => {
    await client.put(`/orders/${orderId}/status`, { status })
    load()
  }

  if (!orders) return <DashboardLayout title="Orders" nav={NAV}><PageLoader /></DashboardLayout>

  return (
    <DashboardLayout title="Incoming Orders" subtitle={`${orders.length} order item${orders.length !== 1 ? 's' : ''} for your products`} nav={NAV}>
      {orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders yet"
          message="Orders for your products will appear here as customers buy them." />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="grid place-items-center w-11 h-11 rounded-xl bg-pine-50 shrink-0">
                    <Package className="w-5 h-5 text-pine-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-700 text-pine-700">{o.name} × {o.qty}</p>
                    <p className="text-sm text-soil/55">Order #{o.order_id} · {fmtDate(o.created_at)}</p>
                    <p className="text-sm font-medium text-pine-700 mt-0.5">{lkr(o.price * o.qty)}</p>
                  </div>
                </div>

                {/* තත්ත්ව තේරීම (status selector) */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`badge capitalize ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  <select value={o.status} onChange={(e) => updateStatus(o.order_id, e.target.value)}
                    className="input py-1.5 text-sm w-40">
                    {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>

              {/* බෙදාහැරීම් විස්තර (delivery info) */}
              <div className="mt-4 pt-4 border-t border-pine-100 flex flex-wrap gap-x-6 gap-y-1 text-sm text-soil/60">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-soil/40" /> {o.ship_name}, {o.ship_city}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-soil/40" /> {o.ship_phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
