import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";

const fontsToPreload = ["GoogleSans-Regular", "GoogleSans-Bold"]; // 🔹 Only load fonts that are used immediately
const fonts = import.meta.glob("./assets/fonts/*.woff2", { eager: true });

Object.entries(fonts).forEach(([path, font]: [string, any]) => {
  const fontName = path.split("/").pop()?.split("-")[0]; // Extract font base name (GoogleSans-Regular)

  if (fontName && fontsToPreload.includes(fontName)) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = font.default;
    link.as = "font";
    link.type = "font/woff2";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
