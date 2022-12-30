import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./index";
import "./globals.css";
import { AnalyticsWrapper } from "./analytics";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Home />
    <AnalyticsWrapper />
  </React.StrictMode>
);
