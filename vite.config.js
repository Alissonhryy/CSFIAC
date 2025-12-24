import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/storage'],
          'charts': ['chart.js'],
          'utils': ['./src/js/utils.js'],
          'modules': [
            './src/js/modules/courses.js',
            './src/js/modules/instructors.js',
            './src/js/modules/users.js'
          ]
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});

