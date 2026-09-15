import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // Runs the suite in a UTC+2/+3 timezone with DST so timezone-conversion bugs
    // (e.g. toISOString() shifting local midnight to the previous UTC day) surface in CI.
    env: { TZ: 'Africa/Cairo' },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('framer-motion')) return 'vendor-framer';
          if (id.includes('@dnd-kit')) return 'vendor-dndkit';
        },
      },
    },
  },
})
