import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToPipeableStream } from "react-dom/server";

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
      let stats = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "dist/client/.vite/manifest.json"),
          "utf-8"
        )
      );

      const js = stats["index.html"].file;
      const css = stats["style.css"].file;

      const { render } = await import("./dist/server/entry-server.js");

      try {
        const Component = await render({ url, js, css });
        const { pipe } = renderToPipeableStream(Component, {
          onShellReady() {
            pipe(res);
          },
          onError(error) {
            console.error("Stream error:", error);
            res.statusCode = 500;
            res.end("<h1>Something went wrong</h1>");
          },
          onShellError(err) {
            console.error("Shell error:", err);
            res.statusCode = 500;
            res.end("<h1>Shell rendering error</h1>");
          },
        });
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
