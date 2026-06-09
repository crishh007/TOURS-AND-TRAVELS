import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { setBaseUrl } from "@workspace/api-client-react/custom-fetch";

setBaseUrl("https://wander-india.onrender.com");

createRoot(document.getElementById("root")!).render(<App />);