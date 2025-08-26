import { defineConfig } from "vite";
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [basicSsl(), react()],
  server: {
    https: true,
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

