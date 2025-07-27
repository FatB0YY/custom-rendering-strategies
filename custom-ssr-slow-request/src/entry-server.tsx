import { renderToString } from "react-dom/server";

import { App } from "./App";
import { StoreItem } from "./types";
import { getRoute } from "./router";
import { pause } from "./utils";

export async function render({ url }: { url: URL }) {
  // await pause();
  const products = (await fetch(
    "https://fakestoreapi.com/products?limit=6"
  ).then((res) => res.json())) as StoreItem[];

  const context = {
    url,
    data: {
      products: [],
    },
  };

  const { getMeta } = getRoute(url);

  return {
    appHtml: renderToString(<App context={context} />),
    meta: getMeta?.(url, context) ?? "",
    data: { products: [] },
  };
}
