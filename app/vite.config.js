import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setupTests.js",
    testMatch: ["./tests/**/*.test.jsx"],
  },
});
