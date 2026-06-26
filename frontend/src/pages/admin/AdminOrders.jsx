// ============================================================
// පරිපාලක සියලු ඇණවුම් (Admin Orders)
// පද්ධතියේ සියලු ඇණවුම් + තත්ත්ව කළමනාකරණය
// ============================================================
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Users, ClipboardList, Search, Package, BookOpen, Layers
} from 'lucide-react'
import client from '../../api/client'
import { lkr, fmtDate, STATUS_STYLES } from '../../api/helpers'
import { PageLoader, EmptyState } from '../../components/ui'
import DashboardLayout from '../../components/DashboardLayout'

// --- අලුත් ලින්ක්ස් මෙතනට එකතු කළා ---
const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users & Farmers', icon: Users },
  { to: '/admin/orders', label: 'All Orders', icon: ClipboardList },
  { to: '/admin/products', label: 'Manage Products', icon: Package },   
  { to: '/admin/categories', label: 'Categories', icon: Layers },       
  { to: '/admin/knowledge', label: 'Knowledge Hub', icon: BookOpen },   
]

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')

  const load = () => client.get('/orders').then((r) => setOrders(r.data)).catch(() => setOrders([]))
  useEffect(() => { load() }, [])

  // තත්ත්වය යාවත්කාලීන කිරීම
  const updateStatus = async (id, status) => {
    await client.put(`/orders/${id}/status`, { status })
    load()
  }

  if (!orders) return <DashboardLayout title="All Orders" nav={NAV}><PageLoader /></DashboardLayout>

  // සෙවුම + තත්ත්ව පෙරහන (search + status filter)
  const filtered = orders.filter((o) => {
    const matchQ = !q || o.customer_name?.toLowerCase().includes(q.toLowerCase()) ||
      String(o.id).includes(q) || o.ship_city?.toLowerCase().includes(q.toLowerCase())
    const matchF = filter === 'all' || o.status === filter
    return matchQ && matchF
  })

  return (
    <DashboardLayout title="All Orders" subtitle={`${orders.length} total order${orders.length !== 1 ? 's' : ''} system-wide`} nav={NAV}>
      {/* සෙවුම + පෙරහන (controls) */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="input pl-10"
            placeholder="Search by customer, order #, or city…" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-44">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No orders found" message="Try adjusting your search or filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="card p-5 flex flex-wrap items-center gap-4">
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-pine-50 shrink-0">
                <Package className="w-5 h-5 text-pine-700" />
              </div>
              <div className="flex-1 min-w-[180px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-700 text-pine-700">Order #{o.id}</p>
                  <span className={`badge capitalize ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-sm text-soil/55 mt-0.5">{o.customer_name} · {o.ship_city} · {fmtDate(o.created_at)}</p>
              </div>
              <p className="font-display font-700 text-pine-700 shrink-0">{lkr(o.total)}</p>
              <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                className="input py-1.5 text-sm w-36 shrink-0">
                {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}