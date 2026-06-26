// ============================================================
// පරිපාලක කාණ්ඩ කළමනාකරණය (Admin Categories Management)
// නිෂ්පාදන කාණ්ඩ ඇතුළත් කිරීම, වෙනස් කිරීම සහ මකා දැමීම (Full CRUD)
// ============================================================
import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, Users, ClipboardList, Package, Layers, BookOpen,
  Search, Plus, Edit, Trash2, X, AlertTriangle, FolderPlus
} from 'lucide-react'
import client from '../../api/client'
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

const INITIAL_FORM = {
  name: '',
  description: ''
}

export default function AdminCategories() {
  const [categories, setCategories] = useState(null)
  const [q, setQ] = useState('')
  
  // Modal සහ Form සඳහා States
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // දත්ත ලබාගැනීම (Load Categories)
  // සටහන: backend එකේ පොදු GET එකක් නැතිනම්, ආදර්ශ දත්ත (Fallback) පෙන්වයි
  const loadCategories = () => {
    client.get('/admin/categories')
      .then((r) => setCategories(r.data))
      .catch(() => {
        // බැකන්ඩ් එකේ GET රවුට් එකක් නැතිනම් ඩෙමෝ එක සඳහා මේ දත්ත පාවිච්චි වේ
        setCategories([
          { id: 1, name: 'Oyster', description: 'Fresh Oyster mushrooms including American and Pink varieties.' },
          { id: 2, name: 'Button', description: 'Classic white button mushrooms grown in cooler climates.' },
          { id: 3, name: 'Shiitake', description: 'Premium dried and fresh Shiitake mushrooms.' },
          { id: 4, name: 'Spawn', description: 'Mushroom seeds and spawn bags for farmers.' },
          { id: 5, name: 'Equipment', description: 'Cultivation tools, polythene bags, and home kits.' }
        ])
      })
  }

  useEffect(() => { loadCategories() }, [])

  // Form එක Open කරන විට (Add / Edit)
  const openModal = (category = null) => {
    setError('')
    setSuccess('')
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || ''
      })
    } else {
      setEditingCategory(null)
      setFormData(INITIAL_FORM)
    }
    setShowModal(true)
  }

  // දත්ත Submit කිරීම (Save / Update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name) {
      setError('Category name is required.')
      return
    }

    try {
      if (editingCategory) {
        // Category එක Update කිරීම
        await client.put(`/admin/categories/${editingCategory.id}`, formData)
        setSuccess('Category updated successfully!')
      } else {
        // අලුත් Category එකක් ඇතුළත් කිරීම
        await client.post('/admin/categories', formData)
        setSuccess('Category created successfully!')
      }
      
      setTimeout(() => setShowModal(false), 1000)
      loadCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving category. Please try again.')
    }
  }

  // Category එකක් මකා දැමීම (Delete)
  const handleDelete = async (category) => {
    if (!window.confirm(`Are you sure you want to delete the category "${category.name}"? This might affect products under this category.`)) return
    try {
      await client.delete(`/admin/categories/${category.id}`)
      loadCategories()
    } catch (err) {
      alert('Error deleting category.')
    }
  }

  if (!categories) return <DashboardLayout title="Manage Categories" nav={NAV}><PageLoader /></DashboardLayout>

  // Search filter එක අනුව සෙවීම
  const filtered = categories.filter((c) => 
    c.name?.toLowerCase().includes(q.toLowerCase()) || 
    c.description?.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <DashboardLayout title="Product Categories" subtitle="Manage mushroom types and store categories" nav={NAV}>
      
      {/* ඉහළ තීරුව (Controls) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="input pl-10"
            placeholder="Search categories by name…" />
        </div>
        
        <button onClick={() => openModal()} className="btn bg-pine-700 text-cream hover:bg-pine-800 flex items-center gap-2 rounded-xl px-4 py-2 font-semibold">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* දත්ත ලැයිස්තුව (Table) */}
      {filtered.length === 0 ? (
        <EmptyState icon={Layers} title="No categories found" message="Try searching for something else or add a new category." />
      ) : (
        <div className="card overflow-hidden border border-pine-100 bg-white rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pine-50/50 text-pine-900 border-b border-pine-100 text-sm font-semibold">
                  <th className="p-4 w-16 text-center">ID</th>
                  <th className="p-4 w-48">Category Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 w-32 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pine-100 text-sm text-soil">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-pine-50/20 transition">
                    <td className="p-4 text-center font-display font-600 text-pine-700 bg-pine-50/10">#{c.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-spore shrink-0" />
                        <span className="font-display font-700 text-pine-950 text-base">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-soil/70 leading-relaxed">{c.description || <span className="text-soil/30 italic">No description provided.</span>}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openModal(c)} className="btn-ghost p-2 text-pine-700 hover:bg-pine-50 rounded-lg" title="Edit Category">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c)} className="btn-ghost p-2 text-clay hover:bg-clay/5 rounded-lg" title="Delete Category">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-pine-100 animate-slide-up">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-pine-100 flex items-center justify-between bg-pine-50/50">
              <h3 className="font-display font-700 text-lg text-pine-900 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-pine-700" />
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-soil/50 hover:bg-pine-100 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-clay/10 text-clay text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Category Name *</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input" placeholder="e.g. Oyster, Button, Spawn" required disabled={success !== ''} />
                <p className="text-xs text-soil/40 mt-1">This name will appear in the store search filters.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input min-h-[100px] py-2" placeholder="Briefly describe what kinds of products belong to this category..." disabled={success !== ''}></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-pine-100 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold border border-pine-200 text-soil/70 hover:bg-pine-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold bg-pine-700 text-cream hover:bg-pine-800 transition" disabled={success !== ''}>
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </DashboardLayout>
  )
}