import { useEffect, useState } from "react";
import { getRoute } from "./router";
import { StoreItem } from "./types";

export type TContext = {
  url: URL;
  data?: {
    products: StoreItem[];
  };
};

interface AppProps {
  context: TContext;
}

export function App({ context }: AppProps) {
  const [url, setUrl] = useState<URL>(context.url);
  const { Page } = getRoute(url);
  const renderContext = { ...context, url };

  useEffect(() => {
    const onLocationChange = () => {
      setUrl(new URL(location.href));
    };

    window.addEventListener("popstate", onLocationChange);
    window.addEventListener("custom-history-change", onLocationChange);

    return () => {
      window.removeEventListener("popstate", onLocationChange);
      window.removeEventListener("custom-history-change", onLocationChange);
    };
  }, []);

  return <Page context={renderContext} />;
}
