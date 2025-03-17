import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [react(), glsl()],
  publicDir: "public", // Ensures only necessary public files are copied
  build: {
    emptyOutDir: true, // Deletes old files in `dist/` before building (prevents duplicates)
    assetsInlineLimit: 0, // Prevents inlining large assets (keeps files separate)
    minify: "terser", // Uses Terser for best minification
    terserOptions: {
      compress: {
        drop_console: true, // Removes console.log() for smaller files
        dead_code: true, // Eliminates unused code
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) return "three"; // Splits Three.js into its own file
            if (id.includes("react")) return "react"; // Splits React into its own file
            return "vendor"; // Other dependencies go into `vendor.js`
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Prevents warnings about large chunks
  },
});
