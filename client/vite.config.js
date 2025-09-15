import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),   // Enables React support
    tailwindcss(),  // Integrates Tailwind CSS with Vite
  ],
  server: {
    // This proxy is essential for local development to avoid CORS issues.
    proxy: {
      // Any request starting with '/api' will be forwarded to the backend.
      '/api': {
        target: 'http://localhost:3001', // Your Express server's address
        changeOrigin: true,
      },
    },
  },
})