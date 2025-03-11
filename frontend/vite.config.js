import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // Set limit to 1MB (default is 500KB)
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        target: "https://renteasy-backend.onrender.com",
        changeOrigin: true,
      },
      "/uploads/": "https://renteasy-backend.onrender.com",
    },
  },
});
