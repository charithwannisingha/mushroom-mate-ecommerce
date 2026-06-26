// ============================================================
// වෙළඳපොළ පිටුව (Shop / Marketplace) - සෙවීම, පෙරීම, පෙළගැස්ම
// ============================================================
import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react'
import client from '../api/client'
import { ProductCard, EmptyState, PageLoader } from '../components/ui'
import { CATEGORIES } from '../api/helpers'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  // පෙරහන් වෙනස් වන විට නිෂ්පාදන නැවත ලබාගනී (refetch on filter change)
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== 'All') params.set('category', category)
    if (search) params.set('search', search)
    if (sort !== 'newest') params.set('sort', sort)

    const timer = setTimeout(() => {
      client.get(`/products?${params}`)
        .then((res) => setProducts(res.data))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false))
    }, 250) // search debounce
    return () => clearTimeout(timer)
  }, [category, search, sort])

  return (
    <div className="container-x py-10">
      {/* ශීර්ෂය (header) */}
      <div className="mb-8">
        <h1 className="font-display font-700 text-3xl md:text-4xl text-pine-700">Marketplace</h1>
        <p className="mt-2 text-soil/60">Fresh mushrooms, spawn and cultivation supplies from verified Sri Lankan farms.</p>
      </div>

      {/* සෙවුම් සහ පෙරහන් තීරුව (search + sort bar) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-soil/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mushrooms, spawn, kits…" className="input pl-11" />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40 pointer-events-none" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input pl-10 pr-8 appearance-none cursor-pointer">
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {/* කාණ්ඩ chips (category filter) */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition border
              ${category === c
                ? 'bg-pine-700 text-cream border-pine-700'
                : 'bg-white text-soil/70 border-pine-100 hover:border-pine-700/30'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* නිෂ්පාදන ජාලය (product grid) */}
      {loading ? (
        <PageLoader />
      ) : products.length === 0 ? (
        <EmptyState icon={PackageSearch} title="No products found"
          message="Try a different category or search term." />
      ) : (
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
