import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '/',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'sass-boilerplate': path.resolve(__dirname, 'src/sass-boilerplate'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [
          path.resolve(__dirname, 'src/sass-boilerplate/stylesheets'),
          path.resolve(__dirname, 'src/assets/style'),
        ],
      },
    },
  },
  build: {
    outDir: '../dist',
  },
});
