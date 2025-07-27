import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  app.use(express.static("dist/client", { index: false }));

  app.use("*all", async (req, res, next) => {
    const url = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );

    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "dist/client/index.html"),
        "utf-8"
      );

      const { render } = await import("./dist/server/entry-server.js");

      try {
        const { appHtml, data, meta } = await render({ url });
        const html = template
          .replace("<!--ssr-outlet-->", appHtml)
          .replace("<!--ssr-meta-->", meta)
          .replace("{{SSR_STATE}}", JSON.stringify(data));

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
