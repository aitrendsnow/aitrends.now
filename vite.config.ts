import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import { minify } from 'html-minifier-terser';
import path from 'path';

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
    {
      name: 'fix-font-paths',
      enforce: 'post',
      generateBundle(options, bundle) {
        const fontMap = {};

        // Step 1: Map hashed font filenames
        Object.keys(bundle).forEach((fileName) => {
          if (fileName.startsWith('assets/fonts/GoogleSans-') && fileName.endsWith('.woff2')) {
            const match = fileName.match(/(GoogleSans-[A-Za-z]+)-[A-Za-z0-9]+\.woff2/);
            if (match) {
              fontMap[match[1]] = fileName;
            }
          }
        });

        // Step 2: Replace font paths inside CSS files
        for (const file in bundle) {
          const asset = bundle[file];

          if (asset.type === 'asset' && file.endsWith('.css') && typeof asset.source === 'string') {
            let cssContent = asset.source;

            Object.entries(fontMap).forEach(([originalFont, hashedFont]) => {
              const originalPath = `./assets/fonts/${originalFont}.woff2`;
              const hashedPath = `../${hashedFont}`;
              cssContent = cssContent.replace(new RegExp(originalPath, 'g'), hashedPath);
            });

            asset.source = cssContent;
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
    cssCodeSplit: false,
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
          if (!assetInfo.name) {
            return 'assets/[name]-[hash][extname]';
          }
          const extType = path.extname(assetInfo.name).slice(1);
          if (extType === 'css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (extType === 'woff2' || extType === 'woff') {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (extType === 'webp' || extType === 'png' || extType === 'ico') {
            return 'assets/webp/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  base: '/aitrends.now/',
}));
