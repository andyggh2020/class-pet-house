import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true,
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3099',
      '/pet-images': 'http://localhost:3099',
      '/动物图片': 'http://localhost:3099'
    }
  }
})
