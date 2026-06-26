// ============================================================
// Register Page - Role Selection & Farmer Fields
// Password Constraint: 8–12 characters (SRS 5.3)
// ============================================================
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, ShoppingBag, Tractor, Eye, EyeOff, Sprout } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('customer')
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', city: '', farm_name: '',
  })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // Handling registration submission
  const submit = async (e) => {
    e.preventDefault()
    
    // Client-side password length validation (SRS 5.3)
    if (form.password.length < 8 || form.password.length > 12) {
      setError('Password must be between 8 and 12 characters long.')
      return
    }
    
    setBusy(true)
    setError('')
    try {
      const user = await register({ ...form, role })
      // Redirect farmers to dashboard pending verification, customers straight to shop
      navigate(user.role === 'farmer' ? '/farmer' : '/shop', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-x py-12 lg:py-16">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-pine-700 mx-auto mb-4">
            <Sprout className="w-7 h-7 text-spore" />
          </div>
          <h1 className="font-display font-700 text-3xl text-pine-700">Create your account</h1>
          <p className="mt-2 text-soil/60">Join Sri Lanka's mushroom marketplace</p>
        </div>

        <form onSubmit={submit} className="card p-6 sm:p-8 space-y-5">
          {/* Role Selection */}
          <div>
            <label className="label">I want to join as a…</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('customer')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition
                  ${role === 'customer' ? 'border-spore bg-spore/5' : 'border-pine-100 hover:border-pine-200'}`}>
                <ShoppingBag className={`w-6 h-6 ${role === 'customer' ? 'text-spore-600' : 'text-soil/40'}`} />
                <span className="font-semibold text-sm text-pine-700">Customer</span>
                <span className="text-[11px] text-soil/50 text-center leading-tight">Buy fresh mushrooms</span>
              </button>
              <button type="button" onClick={() => setRole('farmer')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition
                  ${role === 'farmer' ? 'border-spore bg-spore/5' : 'border-pine-100 hover:border-pine-200'}`}>
                <Tractor className={`w-6 h-6 ${role === 'farmer' ? 'text-spore-600' : 'text-soil/40'}`} />
                <span className="font-semibold text-sm text-pine-700">Farmer</span>
                <span className="text-[11px] text-soil/50 text-center leading-tight">Sell your harvest</span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Full name</label>
              <input required value={form.name} onChange={set('name')} className="input" placeholder="e.g. Nimal Perera" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Email address</label>
              <input type="email" required value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" />
            </div>

            {/* Conditional input: Farm Name shows up for Farmers only */}
            {role === 'farmer' && (
              <div className="sm:col-span-2 animate-fade-in">
                <label className="label">Farm name</label>
                <input required value={form.farm_name} onChange={set('farm_name')} className="input" placeholder="e.g. Green Valley Mushrooms" />
              </div>
            )}

            <div>
              <label className="label">Phone</label>
              <input value={form.phone} onChange={set('phone')} className="input" placeholder="07X XXX XXXX" />
            </div>
            <div>
              <label className="label">City</label>
              <input value={form.city} onChange={set('city')} className="input" placeholder="e.g. Kandy" />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Password <span className="font-normal text-soil/40">(8–12 characters)</span></label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                  className="input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-soil/40 hover:text-pine-700">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {role === 'farmer' && (
            <p className="text-xs text-clay bg-clay/5 rounded-lg px-3 py-2">
              Farmer accounts require admin verification before products go live. You can start adding products right away.
            </p>
          )}

          {error && <p className="text-sm text-clay bg-clay/5 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" /> {busy ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-sm text-soil/60">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-spore-600 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}