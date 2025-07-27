import { useEffect, useState } from "react";

import { RenderContext } from "./types";
import { getRoute } from "./router";
import { Header } from "./components/Header";

export function App({ context }: { context: RenderContext }) {
  const [path, setPath] = useState<URL>(context.url);
  const { Component, getPageProps } = getRoute(path);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(new URL(window.location.href));
    };

    window.addEventListener("popstate", onLocationChange);
    window.addEventListener("custom-history-change", onLocationChange);

    return () => {
      window.removeEventListener("popstate", onLocationChange);
      window.removeEventListener("custom-history-change", onLocationChange);
    };
  }, []);

  return (
    <>
      <Header />
      <Component {...getPageProps(path, context)} />
    </>
  );
}
