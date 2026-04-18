import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Redireciona /api/* para o Vercel Dev Server local durante desenvolvimento
    // Rode: npx vercel dev (em vez de npm run dev) para testar as functions localmente
    proxy: {}
  }
})
