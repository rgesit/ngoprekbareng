import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  // Build Worker: situs + CMS satu origin (assalimi.my.id).
  define: { __STATIC_BUILD__: 'false' },
  server: { port: 5173, strictPort: false },
})
