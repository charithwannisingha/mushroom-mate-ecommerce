import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite සැකසුම් - dev කාලයේ /api ඉල්ලීම් backend වෙත proxy කරයි
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true }
    }
  }
})
