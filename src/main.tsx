// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// Import font files to ensure Vite processes them
import "./assets/fonts/GoogleSans-Regular.woff2";
import "./assets/fonts/GoogleSans-Medium.woff2";
import "./assets/fonts/GoogleSans-Bold.woff2";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
