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
        for (const file in bundle) {
          const asset = bundle[file];

          // Process only CSS files
          if (asset.type === 'asset' && file.endsWith('.css') && typeof asset.source === 'string') {
            let cssContent = asset.source;

            // Find all hashed fonts
            const fontFiles = Object.keys(bundle).filter(f =>
              f.startsWith('assets/fonts/GoogleSans-') && f.endsWith('.woff2')
            );

            fontFiles.forEach(fontFile => {
              const originalFontName = fontFile.match(/GoogleSans-[A-Za-z]+/);
              if (originalFontName) {
                const originalFont = `./assets/fonts/${originalFontName[0]}.woff2`;
                cssContent = cssContent.replace(originalFont, `../${fontFile}`);
              }
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
