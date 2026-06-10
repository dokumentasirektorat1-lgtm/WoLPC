import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Memastikan path relatif agar tidak 404 pada aset
  build: {
    outDir: 'dist',
  }
})
