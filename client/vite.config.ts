import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./@"),
      "@schemas": path.resolve(import.meta.dirname, "../shared/schemas"),
      "src": path.resolve(import.meta.dirname, "./src"),
    }
  }
})
