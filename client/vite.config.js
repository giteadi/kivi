import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Auto-detect API URL and configure proxy accordingly
const API_URL = process.env.VITE_API_URL || 'http://localhost:3005/api'
const isLocalhost = API_URL.includes('localhost')

export default defineConfig({
  plugins: [react()],
  
  // Only enable proxy if using localhost
  ...(isLocalhost && {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3005',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          ws: true,
          // Only activate proxy for localhost development
          bypass: function(req, res, proxyOptions) {
            if (API_URL.includes('localhost')) {
              return false // Use proxy
            }
            return null // Use direct request
          }
        }
      }
    }
  })
})
