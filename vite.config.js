import { defineConfig } from 'vite'

export default defineConfig({
  base: './',  // For relative paths
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000
  }
}) 