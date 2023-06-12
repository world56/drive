import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     "/api/explorer/resource/upload": {
  //       target: "http://127.0.0.1:2002",
  //       changeOrigin: true,
  //       rewrite: (path) =>
  //         path.replace(
  //           /^\/api\/explorer\/resource\/upload/,
  //           "/resource/upload",
  //         ),
  //     },
  //     "/api": {
  //       target: "http://127.0.0.1:2000",
  //       changeOrigin: true,
  //     },
   
  //   },
  // },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
