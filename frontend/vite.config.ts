import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill for PouchDB/Node built-ins required by dependencies like Buffer/global
    global: 'window',
  },
  resolve: {
    alias: {
      'pouchdb': 'pouchdb/dist/pouchdb.js',
      'pouchdb-find': 'pouchdb/dist/pouchdb.find.js'
    }
  }
})

