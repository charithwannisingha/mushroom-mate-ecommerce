// ============================================================
// ශීර්ෂ navigation තීරුව (Navbar) - mobile responsive
// ============================================================
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, BookOpen, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Logo from './Logo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const [open, setOpen] = useState(false)      // mobile menu
  const [menu, setMenu] = useState(false)      // user dropdown
  const navigate = useNavigate()

  // පරිශීලක භූමිකාවට අනුව dashboard මාර්ගය තීරණය කරයි
  const dashPath = user?.role === 'admin' ? '/admin' : user?.role === 'farmer' ? '/farmer' : '/account/orders'

  const handleLogout = () => { logout(); navigate('/'); setMenu(false) }

  const links = [
    { to: '/shop', label: 'Marketplace', icon: Store },
    { to: '/knowledge', label: 'Knowledge Hub', icon: BookOpen },
  ]

  return (
    <header className="sticky top-0 z-50 bg-cream/85 backdrop-blur-md border-b border-pine-100">
      <nav className="container-x flex items-center justify-between h-16">
        <Logo />

        {/* Desktop සබැඳි (links) */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition
                ${isActive ? 'text-pine-700 bg-pine-50' : 'text-soil/70 hover:text-pine-700 hover:bg-pine-50'}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* දකුණු පස ක්‍රියා (right actions) */}
        <div className="flex items-center gap-1.5">
          {/* කරත්තය (cart) - පාරිභෝගිකයන්ට/ආගන්තුකයන්ට */}
          {user?.role !== 'farmer' && user?.role !== 'admin' && (
            <Link to="/cart" className="relative btn-ghost p-2.5" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-[18px] h-[18px] px-1
                                 rounded-full bg-clay text-cream text-[10px] font-bold">{count}</span>
              )}
            </Link>
          )}

          {/* පරිශීලක menu (logged in) හෝ පිවිසුම් බොත්තම */}
          {user ? (
            <div className="relative hidden md:block">
              <button onClick={() => setMenu(!menu)}
                className="flex items-center gap-2 btn-ghost pl-2 pr-3 py-2">
                <span className="grid place-items-center w-8 h-8 rounded-full bg-pine-700 text-cream text-sm font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="text-sm font-semibold max-w-[110px] truncate">{user.name}</span>
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 card p-2 animate-fade-in">
                    <div className="px-3 py-2 border-b border-pine-100 mb-1">
                      <p className="text-sm font-bold text-pine-700 truncate">{user.name}</p>
                      <p className="text-xs text-soil/50 capitalize">{user.role}</p>
                    </div>
                    <Link to={dashPath} onClick={() => setMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-pine-50">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/account/profile" onClick={() => setMenu(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-pine-50">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-clay hover:bg-clay/5">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex btn-primary py-2 px-4 text-sm">Sign in</Link>
          )}

          {/* Mobile menu බොත්තම */}
          <button onClick={() => setOpen(!open)} className="md:hidden btn-ghost p-2.5" aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-pine-100 bg-cream animate-fade-in">
          <div className="container-x py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-soil/80 hover:bg-pine-50">
                <l.icon className="w-5 h-5" /> {l.label}
              </NavLink>
            ))}
            <div className="h-px bg-pine-100 my-2" />
            {user ? (
              <>
                <Link to={dashPath} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-pine-700 hover:bg-pine-50">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <Link to="/account/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-soil/80 hover:bg-pine-50">
                  <User className="w-5 h-5" /> My Profile
                </Link>
                <button onClick={() => { handleLogout(); setOpen(false) }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-clay hover:bg-clay/5 text-left">
                  <LogOut className="w-5 h-5" /> Log out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="btn-primary">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
