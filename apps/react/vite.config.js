import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Относительные пути — сборка работает на GitHub Pages в любой подпапке
  base: './',
  build: {
    outDir: '../../dist/react',
    emptyOutDir: true,
  },
});
