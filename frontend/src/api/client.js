// ============================================================
// Axios API සේවාදායකය - සියලුම backend ඉල්ලීම් මෙය හරහා යයි
// ============================================================
import axios from 'axios'

const client = axios.create({ baseURL: '/api' })

// සෑම ඉල්ලීමකටම JWT token එක ස්වයංක්‍රීයව එක් කරයි
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default client
