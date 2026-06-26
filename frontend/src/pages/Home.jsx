// ============================================================
// මුල් පිටුව (Home / Landing page) - hero + features
// ============================================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sprout, ShoppingBag, BookOpen, ShieldCheck, TrendingUp, Truck, Leaf } from 'lucide-react'
import client from '../api/client'
import { ProductCard } from '../components/ui'

export default function Home() {
  const [featured, setFeatured] = useState([])

  // ප්‍රමුඛ නිෂ්පාදන 4ක් ලබාගනී (load 4 featured products)
  useEffect(() => {
    client.get('/products').then((res) => setFeatured(res.data.slice(0, 4))).catch(() => {})
  }, [])

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* පසුබිම් රූපය (hero background image - Sri Lankan farming) */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=1600&q=80"
            alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-pine-700 via-pine-700/90 to-pine-700/40" />
        </div>

        <div className="relative container-x py-24 md:py-32">
          <div className="max-w-2xl animate-fade-up">
            <span className="badge bg-spore/20 text-spore-400 border border-spore/30 mb-5">
              <Leaf className="w-3.5 h-3.5" /> Sri Lanka's mushroom marketplace
            </span>
            <h1 className="font-display font-700 text-4xl sm:text-5xl lg:text-6xl text-cream leading-[1.05]">
              From the farm,<br /><span className="text-spore-400">straight to your kitchen.</span>
            </h1>
            <p className="mt-6 text-lg text-cream/75 leading-relaxed max-w-xl">
              Mushroom Mate connects local growers directly with consumers — fresh oyster, button and shiitake
              mushrooms, cultivation supplies, and the know-how to grow your own.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-spore px-6 py-3 text-base">
                Shop the marketplace <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="btn-outline px-6 py-3 text-base border-cream/30 text-cream hover:bg-cream/10">
                Sell your harvest
              </Link>
            </div>

            {/* විශ්වාස සංඥා (trust stats) */}
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              {[['100%', 'Direct from growers'], ['24/7', 'Order anytime'], ['Island-wide', 'Delivery network']].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display font-700 text-2xl text-spore-400">{n}</p>
                  <p className="text-sm text-cream/60">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="container-x py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-spore-600">Why Mushroom Mate</span>
          <h2 className="mt-3 font-display font-700 text-3xl md:text-4xl text-pine-700">
            One platform for the whole supply chain
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShoppingBag, title: 'Fresh Marketplace', desc: 'Browse and buy fresh mushrooms, spawn and equipment directly from verified Sri Lankan farms.' },
            { icon: Sprout, title: 'Farmer Dashboard', desc: 'List products, track real-time inventory and manage incoming orders from one simple place.' },
            { icon: BookOpen, title: 'Knowledge Hub', desc: 'Cultivation guides and a disease diagnostics library to help every grower succeed.' },
            { icon: TrendingUp, title: 'Sales Insights', desc: 'Visual reports show revenue, top products and growth so farmers can make informed decisions.' },
          ].map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-soft transition-shadow">
              <div className="grid place-items-center w-12 h-12 rounded-xl bg-pine-50 text-pine-700 mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-600 text-lg text-pine-700">{f.title}</h3>
              <p className="mt-2 text-sm text-soil/65 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="container-x pb-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-spore-600">Fresh today</span>
            <h2 className="mt-2 font-display font-700 text-3xl text-pine-700">Popular in the marketplace</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex btn-ghost text-pine-700 font-semibold">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-soil/50 py-8">Start the backend server to load live products.</p>
        )}
      </section>

      {/* ===== CTA STRIP ===== */}
      <section className="container-x py-20">
        <div className="relative overflow-hidden rounded-3xl bg-pine-700 px-8 py-14 md:px-14">
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-spore/10 blur-2xl" />
          <div className="relative grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="font-display font-700 text-3xl md:text-4xl text-cream">
                Grow your mushroom business, digitally.
              </h2>
              <p className="mt-3 text-cream/70 max-w-xl">
                Join farmers across Sri Lanka who've moved beyond paper records — manage inventory, reach urban
                customers and grow your profits with Mushroom Mate.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/register" className="btn-spore px-6 py-3 justify-center">Become a seller</Link>
              <div className="flex items-center gap-3 text-cream/60 text-sm">
                <ShieldCheck className="w-4 h-4 text-spore-400" /> Verified farms only
                <Truck className="w-4 h-4 text-spore-400 ml-2" /> Island-wide
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
