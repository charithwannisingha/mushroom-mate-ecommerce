// Mushroom Mate ලාංඡනය (brand logo)
import { Link } from 'react-router-dom'

export default function Logo({ light = false, className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* හතු හැඩැති SVG ලාංඡනය */}
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-spore shadow-sm group-hover:scale-105 transition-transform">
        <svg viewBox="0 0 64 64" className="w-7 h-7">
          <path d="M32 14c-11 0-19 7-19 15 0 2 1 3 3 3h32c2 0 3-1 3-3 0-8-8-15-19-15z" fill="#1f3d2b"/>
          <circle cx="24" cy="26" r="2.4" fill="#a7d129"/>
          <circle cx="40" cy="26" r="2.4" fill="#a7d129"/>
          <circle cx="32" cy="22" r="2.4" fill="#a7d129"/>
          <path d="M28 32h8v12c0 3-2 5-4 5s-4-2-4-5z" fill="#1f3d2b"/>
        </svg>
      </span>
      <div className="leading-none">
        <span className={`block font-display font-700 text-lg tracking-tight ${light ? 'text-cream' : 'text-pine-700'}`}>
          Mushroom<span className="text-spore-600">Mate</span>
        </span>
        <span className={`block text-[10px] font-semibold tracking-[0.18em] uppercase ${light ? 'text-cream/60' : 'text-soil/50'}`}>
          Growing Together
        </span>
      </div>
    </Link>
  )
}
