import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/online-resume/",
  plugins: [vue()],
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        404: "./404.html",
      },
    },
  },
  server: {
    proxy: {
      "/ai": {
        target: "https://open.bigmodel.cn/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, ""),
      },
    },
  },
});
