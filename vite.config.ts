import { defineConfig } from 'vite';

export default defineConfig({
  // 项目根目录
  root: '.',
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  // 开发服务器配置
  server: {
    port: 9527,
    open: true,
  },
});

