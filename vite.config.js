import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/felipe-portfolio/" : "/", // ✅ Works in both dev & production
  plugins: [react(), glsl()],
  publicDir: "public",
  build: {
    emptyOutDir: true,
    assetsInlineLimit: 0,
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
            if (id.includes("three")) return "three";
            if (id.includes("react")) return "react";
            if (id.includes("@react-three")) return "r3f";
            if (id.includes("lodash")) return "lodash";
            if (id.includes("zustand")) return "zustand";
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
