import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, "postcss.config.js"),
    devSourcemap: true,
  },
  resolve: {
    alias: {
      buffer: "buffer",
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
    include: ["buffer"],
  },
  build: {
    rollupOptions: {
      plugins: [],
      output: {
        manualChunks: {},
      },
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
});
