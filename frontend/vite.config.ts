import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({mode}) => { return{
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: mode==='development' ? {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch:{
      ignored: ['**/node_modules/**'],
      usePolling: true,
    },
    proxy: {'/api': {
      target: 'http://backend:3000',
      changeOrigin: true,
      secure: false,
      // rewrite: (path) => path.replace(/^\/api/, '/api'),
    },},
  } : {},
}})
