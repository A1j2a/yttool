import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'

  return {
    plugins: [react(), tailwindcss()],

    server: {
      proxy: { '/api': env.VITE_API_URL || 'https://yttool-r6ge.onrender.com' },
    },

    build: {
      cssCodeSplit: true,
      sourcemap: false,
      minify: isProd ? 'oxc' : false,
      target: 'es2020',
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('node_modules')) return 'vendor'
          },
        },
      },
    },

    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
    },
  }
})
