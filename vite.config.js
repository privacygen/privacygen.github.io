import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: '/index.html',
        about: '/about.html',
        contact: '/contact.html',
        privacy: '/privacy.html',
        terms: '/terms.html',
      }
    },
    copyPublicDir: true
  },
  publicDir: 'public'
})