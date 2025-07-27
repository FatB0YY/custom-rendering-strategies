import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  app.use(express.static("dist/client", { index: false }));

  app.use("*all", async (req, res, next) => {
    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, "dist/client/index.html"),
        "utf-8"
      );

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      next(e);
    }
  });

  const port = 3000;

  console.log(`Server started on port ${port}`);
  app.listen(port);
}

createServer();
