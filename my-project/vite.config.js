//E-Shopping/my-project/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/E-Shopping/',  // This fixes the asset paths for GitHub Pages
  plugins: [react()],
})