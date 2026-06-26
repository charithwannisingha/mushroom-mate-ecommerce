// ============================================================
// ගොවි උපකරණ පුවරුව (Farmer Dashboard)
// සංඛ්‍යාලේඛන + අඩු තොග අනතුරු ඇඟවීම් + විකුණුම් ප්‍රස්තාර (recharts)
// ============================================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, TrendingUp, ShoppingCart, AlertTriangle, Boxes,
  LayoutDashboard, ClipboardList, Plus, BadgeCheck, ShieldAlert,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import client from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { lkr } from '../../api/helpers'
import { StatCard, PageLoader } from '../../components/ui'
import DashboardLayout from '../../components/DashboardLayout'

// පැති තීරු සබැඳි (sidebar nav)
const NAV = [
  { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/farmer/products', label: 'My Products', icon: Boxes },
  { to: '/farmer/orders', label: 'Orders', icon: ClipboardList },
]

export default function FarmerDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [lowStock, setLowStock] = useState([])
  const [report, setReport] = useState(null)

  useEffect(() => {
    // සියලු දත්ත එකවර ලබාගනී (parallel fetch)
    Promise.all([
      client.get('/products/my/list'),
      client.get('/products/alerts/low'),
      client.get('/admin/reports/farmer'),
      client.get('/orders/farmer'),
    ]).then(([prods, low, rep, orders]) => {
      setData({ products: prods.data, orders: orders.data })
      setLowStock(low.data)
      setReport(rep.data)
    }).catch(() => setData({ products: [], orders: [] }))
  }, [])

  if (!data || !report) {
    return <DashboardLayout title="Dashboard" nav={NAV}><PageLoader /></DashboardLayout>
  }

  // මාසික ප්‍රස්තාරය සඳහා දත්ත සැකසීම (chart data — readable month labels)
  const chartData = (report.monthly || []).map((m) => ({
    month: new Date(m.month + '-01').toLocaleDateString('en', { month: 'short' }),
    revenue: Number(m.revenue),
  }))

  return (
    <DashboardLayout title={`Welcome, ${user?.name?.split(' ')[0]}`}
      subtitle={user?.farm_name} nav={NAV}>

      {/* verify තත්ත්ව තීරුව (verification banner) */}
      <div className={`card p-4 mb-6 flex items-center gap-3 ${user?.is_verified ? 'bg-emerald-50/60' : 'bg-amber-50/60'}`}>
        {user?.is_verified
          ? <><BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-800">Your farm is <b>verified</b>. Products are live on the marketplace.</p></>
          : <><ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">Your account is <b>pending admin verification</b>. You can add products now; they'll go live once verified.</p></>}
      </div>

      {/* සංඛ්‍යාලේඛන කාඩ්පත් (stat cards) */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={TrendingUp} label="Total revenue" value={lkr(report.summary.revenue)} accent="spore" />
        <StatCard icon={ShoppingCart} label="Orders received" value={report.summary.orders} accent="pine" />
        <StatCard icon={Boxes} label="Units sold" value={report.summary.units} accent="blue" />
        <StatCard icon={Package} label="Active products" value={data.products.length} accent="clay" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* විකුණුම් ප්‍රස්තාරය (sales chart) */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-display font-600 text-lg text-pine-700 mb-4">Sales overview</h2>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a7d129" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#a7d129" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b6354' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b6354' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
                <Tooltip formatter={(v) => lkr(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e7e2d6' }} />
                <Area type="monotone" dataKey="revenue" stroke="#1f3d2b" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] grid place-items-center text-soil/40 text-sm">No sales data yet</div>
          )}
        </div>

        {/* අඩු තොග අනතුරු ඇඟවීම් (low-stock alerts — FR-2) */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display font-600 text-lg text-pine-700 mb-4">
            <AlertTriangle className="w-5 h-5 text-clay" /> Low stock
          </h2>
          {lowStock.length ? (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-pine-700 truncate">{p.name}</p>
                    <p className="text-xs text-soil/50">{p.category}</p>
                  </div>
                  <span className="badge bg-clay/10 text-clay shrink-0">{p.stock} {p.unit} left</span>
                </div>
              ))}
              <Link to="/farmer/products" className="btn-outline w-full mt-2 text-sm">Restock now</Link>
            </div>
          ) : (
            <p className="text-sm text-soil/50 py-6 text-center">All products well stocked 🌱</p>
          )}
        </div>
      </div>

      {/* වැඩිම අලෙවි නිෂ්පාදන (top products) */}
      {report.topProducts?.length > 0 && (
        <div className="card p-6 mt-6">
          <h2 className="font-display font-600 text-lg text-pine-700 mb-4">Top selling products</h2>
          <div className="space-y-3">
            {report.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="grid place-items-center w-7 h-7 rounded-lg bg-pine-50 text-pine-700 text-sm font-bold shrink-0">{i + 1}</span>
                <p className="flex-1 text-sm font-medium text-soil/80 truncate">{p.name}</p>
                <span className="text-sm text-soil/50">{p.sold} sold</span>
                <span className="text-sm font-display font-700 text-pine-700 w-24 text-right">{lkr(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ඉක්මන් ක්‍රියා (quick action) */}
      <Link to="/farmer/products" className="btn-spore mt-6 inline-flex">
        <Plus className="w-4 h-4" /> Add a new product
      </Link>
    </DashboardLayout>
  )
}
