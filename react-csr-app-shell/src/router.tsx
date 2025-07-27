import { ReactElement } from "react";

import { ProductPage } from "./pages/ProductPage";
import { ProductList } from "./pages/ProductsList";

interface Route {
  test: (url: URL) => boolean;
  Page: (props: any) => ReactElement;
}

const routes: Route[] = [
  {
    test: ({ pathname }: URL) => /\/product\/.*$\/?/.test(pathname),
    Page: ProductPage
  },
  {
    test: ({ pathname }: URL) => /(\/$)|(^$)/.test(pathname),
    Page: ProductList,
  },
];

const routeNotFound: Route = {
  test: () => true,
  Page: () => <p>page not found</p>
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
