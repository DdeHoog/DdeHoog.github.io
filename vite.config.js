// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for your GitHub user page repository (<username>.github.io)
  base: '/',

  // Specify the output directory (standard is 'dist')
  build: {
    outDir: 'dist'
  }
  // Note: No comma after the 'build' object if it's the last item
});