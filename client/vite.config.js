import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Load environment variables
const env = loadEnv('', process.cwd(), '')

export default defineConfig({
  plugins: [react()],
  
  // Environment variables
  define: {
    __APP_ENV__: JSON.stringify(env.MODE || 'development'),
    __API_URL__: JSON.stringify(env.VITE_API_URL || 'https://dashboard.iplanbymsl.in/api')
  },
  
  // Only enable proxy if using localhost
  ...(env.VITE_API_URL?.includes('localhost') && {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3005',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          ws: true
        }
      }
    }
  })
})
