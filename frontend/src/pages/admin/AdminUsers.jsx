// ============================================================
// පරිපාලක පරිශීලක කළමනාකරණය (Admin Users)
// ගොවියන් verify/unverify + පරිශීලකයන් මැකීම
// ============================================================
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Users, ClipboardList, BadgeCheck, ShieldAlert,
  Trash2, Mail, Phone, MapPin, Tractor, Package, Layers, BookOpen
} from 'lucide-react'
import client from '../../api/client'
import { fmtDate } from '../../api/helpers'
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

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'farmer', label: 'Farmers' },
  { key: 'customer', label: 'Customers' },
]

// භූමිකා වර්ණ (role badge styles)
const ROLE_STYLE = {
  admin: 'bg-pine-700 text-cream',
  farmer: 'bg-spore/15 text-spore-600',
  customer: 'bg-blue-50 text-blue-600',
}

export default function AdminUsers() {
  const [users, setUsers] = useState(null)
  const [tab, setTab] = useState('all')

  const load = (role = 'all') =>
    client.get(`/admin/users${role !== 'all' ? `?role=${role}` : ''}`)
      .then((r) => setUsers(r.data)).catch(() => setUsers([]))

  useEffect(() => { load(tab) }, [tab])

  // ගොවියෙකු verify / unverify කිරීම
  const toggleVerify = async (u) => {
    await client.put(`/admin/verify/${u.id}`, { verified: u.is_verified ? 0 : 1 })
    load(tab)
  }

  // පරිශීලකයෙකු මැකීම (delete with confirmation)
  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name} (${u.email})? This cannot be undone.`)) return
    await client.delete(`/admin/users/${u.id}`)
    load(tab)
  }

  return (
    <DashboardLayout title="Users & Farmers" subtitle="Verify farmers and manage accounts" nav={NAV}>
      {/* ටැබ් (filter tabs) */}
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => { setUsers(null); setTab(t.key) }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition
              ${tab === t.key ? 'bg-pine-700 text-cream' : 'bg-white border border-pine-100 text-soil/70 hover:bg-pine-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {!users ? <PageLoader /> : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" message="No accounts match this filter." />
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="card p-5 flex flex-wrap items-center gap-4">
              <div className="grid place-items-center w-12 h-12 rounded-full bg-pine-700 text-cream font-display font-700 shrink-0">
                {u.name?.[0]?.toUpperCase()}
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-700 text-pine-700">{u.name}</p>
                  <span className={`badge capitalize ${ROLE_STYLE[u.role]}`}>{u.role}</span>
                  {/* ගොවි verify තත්ත්වය */}
                  {u.role === 'farmer' && (
                    <span className={`badge ${u.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {u.is_verified ? <BadgeCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      {u.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-soil/55">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {u.email}</span>
                  {u.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {u.phone}</span>}
                  {u.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {u.city}</span>}
                  {u.farm_name && <span className="flex items-center gap-1"><Tractor className="w-3.5 h-3.5" /> {u.farm_name}</span>}
                </div>
                <p className="text-xs text-soil/40 mt-1">Joined {fmtDate(u.created_at)}</p>
              </div>

              {/* ක්‍රියා (actions) */}
              <div className="flex items-center gap-2 shrink-0">
                {u.role === 'farmer' && (
                  <button onClick={() => toggleVerify(u)}
                    className={u.is_verified ? 'btn-outline text-sm' : 'btn-spore text-sm'}>
                    {u.is_verified ? 'Unverify' : <><BadgeCheck className="w-4 h-4" /> Verify</>}
                  </button>
                )}
                {u.role !== 'admin' && (
                  <button onClick={() => remove(u)} className="btn-ghost p-2.5 text-clay hover:bg-clay/5" aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}