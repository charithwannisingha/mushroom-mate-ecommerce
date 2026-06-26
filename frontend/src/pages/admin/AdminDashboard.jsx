// ============================================================
// පරිපාලක උපකරණ පුවරුව (Admin Dashboard)
// පද්ධති සංඛ්‍යාලේඛන + විකුණුම් වාර්තා ප්‍රස්තාර (FR-7, recharts)
// ============================================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Tractor, ShoppingBag, Package, TrendingUp, ClipboardList,
  LayoutDashboard, UserCheck, ShieldAlert, Printer, BookOpen, Layers
} from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import client from '../../api/client'
import { lkr } from '../../api/helpers'
import { StatCard, PageLoader } from '../../components/ui'
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

// ප්‍රස්තාර වර්ණ (chart palette — earthy tones)
const PIE_COLORS = ['#1f3d2b', '#a7d129', '#c4622d', '#4a7c59', '#d4a017']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [report, setReport] = useState(null)

  useEffect(() => {
    Promise.all([
      client.get('/admin/stats'),
      client.get('/admin/reports/sales'),
    ]).then(([s, r]) => { setStats(s.data); setReport(r.data) })
      .catch(() => { setStats({}); setReport({ monthly: [], byCategory: [], topProducts: [] }) })
  }, [])

  if (!stats || !report) {
    return <DashboardLayout title="Dashboard" nav={NAV}><PageLoader /></DashboardLayout>
  }

  // මාසික ප්‍රස්තාර දත්ත (monthly chart data)
  const monthly = (report.monthly || []).map((m) => ({
    month: new Date(m.month + '-01').toLocaleDateString('en', { month: 'short' }),
    revenue: Number(m.revenue), orders: Number(m.orders),
  }))
  const byCategory = (report.byCategory || []).map((c) => ({ name: c.category, value: Number(c.revenue) }))

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="System-wide overview & reports" nav={NAV}>
      {/* පොරොත්තු ගොවියන් අවවාදය (pending farmers alert) */}
      {stats.pendingFarmers > 0 && (
        <Link to="/admin/users" className="card p-4 mb-6 flex items-center gap-3 bg-amber-50/60 hover:bg-amber-50 transition">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <b>{stats.pendingFarmers}</b> farmer{stats.pendingFarmers !== 1 ? 's' : ''} awaiting verification — review now.
          </p>
        </Link>
      )}

      {/* සංඛ්‍යාලේඛන (stat cards) */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={TrendingUp} label="Total revenue" value={lkr(stats.revenue)} accent="spore" />
        <StatCard icon={ShoppingBag} label="Total orders" value={stats.orders} accent="pine" />
        <StatCard icon={Users} label="Customers" value={stats.customers} accent="blue" />
        <StatCard icon={Tractor} label="Farmers" value={stats.farmers} accent="clay" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* මාසික විකුණුම් තීරු ප්‍රස්තාරය (monthly bar chart) */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-600 text-lg text-pine-700">Monthly revenue</h2>
            <button onClick={() => window.print()} className="btn-ghost text-sm"><Printer className="w-4 h-4" /> Print</button>
          </div>
          {monthly.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthly} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b6354' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b6354' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
                <Tooltip formatter={(v) => lkr(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e7e2d6' }} cursor={{ fill: '#f0ece1' }} />
                <Bar dataKey="revenue" fill="#1f3d2b" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[260px] grid place-items-center text-soil/40 text-sm">No sales data yet</div>}
        </div>

        {/* කාණ්ඩ අනුව විකුණුම් (category pie) */}
        <div className="card p-6">
          <h2 className="font-display font-600 text-lg text-pine-700 mb-4">By category</h2>
          {byCategory.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={75} innerRadius={45}>
                  {byCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => lkr(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e7e2d6' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-[260px] grid place-items-center text-soil/40 text-sm">No data yet</div>}
        </div>
      </div>

      {/* ද්විතීය සංඛ්‍යාලේඛන + වැඩිම අලෙවි (secondary stats + top products) */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <StatCard icon={Package} label="Products listed" value={stats.products} accent="pine" />
          <StatCard icon={UserCheck} label="Pending verifications" value={stats.pendingFarmers} accent="clay" />
        </div>
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-display font-600 text-lg text-pine-700 mb-4">Top selling products</h2>
          {report.topProducts?.length ? (
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
          ) : <p className="text-sm text-soil/40 py-6 text-center">No sales data yet</p>}
        </div>
      </div>
    </DashboardLayout>
  )
}