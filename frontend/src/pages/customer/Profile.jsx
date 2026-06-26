// ============================================================
// පැතිකඩ පිටුව (Profile) - විස්තර බැලීම සහ සංස්කරණය (PUT /auth/me)
// ============================================================
import { useState } from 'react'
import { User, Mail, Phone, MapPin, Tractor, Save, BadgeCheck, ShieldAlert } from 'lucide-react'
import client from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { fmtDate } from '../../api/helpers'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', city: user?.city || '',
    address: user?.address || '', farm_name: user?.farm_name || '',
  })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // පැතිකඩ සුරැකීම (save profile)
  const save = async (e) => {
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      await client.put('/auth/me', form)
      setUser({ ...user, ...form })       // local state යාවත්කාලීන කරයි
      setMsg('Profile updated successfully')
    } catch {
      setMsg('Update failed — please try again')
    } finally {
      setBusy(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display font-700 text-3xl text-pine-700 mb-8">My Profile</h1>

      <div className="grid lg:grid-cols-3 gap-8 max-w-4xl">
        {/* පැතිකඩ සාරාංශ කාඩ්පත (summary card) */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="grid place-items-center w-20 h-20 rounded-full bg-pine-700 text-cream text-2xl font-display font-700 mx-auto mb-4">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="font-display font-700 text-lg text-pine-700">{user?.name}</h2>
            <p className="text-sm text-soil/55 capitalize">{user?.role}</p>

            {/* ගොවි verify තත්ත්වය (farmer verification badge) */}
            {user?.role === 'farmer' && (
              <div className={`mt-4 badge mx-auto ${user?.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {user?.is_verified
                  ? <><BadgeCheck className="w-3.5 h-3.5" /> Verified farmer</>
                  : <><ShieldAlert className="w-3.5 h-3.5" /> Pending verification</>}
              </div>
            )}

            <div className="h-px bg-pine-100 my-5" />
            <div className="space-y-2.5 text-sm text-left">
              <p className="flex items-center gap-2.5 text-soil/70"><Mail className="w-4 h-4 text-soil/40" /> {user?.email}</p>
              {user?.created_at && <p className="flex items-center gap-2.5 text-soil/70"><User className="w-4 h-4 text-soil/40" /> Joined {fmtDate(user.created_at)}</p>}
            </div>
          </div>
        </div>

        {/* සංස්කරණ පෝරමය (edit form) */}
        <div className="lg:col-span-2">
          <form onSubmit={save} className="card p-6 sm:p-8 space-y-5">
            <h2 className="font-display font-600 text-lg text-pine-700">Edit details</h2>

            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
                <input required value={form.name} onChange={set('name')} className="input pl-10" />
              </div>
            </div>

            {user?.role === 'farmer' && (
              <div>
                <label className="label">Farm name</label>
                <div className="relative">
                  <Tractor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
                  <input value={form.farm_name} onChange={set('farm_name')} className="input pl-10" />
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
                  <input value={form.phone} onChange={set('phone')} className="input pl-10" placeholder="07X XXX XXXX" />
                </div>
              </div>
              <div>
                <label className="label">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil/40" />
                  <input value={form.city} onChange={set('city')} className="input pl-10" />
                </div>
              </div>
            </div>

            <div>
              <label className="label">Address</label>
              <input value={form.address} onChange={set('address')} className="input" placeholder="House no, street" />
            </div>

            {msg && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{msg}</p>}

            <button type="submit" disabled={busy} className="btn-primary">
              <Save className="w-4 h-4" /> {busy ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
