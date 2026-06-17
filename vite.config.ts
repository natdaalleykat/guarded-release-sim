import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base is '/guarded-release-sim/' for GitHub Pages (project subpath),
// but '/' for local dev so the preview still works at the root.
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? '/guarded-release-sim/' : '/',
  server: {
    host: true,
  },
}))
