import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'node:path';

export default defineConfig({
    root: 'src',
    publicDir: '../public',
    // Served from the www.awstam.com custom domain, so this is "/" (the deploy workflow passes
    // BASE_PATH from the Pages configuration, which is empty for a custom domain)
    base: process.env.BASE_PATH || '/',
    plugins: [vue()],

    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, 'src'),
        },
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rolldownOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('fortawesome')) {
                            return 'fontawesome';
                        } else if (id.includes('bootstrap')) {
                            return 'bootstrap';
                        } else if (id.endsWith('.css') || id.includes('.css?')) {
                            return 'vendor-styles';
                        }
                        return 'vendor';
                    }
                },
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {},
        },
    },
});
