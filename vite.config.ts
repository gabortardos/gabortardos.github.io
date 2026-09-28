import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// User-site repo (gabortardos.github.io) → served at the root URL, so base must stay '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
