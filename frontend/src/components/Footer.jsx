// ============================================================
// පාද තීරුව (Footer)
// ============================================================
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-pine-700 text-cream/80 mt-20">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            Sri Lanka's integrated mushroom marketplace and cultivation management platform — connecting growers
            directly with consumers.
          </p>
        </div>

        <div>
          <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-spore transition">Marketplace</Link></li>
            <li><Link to="/knowledge" className="hover:text-spore transition">Knowledge Hub</Link></li>
            <li><Link to="/register" className="hover:text-spore transition">Become a Seller</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/login" className="hover:text-spore transition">Sign in</Link></li>
            <li><Link to="/register" className="hover:text-spore transition">Create account</Link></li>
            <li><Link to="/account/orders" className="hover:text-spore transition">My orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-spore shrink-0" /> SLIATE, Labuduwa, Galle</li>
            <li className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-spore shrink-0" /> +94 77 123 4567</li>
            <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-spore shrink-0" /> hello@mushroommate.lk</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>© 2026 Mushroom Mate. Growing Together Digitally.</p>
          <p>Built with Node.js · React · MySQL — HNDIT Project, SLIATE</p>
        </div>
      </div>
    </footer>
  )
}
