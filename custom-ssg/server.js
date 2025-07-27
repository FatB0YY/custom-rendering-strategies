import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prerenderBasePath = path.join(__dirname, './dist/server/prerender');

async function createServer() {
  const app = express();

  app.use(express.static("dist/client", { index: false }));

  app.use("*all", async (req, res, next) => {
    const url = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );

    try {
      let prerender;

      if (url.pathname === '' || url.pathname === '/') {
        prerender = await fs.readFile(`${prerenderBasePath}/main.html`);
      } else {
        prerender = await fs.readFile(`${prerenderBasePath}/${encodeURIComponent(url.pathname)}.html`);
      }

      if (prerender) {
        res.status(200).set({ "Content-Type": "text/html" }).end(prerender);
        return;
      } else {
        res
          .status(404)
          .set({ "Content-Type": "text/html" })
          .end("Page not found");
        return;
      }
    } catch (e) {
      next(e);
    }
  });

  const port = 3000;

  console.log(`Server started on port ${port}`);
  app.listen(port);
}

createServer();
