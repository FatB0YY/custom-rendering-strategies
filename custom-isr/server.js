import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prerenderBasePath = path.join(__dirname, "./dist/server/prerender");

const staticState = {};
const TTL = 1000;

async function serverRender(url) {
  let template = await fs.readFile(
    path.resolve(__dirname, "dist/client/index.html"),
    "utf-8"
  );

  const { render } = await import("./dist/server/entry-server.js");

  const { appHtml, data, meta } = await render({ url });
  const html = template
    .replace("<!--ssr-outlet-->", appHtml)
    .replace("<!--ssr-meta-->", meta)
    .replace("{{SSR_STATE}}", JSON.stringify(data));

  return html;
}

async function createServer() {
  const app = express();

  app.use(express.static("dist/client", { index: false }));

  app.use("*all", async (req, res, next) => {
    try {
      const url = new URL(
        req.protocol + "://" + req.get("host") + req.originalUrl
      );

      try {
        const staticRenderKey = encodeURIComponent(url.pathname);
        const prerender = await fs.readFile(
          `${prerenderBasePath}/${staticRenderKey}.html`
        );

        if (!staticState[staticRenderKey]) {
          staticState[staticRenderKey] = Date.now();
        } else {
          const isCacheOutdated =
            Date.now() - staticState[staticRenderKey] > TTL;

          if (isCacheOutdated) {
            serverRender(url).then((updatedRender) => {
              console.log('update cache');
              fs.writeFile(
                `./dist/server/prerender/${encodeURIComponent(url.pathname)}.html`,
                updatedRender
              );
            });
          }
        }

        res.status(200).set({ "Content-Type": "text/html" }).end(prerender);
        return;
      } catch (_err) {}

      try {
        const html = await serverRender(url);

        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (err) {
        if (err.redirect) {
          res.redirect(err.redirect);
          return;
        }

        if (err.notFound) {
          res
            .status(404)
            .set({ "Content-Type": "text/html" })
            .end("Page not found");
          return;
        }

        console.log(err);
        res.status(500).end("ServerError!");
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
