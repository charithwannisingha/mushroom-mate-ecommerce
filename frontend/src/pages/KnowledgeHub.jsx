// ============================================================
// දැනුම් මධ්‍යස්ථානය (Knowledge Hub) - මාර්ගෝපදේශ + රෝග
// ============================================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, BookOpen, Stethoscope, ArrowRight, Sprout } from 'lucide-react'
import client from '../api/client'
import { PageLoader, EmptyState } from '../components/ui'

export default function KnowledgeHub() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (type !== 'all') params.set('type', type)
    if (search) params.set('search', search)
    const t = setTimeout(() => {
      client.get(`/knowledge?${params}`)
        .then((res) => setArticles(res.data))
        .catch(() => setArticles([]))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(t)
  }, [type, search])

  const tabs = [
    { key: 'all', label: 'All', icon: Sprout },
    { key: 'guide', label: 'Cultivation Guides', icon: BookOpen },
    { key: 'disease', label: 'Disease Diagnostics', icon: Stethoscope },
  ]

  return (
    <div>
      {/* ශීර්ෂ බැනරය (header banner) */}
      <div className="bg-pine-700 text-cream">
        <div className="container-x py-14">
          <span className="badge bg-spore/20 text-spore-400 mb-3"><BookOpen className="w-3.5 h-3.5" /> Knowledge Hub</span>
          <h1 className="font-display font-700 text-3xl md:text-4xl">Grow smarter, harvest more</h1>
          <p className="mt-3 text-cream/70 max-w-xl">Cultivation guides and a disease diagnostics library, tuned for
            Sri Lankan growing conditions.</p>
          <div className="relative max-w-md mt-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-pine-700/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a disease, symptom or technique…"
              className="w-full rounded-xl bg-cream text-soil pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-spore" />
          </div>
        </div>
      </div>

      <div className="container-x py-10">
        {/* tab පෙරහන (type tabs) */}
        <div className="flex gap-2 flex-wrap mb-8">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setType(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition
                ${type === t.key ? 'bg-pine-700 text-cream border-pine-700' : 'bg-white text-soil/70 border-pine-100 hover:border-pine-700/30'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {loading ? <PageLoader /> : articles.length === 0 ? (
          <EmptyState icon={BookOpen} title="No articles found" message="Try another search term or category." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} to={`/knowledge/${a.id}`} className="card overflow-hidden group flex flex-col">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className={`badge w-fit mb-2 ${a.type === 'disease' ? 'bg-clay/10 text-clay' : 'bg-spore/15 text-spore-600'}`}>
                    {a.type === 'disease' ? 'Disease' : 'Guide'}
                  </span>
                  <h3 className="font-display font-600 text-lg text-pine-700 leading-snug group-hover:text-spore-600 transition">{a.title}</h3>
                  <p className="mt-2 text-sm text-soil/60 line-clamp-2 flex-1">{a.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-pine-700">
                    Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
