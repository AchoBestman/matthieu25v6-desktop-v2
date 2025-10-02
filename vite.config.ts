import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import i18nextLoader from "vite-plugin-i18next-loader";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

import type { UserConfigExport } from "vite";

const host = process.env.TAURI_DEV_HOST;

const config: UserConfigExport = {
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    i18nextLoader({ paths: ["./src/locales"] }) as any,
  ],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

export default defineConfig(config);
