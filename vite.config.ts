import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Files under public/ are copied to dist as-is, so the maplibre worker
  // needs no special assetsInclude handling here.
  server: {
    headers: {
      // Allow SharedArrayBuffer for maplibre worker (dev only)
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  optimizeDeps: {
    include: ['maplibre-gl'],
  },
  build: {
    rollupOptions: {
      // Suppress known maplibre-gl "use of eval" warnings
      onwarn(warning, warn) {
        if (warning.code === 'EVAL' && warning.id?.includes('maplibre-gl')) return;
        warn(warning);
      },
    },
  },
})
