import { useEffect, useState } from "react";
import { getRoute } from "./router";

export function App() {
  const [url, setUrl] = useState<URL>(new URL(location.href));
  const { Page } = getRoute(url);

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

  return <Page url={url} />;
}
