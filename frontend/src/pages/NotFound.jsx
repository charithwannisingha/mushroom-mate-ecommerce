// ============================================================
// 404 පිටුව (Not Found) - වැරදි මාර්ගයකදී පෙන්වයි
// ============================================================
import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="font-display font-700 text-7xl text-spore-600">404</p>
      <h1 className="font-display font-700 text-2xl text-pine-700 mt-4">Page not found</h1>
      <p className="mt-2 text-soil/60 max-w-sm mx-auto">
        The page you're looking for has wandered off into the forest.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-primary"><Home className="w-4 h-4" /> Back home</Link>
        <Link to="/shop" className="btn-outline"><Search className="w-4 h-4" /> Browse marketplace</Link>
      </div>
    </div>
  )
}
