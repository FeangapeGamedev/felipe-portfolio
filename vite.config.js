import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const glsl = (await import('vite-plugin-glsl')).default;

  return {
    plugins: [
      react(),
      glsl({
        include: '**/*.glsl', // Include GLSL files
        exclude: 'node_modules/**', // Exclude node_modules
      }),
    ],
    base: process.env.NODE_ENV === 'production' ? '/portfolio-game/' : '/', // Ensure correct base path
    build: {
      outDir: 'dist', // Output directory
      sourcemap: true, // Enable source maps for debugging
    },
    server: {
      port: 3000, // Development server port
      open: true, // Automatically open the browser
    },
  };
});
