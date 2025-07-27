import fs from "node:fs/promises";

const ids = Array.from(Array(21)).map((_, index) => index + 1);

await fs.mkdir("./dist/server/prerender", { recursive: true });

const htmlResponse = await fetch(`http://localhost:3000/`);
const html = await htmlResponse.text();

await fs.writeFile(`./dist/server/prerender/main.html`, html);

for (const id of ids) {
  const htmlResponse = await fetch(`http://localhost:3000/product/${id}`);

  if (htmlResponse.status === 200) {
    const html = await htmlResponse.text();

    await fs.writeFile(
      `./dist/server/prerender/${encodeURIComponent(`/product/${id}`)}.html`,
      html
    );
  }
}
