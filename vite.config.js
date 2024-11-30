import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [],
    server: {
        port: 3000,
        open: true, // 自动打开浏览器
    },
    build: {
        outDir: 'build', // 修改输出目录
        rollupOptions: {
            input: '/voto/', // 确保指定了正确的入口文件
        },
    }
});