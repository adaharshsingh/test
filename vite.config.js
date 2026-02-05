import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      '#components': resolve(dirname(fileURLToPath(import.meta.url)), 'src/mac-app/components'),
      '#constants': resolve(dirname(fileURLToPath(import.meta.url)), 'src/mac-app/constants'),
      '#store': resolve(dirname(fileURLToPath(import.meta.url)), 'src/mac-app/store'),
      '#windows': resolve(dirname(fileURLToPath(import.meta.url)), 'src/mac-app/windows'),
      '#hoc': resolve(dirname(fileURLToPath(import.meta.url)), 'src/mac-app/hoc'),
    },
  },
})
