import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // Относительные пути — сборка работает на GitHub Pages в любой подпапке
  base: './',
  build: {
    outDir: '../../dist/vue',
    emptyOutDir: true,
  },
});
