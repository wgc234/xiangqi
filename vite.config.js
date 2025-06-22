import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/xiangqi/', 
  plugins: [vue()],
  server: {
    port: 1516,
    open: true
  }
}) 