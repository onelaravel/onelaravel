import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app/index.js',  // Main module entry
                'resources/js/bootstrap.js', // Bootstrap
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js/app'),
            '@app': path.resolve(__dirname, 'resources/js/app'),
        }
    },
    build: {
        sourcemap: true, // Enable source maps for debugging
        rollupOptions: {
            output: {
                // Custom output for Blade compiler
                entryFileNames: 'app/[name].js',
                chunkFileNames: 'app/[name].js',
                assetFileNames: 'app/[name].[ext]'
            }
        }
    },
    server: {
        hmr: {
            host: 'localhost',
        },
    },
});