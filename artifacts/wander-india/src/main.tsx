import { setBaseUrl } from "@workspace/api-client-react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function resolveApiBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.PROD) {
    return "https://wander-india.onrender.com";
  }

  return "http://localhost:8080";
}

setBaseUrl(resolveApiBaseUrl());

createRoot(document.getElementById("root")!).render(<App />);