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
    viteCompression({ algorithm: 'brotliCompress' }), // Brotli compression enabled
    imagetools(),
  ],
  css: {
    postcss: './postcss.config.cjs', // Correct: PostCSS config file
    preprocessorOptions: {
      // Remove 'css' here; it's not a preprocessor
      // If you need charset control, handle it in PostCSS or CSS itself
    },
  },
  build: {
    cssCodeSplit: false, // Bundle all CSS into one file
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || 'default-asset-name';
          let extType = fileName.split('.').pop() || 'unknown';

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
    sourcemap: true,
    minify: 'terser',
    target: 'esnext',
    terserOptions: {
      compress: {
        drop_console: false,
        pure_funcs: ['console.log'], // Optional: strip logs in prod
      },
    },
  },
  base: '/aitrends.now/',
});