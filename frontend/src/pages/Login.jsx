// ============================================================
// Login Page - Email + Password Authentication & Role Redirect
// ============================================================
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Mail, Lock, Eye, EyeOff, Sprout } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // Handling login submission
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await login(form.email, form.password)
      // Redirects user to the correct dashboard based on their access role
      const dest = from || (user.role === 'admin' ? '/admin' : user.role === 'farmer' ? '/farmer' : '/shop')
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-x py-12 lg:py-20">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-pine-700 mx-auto mb-4">
            <Sprout className="w-7 h-7 text-spore" />
          </div>
          <h1 className="font-display font-700 text-3xl text-pine-700">Welcome back</h1>
          <p className="mt-2 text-soil/60">Sign in to your Mushroom Mate account</p>
        </div>

        <form onSubmit={submit} className="card p-6 sm:p-8 space-y-5">
          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
              <input type="email" required value={form.email} onChange={set('email')}
                className="input pl-10" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
              <input type={show ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                className="input pl-10 pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-soil/40 hover:text-pine-700">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-clay bg-clay/5 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-soil/60">
            New to Mushroom Mate?{' '}
            <Link to="/register" className="font-semibold text-spore-600 hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}