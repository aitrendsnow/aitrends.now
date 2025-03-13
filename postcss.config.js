// postcss.config.js
import purgecss from "@fullhuman/postcss-purgecss"; // Direct import
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    (typeof purgecss === "function" ? purgecss : purgecss.default)({
      content: ["./index.html", "./src/**/*.{ts,tsx}"],
      safelist: {
        standard: [
          "d-flex",
          "flex-column",
          "flex-grow-1",
          "min-vh-100",
          "align-items-center",
          "justify-content-center",
          "text-center",
          "position-absolute",
          "top-0",
          "end-0",
          "m-3",
          "bi",
          "bi-moon-fill",
          "bi-sun-fill",
          "bi-threads",
          "bi-chat-square-text",
          "bi-instagram",
          "bi-book",
          "bi-github",
          "simple-modal",
          "position-fixed",
          "top-50",
          "left-50",
          "translate-middle",
        ],
        deep: [/^modal/, /^tooltip/, /^popover/, /^flex-/, /^m-/, /^p-/],
      },
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
    autoprefixer(),
  ],
};
