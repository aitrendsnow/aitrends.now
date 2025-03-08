import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import { minify } from 'html-minifier-terser';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ViteMinifyPlugin(),
    viteCompression({ algorithm: 'brotliCompress' }),
    imagetools({
      defaultDirectives: (url) => {
        if (mode === 'production' && url.pathname.includes('profile-image.webp')) {
          return new URLSearchParams({
            width: '80',
            format: 'webp',
            quality: '60',
          });
        }
        return new URLSearchParams();
      },
    }),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return minify(html, {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true,
        });
      },
    },
  ],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || 'default-asset-name';
          let extType = fileName.split('.').pop() || 'unknown';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) extType = 'webp';
          else if (/woff|woff2/.test(extType)) extType = 'fonts';
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
      compress: { drop_console: true },
    },
    // Ensure assets are copied
    assetsInlineLimit: 0, // Force all assets to be emitted as files
  },
  base: '/aitrends.now/',
}));