import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `static/[name].js`,
                chunkFileNames: `static/[name].js`,
                assetFileNames: `static/[name].[ext]`
            }
        }
    },
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
})
