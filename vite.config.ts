// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import { minify } from 'html-minifier-terser';
import path from 'path';
import { OutputBundle, OutputAsset } from 'rollup';

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
      name: 'fix-font-paths-late',
      enforce: 'post',
      generateBundle(options, bundle: OutputBundle) {
        const fontMap: { [key: string]: string } = {};
        Object.keys(bundle).forEach((fileName) => {
          if (fileName.startsWith('assets/fonts/GoogleSans-') && fileName.endsWith('.woff2')) {
            const match = fileName.match(/(GoogleSans-[A-Za-z]+)-[A-Za-z0-9]+\.woff2/);
            if (match) {
              fontMap[match[1]] = fileName;
            }
          }
          if (fileName.startsWith('assets/fonts/bootstrap-icons') && (fileName.endsWith('.woff2') || fileName.endsWith('.woff'))) {
            const match = fileName.match(/(bootstrap-icons)\.[a-z0-9]+\.(woff2|woff)/);
            if (match) {
              fontMap[match[1]] = fileName;
            }
          }
        });

        Object.keys(bundle).forEach((fileName) => {
          const asset = bundle[fileName];
          if ('source' in asset) {
            const outputAsset = asset as OutputAsset;
            if (fileName.endsWith('.css')) {
              const cssContentOriginal = Buffer.isBuffer(outputAsset.source)
                ? outputAsset.source.toString('utf8')
                : outputAsset.source as string;
              let cssContent = cssContentOriginal;

              Object.entries(fontMap).forEach(([originalFont, hashedFont]) => {
                const regex = new RegExp(`([\\.\\/]*assets\\/fonts\\/)?${originalFont}\\.(woff2|woff)(?!-[A-Za-z0-9]+)`, 'g');
                if (regex.test(cssContent)) {
                  cssContent = cssContent.replace(regex, `/aitrends.now/${hashedFont}`);
                }
              });

              if (cssContent !== cssContentOriginal) {
                outputAsset.source = cssContent;
              }
            }
          }
        });
      },
    },
  ],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    cssCodeSplit: false,
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild', // Switch to esbuild for faster minification
    target: 'es2020',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? 'unknown';
          const extType = path.extname(name).slice(1);
          if (extType === 'css') return 'assets/css/[name]-[hash][extname]';
          if (['woff2', 'woff'].includes(extType)) return 'assets/fonts/[name]-[hash][extname]';
          if (['webp', 'png', 'ico'].includes(extType)) return 'assets/webp/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
      onwarn(warning, warn) {
        if (warning.message.includes('"use client"') || warning.message.includes("Can't resolve original location of error")) {
          return;
        }
        warn(warning);
      },
    },
  },
  resolve: {
    alias: {
      'react-bootstrap': path.resolve(__dirname, 'node_modules/react-bootstrap'),
    },
    conditions: ['browser'],
  },
  base: '/aitrends.now/',
}));