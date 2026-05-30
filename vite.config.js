import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  // NOTE: do not manualChunks-split `three` / `@react-three/*` into separate
  // chunks — it builds fine but blanks the page in production (module init-order
  // / circular-dep across the chunk boundary). Dev doesn't chunk, so it hides
  // the bug. Keep them in the single default bundle.
})
