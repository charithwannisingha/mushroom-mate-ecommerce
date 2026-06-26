// ============================================================
// පරිපාලක දැනුම් මධ්‍යස්ථානය (Admin Knowledge Hub Management)
// ලිපි සහ ලෙඩ රෝග තොරතුරු ඇතුළත් කිරීම, වෙනස් කිරීම සහ මැකීම (Full CRUD)
// ============================================================
import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, Users, ClipboardList, Package, Layers, BookOpen,
  Search, Plus, Edit, Trash2, X, AlertTriangle, FileText, CheckCircle
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
  type: 'guide',
  title: '',
  summary: '',
  body: '',
  symptoms: '',
  treatment: '',
  image: ''
}

export default function AdminKnowledge() {
  const [posts, setPosts] = useState(null)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all') // 'all', 'guide', 'disease'

  // Modal සහ Form සඳහා States
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // දත්ත ලබාගැනීම (Load Knowledge Posts)
  const loadPosts = () => {
    client.get('/knowledge')
      .then((r) => setPosts(r.data))
      .catch(() => {
        // Backend එක සම්බන්ධ නැතිනම් ප්‍රදර්ශනය සඳහා Fallback Data
        setPosts([
          { id: 1, type: 'guide', title: 'Getting Started with Oyster Mushroom Cultivation', summary: 'A beginner friendly guide to growing oyster mushrooms in Sri Lankan home conditions.', body: 'Oyster mushrooms are easy to grow...' },
          { id: 2, type: 'disease', title: 'Green Mould (Trichoderma)', summary: 'The most common contamination in Sri Lankan mushroom farms.', symptoms: 'Green powdery patches on substrate.', treatment: 'Immediately remove and burn affected bags.' }
        ])
      })
  }

  useEffect(() => { loadPosts() }, [])

  // Form එක Open කරන විට (Add / Edit)
  const openModal = (post = null) => {
    setError('')
    setSuccess('')
    if (post) {
      setEditingPost(post)
      setFormData({
        type: post.type,
        title: post.title,
        summary: post.summary || '',
        body: post.body || '',
        symptoms: post.symptoms || '',
        treatment: post.treatment || '',
        image: post.image || ''
      })
    } else {
      setEditingPost(null)
      setFormData(INITIAL_FORM)
    }
    setShowModal(true)
  }

  // දත්ත සේව් කිරීම (Save / Update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.title || !formData.summary) {
      setError('Title and Summary are required fields.')
      return
    }

    try {
      if (editingPost) {
        // ලිපිය Update කිරීම
        await client.put(`/knowledge/${editingPost.id}`, formData)
        setSuccess('Article updated successfully!')
      } else {
        // අලුත් ලිපියක් ඇතුළත් කිරීම
        await client.post('/knowledge', formData)
        setSuccess('Article published successfully!')
      }

      setTimeout(() => setShowModal(false), 1000)
      loadPosts()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving article. Please try again.')
    }
  }

  // ලිපියක් මකා දැමීම (Delete)
  const handleDelete = async (post) => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) return
    try {
      await client.delete(`/knowledge/${post.id}`)
      loadPosts()
    } catch (err) {
      alert('Error deleting article.')
    }
  }

  if (!posts) return <DashboardLayout title="Knowledge Hub" nav={NAV}><PageLoader /></DashboardLayout>

  // Search සහ Tab Category අනුව පෙරීම
  const filtered = posts.filter((p) => {
    const matchQ = !q || p.title?.toLowerCase().includes(q.toLowerCase()) || p.summary?.toLowerCase().includes(q.toLowerCase())
    const matchT = tab === 'all' || p.type === tab
    return matchQ && matchT
  })

  return (
    <DashboardLayout title="Knowledge Hub Manager" subtitle="Publish cultivation guides and disease solutions" nav={NAV}>
      
      {/* Tab Filters + Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 bg-pine-50/50 p-1 rounded-xl border border-pine-100">
          <button onClick={() => setTab('all')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${tab === 'all' ? 'bg-pine-700 text-cream shadow-sm' : 'text-soil/70 hover:bg-pine-100'}`}>All Posts</button>
          <button onClick={() => setTab('guide')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${tab === 'guide' ? 'bg-pine-700 text-cream shadow-sm' : 'text-soil/70 hover:bg-pine-100'}`}>Guides</button>
          <button onClick={() => setTab('disease')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${tab === 'disease' ? 'bg-pine-700 text-cream shadow-sm' : 'text-soil/70 hover:bg-pine-100'}`}>Diseases</button>
        </div>

        <div className="flex flex-wrap gap-3 flex-1 max-w-xl justify-end">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input pl-10"
              placeholder="Search articles by title or keywords…" />
          </div>
          <button onClick={() => openModal()} className="btn bg-pine-700 text-cream hover:bg-pine-800 flex items-center gap-2 rounded-xl px-4 py-2 font-semibold shrink-0">
            <Plus className="w-4 h-4" /> Add Article
          </button>
        </div>
      </div>

      {/* Articles Table Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No articles found" message="Try changing your search keywords or write a new article." />
      ) : (
        <div className="card overflow-hidden border border-pine-100 bg-white rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pine-50/50 text-pine-900 border-b border-pine-100 text-sm font-semibold">
                  <th className="p-4 w-24">Type</th>
                  <th className="p-4">Title & Summary</th>
                  <th className="p-4 w-32 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pine-100 text-sm text-soil">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-pine-50/20 transition">
                    <td className="p-4 vertical-top">
                      <span className={`badge uppercase tracking-wider text-[10px] px-2 py-0.5 font-bold rounded-md ${p.type === 'disease' ? 'bg-clay/15 text-clay' : 'bg-emerald-100 text-emerald-800'}`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <h4 className="font-display font-700 text-pine-950 text-base mb-0.5">{p.title}</h4>
                      <p className="text-soil/60 text-xs leading-relaxed max-w-2xl">{p.summary}</p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openModal(p)} className="btn-ghost p-2 text-pine-700 hover:bg-pine-50 rounded-lg" title="Edit Article">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p)} className="btn-ghost p-2 text-clay hover:bg-clay/5 rounded-lg" title="Delete Article">
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

      {/* Add / Edit Article Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden border border-pine-100 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-pine-100 flex items-center justify-between bg-pine-50/50">
              <h3 className="font-display font-700 text-lg text-pine-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pine-700" />
                {editingPost ? 'Edit Knowledge Base Post' : 'Publish New Knowledge Article'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-soil/50 hover:bg-pine-100 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {error && (
                <div className="p-3 rounded-xl bg-clay/10 text-clay text-sm font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {error}</div>
              )}
              {success && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {success}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Article Type *</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="input" disabled={success !== ''}>
                    <option value="guide">Cultivation Guide</option>
                    <option value="disease">Mushroom Disease / Contamination</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Cover Image URL</label>
                  <input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="input" placeholder="https://unsplash.com/... (Image URL)" disabled={success !== ''} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Article Title *</label>
                <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input" placeholder="e.g. Getting Started with Oyster Mushrooms" required disabled={success !== ''} />
              </div>

              <div>
                <label className="block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Short Summary *</label>
                <input value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} className="input" placeholder="Write a catchy 1-line summary for preview cards..." required disabled={success !== ''} />
              </div>

              {/* වගා මාර්ගෝපදේශ සඳහා පමණක් පෙන්වන Main Body Area */}
              {formData.type === 'guide' && (
                <div>
                  <label className="block text-xs font-bold text-pine-900 uppercase tracking-wider mb-1">Guide Instructions / Body Text</label>
                  <textarea value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})} className="input min-h-[160px] py-2 leading-relaxed" placeholder="Write the complete cultivation steps here..." disabled={success !== ''}></textarea>
                </div>
              )}

              {/* ලෙඩ රෝග (Disease) තෝරාගත් විට පමණක් පෙන්වන විශේෂ Fields */}
              {formData.type === 'disease' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-clay uppercase tracking-wider mb-1">Disease Symptoms *</label>
                    <textarea value={formData.symptoms} onChange={(e) => setFormData({...formData, symptoms: e.target.value})} className="input min-h-[120px] py-2 border-clay/30 focus:border-clay" placeholder="Describe what the contamination looks like (e.g. green patches, brown spots)..." disabled={success !== ''}></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Treatment & Solution *</label>
                    <textarea value={formData.treatment} onChange={(e) => setFormData({...formData, treatment: e.target.value})} className="input min-h-[120px] py-2 border-emerald-200 focus:border-emerald-600" placeholder="Step-by-step cure or prevention methods (e.g. spray bleach, adjust humidity)..." disabled={success !== ''}></textarea>
                  </div>
                </div>
              )}

              {/* Form Actions Buttons */}
              <div className="pt-4 border-t border-pine-100 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-semibold border border-pine-200 text-soil/70 hover:bg-pine-50 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold bg-pine-700 text-cream hover:bg-pine-800 transition" disabled={success !== ''}>
                  {editingPost ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </DashboardLayout>
  )
}