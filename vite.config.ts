import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    ViteMinifyPlugin(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          criticalCSS: `<style>
            .profile-description {
              font-family: 'Google Sans', Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              color: #333;
              visibility: visible;
              opacity: 1;
              content-visibility: auto;
              contain-intrinsic-size: auto 20px;
              transition: opacity 0.2s ease-in-out;
            }
          </style>`,
        },
      },
    }),
    visualizer({ open: false }), // Prevents browser auto-opening
    viteCompression(), // Enables Brotli/Gzip compression
  ],
  css: {
    postcss: './postcss.config.cjs',
  },
  build: {
    rollupOptions: {},
  },
  base: 'https://aitrendsnow.github.io/aitrends.now/',
});
