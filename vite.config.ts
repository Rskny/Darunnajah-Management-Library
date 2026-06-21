import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Menggunakan true untuk mengizinkan semua host
    allowedHosts: true, 
    
    proxy: {
      '/api': {
        target: 'http://localhost:9602',
        changeOrigin: true,
      }
    }
  }
});