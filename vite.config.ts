import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/scoundrel/" : "/",
  // @ts-expect-error ts(2769)
  test: {
    environment: "jsdom",
  },
});
