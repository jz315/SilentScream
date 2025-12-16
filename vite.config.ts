import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const isSingleFileBuild = mode === 'single' || mode === 'single-online';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      base: isSingleFileBuild ? './' : undefined,
      build: isSingleFileBuild
        ? {
            assetsInlineLimit: 100_000_000,
            cssCodeSplit: false,
            rollupOptions: {
              output: {
                inlineDynamicImports: true,
                manualChunks: undefined,
              },
            },
          }
        : undefined,
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          ws: path.resolve(__dirname, './shims/ws.ts'),
        }
      }
    };
});
