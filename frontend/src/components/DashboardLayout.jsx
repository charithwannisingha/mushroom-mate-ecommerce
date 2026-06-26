// ============================================================
// උපකරණ පුවරු සැකිල්ල (Dashboard Layout) - පැති තීරුව සහිත
// ගොවි සහ පරිපාලක පිටු සඳහා පොදුවේ භාවිතා වේ · mobile responsive
// ============================================================
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ title, subtitle, nav, children }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)   // mobile sidebar

  // පැති තීරු සබැඳි (sidebar link renderer)
  const SidebarLinks = ({ onClick }) => (
    <nav className="space-y-1">
      {nav.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} onClick={onClick}
          className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition
            ${isActive ? 'bg-pine-700 text-cream shadow-soft' : 'text-soil/70 hover:bg-pine-50 hover:text-pine-700'}`}>
          <item.icon className="w-[18px] h-[18px]" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="container-x py-6 lg:py-8">
      <div className="flex gap-8">
        {/* ස්ථාවර පැති තීරුව — desktop (sticky sidebar) */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24">
            <div className="card p-4 mb-4">
              <p className="text-xs font-semibold text-soil/45 uppercase tracking-wide px-2 mb-1">
                {user?.role === 'admin' ? 'Admin Panel' : 'Farmer Hub'}
              </p>
              <p className="font-display font-700 text-pine-700 px-2 truncate">{user?.farm_name || user?.name}</p>
            </div>
            <div className="card p-3"><SidebarLinks /></div>
          </div>
        </aside>

        {/* ප්‍රධාන අන්තර්ගතය (main content) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display font-700 text-2xl sm:text-3xl text-pine-700">{title}</h1>
              {subtitle && <p className="text-soil/55 mt-1 text-sm sm:text-base">{subtitle}</p>}
            </div>
            {/* Mobile menu toggle */}
            <button onClick={() => setOpen(true)} className="lg:hidden btn-outline p-2.5">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-soil/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative ml-auto w-72 max-w-[80%] bg-cream h-full p-5 animate-fade-in overflow-auto">
            <div className="flex items-center justify-between mb-5">
              <p className="font-display font-700 text-pine-700">{user?.role === 'admin' ? 'Admin Panel' : 'Farmer Hub'}</p>
              <button onClick={() => setOpen(false)} className="btn-ghost p-2"><X className="w-5 h-5" /></button>
            </div>
            <SidebarLinks onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
