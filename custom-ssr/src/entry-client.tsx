import { hydrateRoot } from "react-dom/client";

import { App, TContext } from "./App";
import "./style.css";

const context: TContext = {
  url: new URL(location.href),
};

let data = null;

try {
  const serverState = document.getElementById("server_state");
  const serverStateContent = serverState?.innerHTML;

  if (serverStateContent) {
    context.data = JSON.parse(serverStateContent);
  }
} catch (error) {}

hydrateRoot(document.getElementById("root")!, <App context={context} />);
