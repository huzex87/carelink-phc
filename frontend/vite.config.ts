import * as reactPlugin from 'vite-plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [reactPlugin],
  define: {
    // Polyfill for PouchDB/Node built-ins required by dependencies like Buffer/global
    global: 'window',
  }
})

