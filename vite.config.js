import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  build: {
    // three.js is inherently large; the chunk below is intentional.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split heavy, rarely-changing deps into their own chunks so they stay
        // browser-cached across deploys when only app code changes.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@react-three')) return 'react-three';
          if (id.includes('three')) return 'three';
          return 'vendor';
        },
      },
    },
  },
})
