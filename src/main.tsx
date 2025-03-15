import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";

// ✅ Fix: Corrected font path & improved TypeScript handling
const fonts = import.meta.glob("./assets/fonts/*.woff2", { eager: true });

Object.values(fonts).forEach((font: any) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = font.default; // ✅ Direct access without unnecessary casting
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
