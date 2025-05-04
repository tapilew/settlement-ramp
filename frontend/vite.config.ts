import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss() as unknown as PluginOption],
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
});
