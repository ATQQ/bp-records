import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import path from "path";
import { viteVConsole } from 'vite-plugin-vconsole';

const isProdEnv = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// GitHub Pages 部署配置
const getBase = () => {
  if (isGitHubPages) {
    // GitHub Pages 通常使用仓库名作为 base path
    return process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/bp-records/';
  }
  return '/';
};

const PLUGINS = isProdEnv ? [react()] : [
    react(),
    viteVConsole({
      entry: path.resolve('src/main.jsx'),
      enabled: !isProdEnv,
    })
];

// https://vitejs.dev/config/
export default defineConfig({
  base: getBase(),
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs']
        }
      }
    }
  },
  server: {
    host: "::",
    port: "8080",
    hmr: {
      overlay: false
    }
  },
  plugins: PLUGINS,
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
});
