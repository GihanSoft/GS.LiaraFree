import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      cert: "./obj/dev-cert.crt",
      key: "./obj/dev-cert.key",
    },
    port: parseInt(process.env.PORT as string),
    proxy: {
      "/api": {
        target:
          process.env["services__main__http__0"] ||
          process.env["services__main__https__0"],
        changeOrigin: true,
      },
    },
  },
});
