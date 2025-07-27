import { renderToString } from "react-dom/server";
import { App, TContext } from "./App";
import { getRoute } from "./router";
import { StoreItem } from "./types";

export async function render(url: URL) {
  const productsResponse = await fetch(
    "https://fakestoreapi.com/products?limit=6"
  );
  // router => getData() - какие именно данные запросить.
  const products: StoreItem[] = await productsResponse.json();

  const context: TContext = {
    url: url,
    data: { products },
  };

  const appHtml: string = renderToString(<App context={context} />);

  const meta = getRoute(url).getSeo(context);

  return { appHtml, data: context.data, meta: meta };
}
