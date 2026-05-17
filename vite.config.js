import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // escuta em IPv4 (127.0.0.1) e IPv6 + rede local
    port: 5173,
    strictPort: true,  // não troca de porta sozinho
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },
})
