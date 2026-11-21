import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

import { fileURLToPath } from 'node:url'

// Build CSS tema WordPress saja (terpisah dari build situs Vercel).
export default defineConfig({
  // URL font relatif supaya tema bisa dipasang di folder mana pun.
  base: './',
  root: fileURLToPath(new URL('./theme/assalimi', import.meta.url)),
  plugins: [tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL('./theme/assalimi/assets', import.meta.url)),
    emptyOutDir: false,
    rollupOptions: {
      input: fileURLToPath(new URL('./theme/assalimi/src/theme.css', import.meta.url)),
      output: {
        assetFileNames: (info) => (info.names?.[0]?.endsWith('.css') ? 'theme.css' : 'fonts/[name][extname]'),
        entryFileNames: 'theme-build.js',
      },
    },
  },
})
