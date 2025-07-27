import { render } from "./dist/server/entry-server.js";

console.log(render(new URL("http://localhost:3000/")));
