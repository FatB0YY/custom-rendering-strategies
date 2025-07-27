import { renderToString } from "react-dom/server";

import { App } from "./App";
import { StoreItem } from "./types";
import { getRoute } from "./router";

export async function render({ url }: { url: URL }) {
  const { getMeta } = getRoute(url);

  const products = (await fetch(
    "https://fakestoreapi.com/products?limit=100"
  ).then((res) => res.json())) as StoreItem[];

  const context = {
    url,
    data: {
      products,
    },
  };

  return {
    appHtml: renderToString(<App context={context} />),
    meta: getMeta?.(url, context) ?? "",
    data: { products },
  };
}
