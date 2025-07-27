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
      
      const products = (await fetch(
        "https://fakestoreapi.com/products?limit=6"
      ).then((res) => res.json()));
      const html = template.replace('{{DATA}}', JSON.stringify({products}))

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      next(e);
    }
  });

  const port = 3000;

  console.log(`Server started on port ${port}`);
  app.listen(port);
}

createServer();
