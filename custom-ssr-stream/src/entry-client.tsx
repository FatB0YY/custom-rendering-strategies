import { hydrateRoot } from "react-dom/client";

import "./style.css";
import { App } from "./App";

let products = [];

try {
  const serverState = document.getElementById("server_state")?.innerHTML;
  const serverData = serverState ? JSON.parse(serverState) : {};
  products = serverData.products;
} catch {}

hydrateRoot(
  document.getElementById("root")!,
  <App
    context={{
      url: new URL(location.href),
      data: {
        products,
      },
    }}
  />
);
