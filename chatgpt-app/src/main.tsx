import { applyDocumentTheme } from "@openai/apps-sdk-ui/theme";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");

function applySystemTheme(e?: MediaQueryListEvent | MediaQueryList) {
  const prefersDark = e?.matches ?? false;
  applyDocumentTheme(prefersDark ? "dark" : "light");
}

applySystemTheme(mediaQuery);
mediaQuery?.addEventListener("change", applySystemTheme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
