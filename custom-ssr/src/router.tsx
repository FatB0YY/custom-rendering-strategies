import { ReactElement } from "react";

import { TContext } from "./App";
import { ProductPage } from "./pages/ProductPage";
import { ProductList } from "./pages/ProductsList";

interface Route {
  test: (url: URL) => boolean;
  Page: (props: any) => ReactElement;
  getSeo: (renderContext: TContext) => string;
}

const routes: Route[] = [
  {
    test: ({ pathname }: URL) => /\/product\/.*$\/?/.test(pathname),
    Page: ProductPage,
    getSeo: (renderContext) => {
      const id = renderContext.url.pathname.split("/").at(-1);
      const product = renderContext.data?.products[Number(id)];

      if (!product) {
        // Class redirect error
        throw new Error("Not found");
      }

      return `<title>${product.title}<title/> 
        <meta name="description" content="${product.description}">
      `;
    },
  },
  {
    test: ({ pathname }: URL) => /(\/$)|(^$)/.test(pathname),
    Page: ProductList,
    getSeo(renderContext) {
      return "";
    },
  },
];

const routeNotFound: Route = {
  test: () => true,
  Page: () => <p>page not found</p>,
  getSeo(renderContext) {
    return "";
  },
};

export function getRoute(url: URL) {
  const route = routes.find((route) => route.test(url));

  if (!route) {
    return routeNotFound;
  }

  return route;
}

export const navigate = (path: string) => {
  if (window.location.pathname !== path) {
    history.pushState({}, "", path);
    window.dispatchEvent(new Event("custom-history-change"));
  }
};
