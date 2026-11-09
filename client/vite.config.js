import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Load environment variables
const env = loadEnv('', process.cwd(), '')

export default defineConfig({
  plugins: [react()],

  // Strip debug logging from production builds (dev keeps console output)
  esbuild: {
    pure: ['console.log', 'console.debug', 'console.info', 'console.warn']
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  // Environment variables
  define: {
    __APP_ENV__: JSON.stringify(env.MODE || 'development'),
    __API_URL__: JSON.stringify(env.VITE_API_URL || 'https://dashboard.iplanbymsl.in/api')
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@univerjs')) {
            return 'vendor-univer';
          }
          if (id.includes('xlsx') || id.includes('docx') || id.includes('jspdf') || id.includes('html2canvas')) {
            return 'vendor-office';
          }
          if (id.includes('react-router') || id.includes('react-redux') || id.includes('@reduxjs/toolkit') || id.includes('framer-motion')) {
            return 'vendor-ui-core';
          }
        }
      }
    },
    chunkSizeWarningLimit: 3500
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
