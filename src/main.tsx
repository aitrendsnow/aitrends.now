import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";
// Preload and serve Bootstrap Icons fonts from src/assets/fonts/
import "./assets/fonts/bootstrap-icons.woff2";
import "./assets/fonts/bootstrap-icons.woff";

import "./assets/fonts/GoogleSans-Medium.woff2";
import "./assets/fonts/GoogleSans-Bold.woff2";
import "/src/assets/fonts/GoogleSans-Regular.woff2";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
