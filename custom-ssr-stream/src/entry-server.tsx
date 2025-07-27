
import { App } from "./App";
import { StoreItem } from "./types";
import { getRoute } from "./router";

export async function render({
  url,
  js,
  css,
}: {
  url: URL;
  js: string;
  css: string;
}) {
  const products = (await fetch(
    "https://fakestoreapi.com/products?limit=20"
  ).then((res) => res.json())) as StoreItem[];

  const context = {
    url,
    data: {
      products,
    },
  };

  const { getMeta } = getRoute(url);
  const meta = getMeta?.(url, context) ?? "";
  const data = { products };

  const Entry = () => (
    <html>
      <head>
        {meta}
        <script id="server_state" type="application/json">
          {JSON.stringify(data)}
        </script>
        <script type="module" src={js}></script>
        <link rel="stylesheet" href={css} />
      </head>
      <body>
        <div id="root">
          <App context={context} />
        </div>
      </body>
    </html>
  );

  return <Entry />;
}
