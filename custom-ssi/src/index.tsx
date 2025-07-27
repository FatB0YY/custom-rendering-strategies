import { createRoot } from "react-dom/client";

import "./style.css";
import { App } from "./App";

let products = [];

try {
  const serverState = document.getElementById("server_state")?.innerHTML;
  const serverData = serverState ? JSON.parse(serverState) : {};
  products = serverData.products;
} catch {}

const root = createRoot(document.getElementById("root")!);
root.render(<App products={products} />);
