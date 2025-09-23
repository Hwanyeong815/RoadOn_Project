import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/', // ✅ Vercel 같은 배포 환경에서 경로 꼬임 방지
    css: {
        preprocessorOptions: {
            scss: {
                // additionalData: `@import "src/styles/index.scss";`,
            },
        },
    },
});
