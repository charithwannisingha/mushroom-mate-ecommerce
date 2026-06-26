// ============================================================
// පරිපාලක නිෂ්පාදන කළමනාකරණය සහ අධීක්ෂණය (Admin Products Management)
// සියලුම ගොවීන්ගේ නිෂ්පාදන බැලීම, ගොවි තොරතුරු සෙවීම සහ ව්‍යාජ ලිපි ඉවත් කිරීම
// ============================================================
import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, Users, ClipboardList, Package, Layers, BookOpen,
  Search, Trash2, AlertTriangle, ShieldCheck, Tractor
} from 'lucide-react'
import client from '../../api/client'
import { lkr } from '../../api/helpers'
import { PageLoader, EmptyState } from '../../components/ui'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users & Farmers', icon: Users },
  { to: '/admin/orders', label: 'All Orders', icon: ClipboardList },
  { to: '/admin/products', label: 'Manage Products', icon: Package },   
  { to: '/admin/categories', label: 'Categories', icon: Layers },       
  { to: '/admin/knowledge', label: 'Knowledge Hub', icon: BookOpen },   
]

export default function AdminProducts() {
  const [products, setProducts] = useState(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')

  const loadProducts = () => {
    client.get('/products')
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
  }

  useEffect(() => { loadProducts() }, [])

  const handleDelete = async (product) => {
    if (!window.confirm(`⚠️ CRITICAL ACTION: Delete "${product.name}"?\nThis listing will be permanently removed from the marketplace because it is marked as FAKE.`)) return
    try {
      await client.delete(`/products/${product.id}`)
      loadProducts()
    } catch (err) {
      alert('Error deleting product.')
    }
  }

  if (!products) return <DashboardLayout title="Manage Products" nav={NAV}><PageLoader /></DashboardLayout>

  const filtered = products.filter((p) => {
    const matchQ = !q || 
      p.name?.toLowerCase().includes(q.toLowerCase()) || 
      p.description?.toLowerCase().includes(q.toLowerCase()) ||
      p.farmer_name?.toLowerCase().includes(q.toLowerCase()) || 
      p.farm_name?.toLowerCase().includes(q.toLowerCase())

    const matchF = filter === 'all' || p.category === filter
    return matchQ && matchF
  })

  const uniqueCategories = ['Oyster', 'Button', 'Shiitake', 'Spawn', 'Equipment']

  return (
    // මුළු පිටුවම පුල් සයිස් එකට ගන්න w-full එක් කර ඇත
    <div className="w-full">
      <DashboardLayout title="Global Products Monitor" subtitle="Review listings and remove fraudulent or fake products" nav={NAV}>
        
        {/* ආරක්ෂක පණිවිඩය - මුළු පළලටම දිග හැරේ */}
        <div className="p-4 mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl w-full shadow-sm">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
          <p className="text-sm">
            <b>Content Moderation Active:</b> As an administrator, you are monitoring the global inventory. You can trace each product back to its specific farmer and delete low-quality or fake posts instantly.
          </p>
        </div>

        {/* ඉහළ සෙවුම් තීරුව - Responsive Full Width */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 w-full">
          <div className="flex flex-wrap gap-3 flex-1 w-full">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} className="input pl-10 w-full"
                placeholder="Search by product, farmer name, or farm..." />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-full md:w-56 shrink-0">
              <option value="all">All categories</option>
              {uniqueCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* දත්ත පෙන්වන Table එක - දැන් w-full එකෙන් මුළු තිරයම ආවරණය කරයි */}
        {filtered.length === 0 ? (
          <EmptyState icon={Package} title="No products found" message="Try changing your search query or check back later." />
        ) : (
          <div className="card border border-pine-100 bg-white rounded-xl shadow-sm w-full overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-pine-50/50 text-pine-900 border-b border-pine-100 text-sm font-semibold">
                    <th className="p-5 w-24">Image</th>
                    <th className="p-5 min-w-[250px]">Product Name</th>
                    <th className="p-5 min-w-[180px]">Farmer Info</th>
                    <th className="p-5 w-32">Category</th>
                    <th className="p-5 text-right w-36">Price</th>
                    <th className="p-5 text-center w-36">Stock Status</th>
                    <th className="p-5 text-center w-40">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pine-100 text-sm text-soil">
                  {filtered.map((p) => {
                    const isLowStock = p.stock <= p.low_stock_at
                    return (
                      <tr key={p.id} className="hover:bg-red-50/5 transition">
                        {/* Image */}
                        <td className="p-5">
                          <img src={p.image || 'https://placehold.co/600x400?text=No+Image'} alt={p.name} 
                            className="w-14 h-14 object-cover rounded-xl border border-pine-100 shadow-sm shrink-0" />
                        </td>

                        {/* Product Details - කලින් තිබුණු හිරවීම් (max-w-xs) ඉවත් කර ඇත */}
                        <td className="p-5">
                          <p className="text-pine-950 font-semibold text-base leading-snug">{p.name}</p>
                          <p className="text-xs text-soil/60 mt-1 leading-relaxed max-w-xl">{p.description}</p>
                        </td>

                        {/* Farmer Info */}
                        <td className="p-5">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-pine-900 text-sm">{p.farmer_name || 'System Admin'}</p>
                            {p.farm_name && (
                              <p className="text-xs text-spore-600 font-medium flex items-center gap-1">
                                <Tractor className="w-3.5 h-3.5 shrink-0" /> {p.farm_name}
                              </p>
                            )}
                            <p className="text-[10px] text-soil/40 font-mono">ID: #{p.farmer_id}</p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-5">
                          <span className="badge bg-pine-100 text-pine-800 text-xs px-3 py-1 rounded-full font-medium">{p.category}</span>
                        </td>

                        {/* Price */}
                        <td className="p-5 text-right font-bold text-pine-950 text-base">
                          {lkr(p.price)} <span className="text-xs font-normal text-soil/40 block mt-0.5">/ {p.unit}</span>
                        </td>

                        {/* Stock Status */}
                        <td className="p-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={`badge px-2.5 py-1 rounded-md text-xs font-bold ${isLowStock ? 'bg-clay/10 text-clay' : 'bg-emerald-50 text-emerald-700'}`}>
                              {p.stock} {p.unit}
                            </span>
                            {isLowStock && <AlertTriangle className="w-4 h-4 text-clay shrink-0" title="Low stock warning!" />}
                          </div>
                        </td>

                        {/* Safety Action */}
                        <td className="p-5 text-center">
                          <button 
                            onClick={() => handleDelete(p)} 
                            className="btn bg-red-50 text-clay hover:bg-clay hover:text-white flex items-center justify-center gap-1.5 w-full py-2 rounded-xl font-semibold text-xs border border-red-200 transition shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove Fake
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </DashboardLayout>
    </div>
  )
}