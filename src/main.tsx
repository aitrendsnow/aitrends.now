import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./bootstrap-overrides.css";

import "./assets/fonts/GoogleSans-Regular.woff2";
import "./assets/fonts/GoogleSans-Medium.woff2";
import "./assets/fonts/GoogleSans-Bold.woff2";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
