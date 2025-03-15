import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";

// Automatically load hashed fonts
const fonts = import.meta.glob("/assets/fonts/*.woff2", { eager: true });

Object.values(fonts).forEach((font) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = (font as { default: string }).default;
  link.as = "font";
  link.type = "font/woff2";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
