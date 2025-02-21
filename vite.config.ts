import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
plugins: [
react(),
ViteMinifyPlugin(),
visualizer({ open: false }),
viteCompression(), // No headers needed
imagetools(),
],
css: {
postcss: './postcss.config.cjs',
},
build: {
rollupOptions: {
output: {
assetFileNames: (assetInfo) => {
const fileName = assetInfo.name || 'default-asset-name';
let extType = fileName.split('.').at(-1) || 'unknown';

if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
extType = 'img';
} else if (/woff|woff2/.test(extType)) {
extType = 'fonts';
}
return `assets/${extType}/[name]-[hash][extname]`;
},
chunkFileNames: 'assets/js/[name]-[hash].js',
entryFileNames: 'assets/js/[name]-[hash].js',
},
},
outDir: 'dist',
},
base: '/aitrends.now/', // Fixed base path
});
