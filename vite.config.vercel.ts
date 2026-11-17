import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vercel builds a plain SPA: no Cloudflare plugin, so the output is a single
// static dist/ (index.html + assets). The API lives in api/*.ts instead.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist', emptyOutDir: true },
})
