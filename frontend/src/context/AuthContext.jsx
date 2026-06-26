// ============================================================
// සත්‍යාපන context - පරිශීලක තත්ත්වය ගෝලීයව කළමනාකරණය කරයි
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react'
import client from '../api/client'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ආරම්භයේදී localStorage හි token එකක් තිබේ නම් පරිශීලකයා ලබාගනී
  useEffect(() => {
    const token = localStorage.getItem('mm_token')
    if (token) {
      client.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('mm_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // පිවිසුම (login)
  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password })
    localStorage.setItem('mm_token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  // ලියාපදිංචිය (register)
  const register = async (data) => {
    const res = await client.post('/auth/register', data)
    localStorage.setItem('mm_token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  // නික්මීම (logout)
  const logout = () => {
    localStorage.removeItem('mm_token')
    setUser(null)
  }

  const value = { user, setUser, loading, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
