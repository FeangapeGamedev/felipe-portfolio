import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [react(), glsl()],
  publicDir: "public",
  build: {
    emptyOutDir: true, // Cleans old files before building
    assetsInlineLimit: 0, // Prevents inlining large assets (keeps files separate)
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        dead_code: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) return "three"; // Split Three.js
            if (id.includes("react")) return "react"; // Split React
            if (id.includes("@react-three")) return "r3f"; // Separate react-three-fiber
            if (id.includes("lodash")) return "lodash"; // Separate Lodash if used
            if (id.includes("zustand")) return "zustand"; // Separate Zustand state management
            return "vendor"; // Other dependencies
          }
        },
      },
    },
    chunkSizeWarningLimit: 800, // Prevents warnings for large chunks
  },
});
