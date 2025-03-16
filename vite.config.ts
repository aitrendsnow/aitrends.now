import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { minify } from 'html-minifier-terser';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),

    // Brotli Compression for faster loading
    viteCompression({ algorithm: 'brotliCompress' }),

    // Minify HTML for production
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

    // Fix font paths in CSS
    {
      name: 'fix-font-paths',
      enforce: 'post',
      generateBundle(options, bundle) {
        for (const file in bundle) {
          const asset = bundle[file];

          if (asset.type === 'asset' && file.endsWith('.css') && typeof asset.source === 'string') {
            asset.source = asset.source.replace(/(\.\.\/)*assets\/fonts\//g, '/assets/fonts/');
            console.log(`✅ Fixed font paths in ${file}`);
          }
        }
      },
    },
  ],

  css: {
    postcss: './postcss.config.js',
  },

  build: {
    cssCodeSplit: false,  // Ensure all CSS is inlined properly
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    terserOptions: {
      compress: { drop_console: true },
    },
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';

          const extType = path.extname(assetInfo.name).slice(1);
          if (extType === 'css') return 'assets/css/[name]-[hash][extname]';
          if (extType === 'woff2' || extType === 'woff') return 'assets/fonts/[name]-[hash][extname]';
          if (extType === 'webp' || extType === 'png' || extType === 'ico') return 'assets/webp/[name]-[hash][extname]';

          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },

  base: '/aitrends.now/',
}));
