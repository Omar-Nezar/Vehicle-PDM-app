import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { qrcode } from "vite-plugin-qrcode"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    qrcode()
  ],
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(import.meta.dirname, "./@"),
      "@schemas": path.resolve(import.meta.dirname, "../shared/schemas"),
      "src": path.resolve(import.meta.dirname, "./src"),
    }
  }
})
