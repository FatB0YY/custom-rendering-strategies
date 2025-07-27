import { ReactElement } from "react";

import { ProductPage } from "./pages/ProductPage";
import { ProductList } from "./pages/ProductsList";

import { RenderContext } from "./types";
import { NotFoundError, RedirectError } from "./utils";

interface Route {
  test: (url: URL) => boolean;
  Component: (props: any) => ReactElement;
  getPageProps: (path: URL, context: RenderContext) => Record<string, any>;
  getMeta?: (path: URL, context: RenderContext) => string;
}

const routes: Route[] = [
  {
    test: ({ pathname }: URL) => /\/product\/.*$\/?/.test(pathname),
    Component: ProductPage,
    getPageProps: (path: URL, context: RenderContext): any => {
      const id = path.pathname.split("/").at(-1);
      const { products } = context.data;

      let product;

      if (id) {
        product = products[Number(id)];
      }

      if (!product) {
        throw new NotFoundError();
      }

      return {
        product,
      };
    },
    getMeta: (path: URL, context: RenderContext) => {
      const { products } = context.data;
      const id = path.pathname.split("/").at(-1);

      let product;

      if (id) {
        product = products[Number(id)];
      }

      if (!product) {
        return "";
      }

      return `
        <title>${product.title}</title>
        <meta name="description" content="${product.description}">
      `;
    },
  },
  {
    test: ({ pathname }: URL) => /(\/$)|(^$)/.test(pathname),
    Component: ProductList,
    getPageProps: (_path: URL, context: RenderContext) => {
      return {
        products: context.data.products,
      };
    },
  },
];

const routeNotFound: Route = {
  test: () => true,
  Component: () => <p>page not found</p>,
  getPageProps: () => ({}),
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
