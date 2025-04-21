import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8001,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:2000",
        changeOrigin: true,
      },
      "/static": {
        target: "http://127.0.0.1:2002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/static/, "/resource"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
