import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

import Vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'pinia'],
      dts: true
    }),
    Vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
