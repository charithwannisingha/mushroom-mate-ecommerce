// ============================================================
// ගොවි නිෂ්පාදන කළමනාකරණය (Farmer Products) - CRUD
// එක් කිරීම / සංස්කරණය (modal) / මැකීම · තොග තත්ත්ව පෙන්වයි
// ============================================================
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Boxes, ClipboardList, Plus, Pencil, Trash2, X, AlertTriangle,
} from 'lucide-react'
import client from '../../api/client'
import { lkr, CATEGORIES } from '../../api/helpers'
import { PageLoader, EmptyState } from '../../components/ui'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/farmer/products', label: 'My Products', icon: Boxes },
  { to: '/farmer/orders', label: 'Orders', icon: ClipboardList },
]

const BLANK = {
  name: '', 
  category: 'Oyster', 
  description: '', 
  price: '', 
  unit: 'kg',
  stock: '', 
  low_stock_at: 10,
  image: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=800&q=80',
}

export default function FarmerProducts() {
  const [products, setProducts] = useState(null)
  const [modal, setModal] = useState(null)   // null | 'new' | product object
  const [form, setForm] = useState(BLANK)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  // නිෂ්පාදන ලැයිස්තුව ලබාගැනීම (load products)
  const load = () => {
    client.get('/products/my/list')
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
  }

  useEffect(() => { load() }, [])

  // modal විවෘත කිරීම (open for new / edit)
  const openNew = () => { setForm(BLANK); setErr(''); setModal('new') }
  const openEdit = (p) => { setForm({ ...p }); setErr(''); setModal(p) }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // සුරැකීම (save — create or update)
  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const payload = {
        ...form,
        price: Number(form.price), 
        stock: Number(form.stock),
        low_stock_at: Number(form.low_stock_at), 
        is_active: 1,
      }
      if (modal === 'new') {
        await client.post('/products', payload)
      } else {
        await client.put(`/products/${modal.id}`, payload)
      }
      setModal(null)
      load()
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  // මැකීම (delete with confirmation)
  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    try {
      await client.delete(`/products/${p.id}`)
      load()
    } catch (error) {
      alert('Failed to delete the product.')
    }
  }

  return (
    <DashboardLayout title="My Products" subtitle="Manage your listings and stock" nav={NAV}>
      <div className="flex justify-end mb-5">
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      {!products ? <PageLoader /> : products.length === 0 ? (
        <EmptyState 
          icon={Boxes} 
          title="No products yet"
          message="Add your first mushroom product to start selling."
          action={
            <button onClick={openNew} className="btn-primary mt-5 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add product
            </button>
          } 
        />
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop වගුව (table) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-pine-50 text-pine-700">
                <tr className="text-left">
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pine-100">
                {products.map((p) => {
                  const low = p.stock <= p.low_stock_at
                  return (
                    <tr key={p.id} className="hover:bg-pine-50/40 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image || BLANK.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-pine-100" />
                          <span className="font-semibold text-pine-700">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-soil/60">{p.category}</td>
                      <td className="px-5 py-3 font-medium">{lkr(p.price)}<span className="text-soil/40">/{p.unit}</span></td>
                      <td className="px-5 py-3">
                        <span className={`badge flex items-center gap-1 w-max ${low ? 'bg-clay/10 text-clay font-bold' : 'bg-emerald-100 text-emerald-700'}`}>
                          {low && <AlertTriangle className="w-3 h-3" />} {p.stock} {p.unit}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="btn-ghost p-2" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => remove(p)} className="btn-ghost p-2 text-clay hover:bg-clay/5" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile කාඩ්පත් (cards) */}
          <div className="md:hidden divide-y divide-pine-100">
            {products.map((p) => {
              const low = p.stock <= p.low_stock_at
              return (
                <div key={p.id} className="p-4 flex gap-3 items-center">
                  <img src={p.image || BLANK.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 border border-pine-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-pine-700 truncate">{p.name}</p>
                    <p className="text-sm text-soil/60">{lkr(p.price)}/{p.unit}</p>
                    <span className={`badge mt-1 inline-flex items-center gap-1 ${low ? 'bg-clay/10 text-clay font-bold' : 'bg-emerald-100 text-emerald-700'}`}>
                      {low && <AlertTriangle className="w-3.5 h-3.5" />} {p.stock} {p.unit} in stock
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => openEdit(p)} className="btn-ghost p-2" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(p)} className="btn-ghost p-2 text-clay" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* එක් කිරීම / සංස්කරණ modal (add / edit modal) */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="fixed inset-0 bg-soil/40 backdrop-blur-sm animate-fade-in" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border border-pine-100 animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-pine-100 sticky top-0 bg-white z-10">
              <h2 className="font-display font-700 text-xl text-pine-700">
                {modal === 'new' ? 'Add product' : 'Edit product'}
              </h2>
              <button onClick={() => setModal(null)} className="btn-ghost p-2 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={save} className="p-5 space-y-4">
              <div>
                <label className="label block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Product name</label>
                <input required value={form.name} onChange={set('name')} className="input" placeholder="e.g. Fresh Oyster Mushrooms" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Category</label>
                  <select value={form.category} onChange={set('category')} className="input">
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Unit</label>
                  <select value={form.unit} onChange={set('unit')} className="input">
                    {['kg', 'g', '500g pack', 'packet', 'bottle', 'unit'].map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Price (Rs.)</label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={set('price')} className="input" placeholder="0.00" />
                </div>
                <div>
                  <label className="label block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Stock</label>
                  <input required type="number" min="0" value={form.stock} onChange={set('stock')} className="input" placeholder="0" />
                </div>
                <div>
                  <label className="label block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Low at</label>
                  <input type="number" min="0" value={form.low_stock_at} onChange={set('low_stock_at')} className="input" placeholder="10" />
                </div>
              </div>
              
              <div>
                <label className="label block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Image URL</label>
                <input value={form.image} onChange={set('image')} className="input" placeholder="https://images.unsplash.com/..." />
              </div>
              
              <div>
                <label className="label block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={3} className="input resize-none py-2" placeholder="Describe your product freshness, harvesting details etc..." />
              </div>
              
              {err && <p className="text-sm text-clay bg-clay/5 rounded-lg px-3 py-2 font-semibold">{err}</p>}
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm font-semibold border border-pine-200 text-soil/70 hover:bg-pine-50 flex-1 transition">Cancel</button>
                <button type="submit" disabled={busy} className="px-4 py-2 rounded-xl text-sm font-semibold bg-pine-700 text-cream hover:bg-pine-800 flex-1 transition">
                  {busy ? 'Saving…' : 'Save product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}