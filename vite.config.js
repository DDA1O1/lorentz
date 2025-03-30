import { defineConfig } from 'vite'

export default defineConfig({
  base: './',  // For relative paths
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: true,
    target: 'esnext',
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
}) 