/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: (process.env.VITE_BASE_PATH ?? (process.env.NODE_ENV === 'production' ? '/dashboard' : '')) + '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3030
  },
  envDir: path.resolve(__dirname, '..')
})
