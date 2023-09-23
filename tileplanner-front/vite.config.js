import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Другие настройки Vite.js
  plugins: [react()],
  server: {
    proxy: {
      // Путь к вашему API
      '/api': {
        target: 'https://localhost:7029', // Замените на реальный адрес вашего сервера
        changeOrigin: true,
        cors: false, // Включите CORS
      },
    },
  },
});