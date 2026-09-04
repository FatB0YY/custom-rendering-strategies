**English** | [Русский](./README.ru.md)

# Custom Rendering Strategies

Hand-written implementations of the major web rendering strategies and their optimisations, built without Next.js, Remix or any framework that would hide the mechanics.

The point is to see what those frameworks actually do. `getStaticProps`, `revalidate` and streaming SSR are not magic — they are a build step that writes HTML files, a timestamp check that triggers regeneration, and a response the server keeps open while flushing chunks. Each folder here implements one of those from first principles.

## Strategy comparison

| Strategy | HTML generated | TTFB | Data freshness | Best for |
| --- | --- | --- | --- | --- |
| CSR | In the browser, after JS loads | Fast (empty shell) | Always current | Dashboards, admin panels, anything behind a login |
| App Shell | Shell cached, content in browser | Very fast | Always current | Repeat visits, PWA-style apps |
| SSG | At build time | Fastest | Stale until rebuilt | Docs, marketing pages, blogs |
| Partial SSG | Popular pages at build, the rest on demand | Mixed | Mixed | Large catalogues with a hot subset |
| ISR | At build, then regenerated in the background | Fastest | Stale by at most the revalidation window | Catalogues that change but not per-request |
| SSR | Per request, on the server | Slower — waits for data | Always current | Personalised pages that still need indexing |
| SSR streaming | Per request, flushed in chunks | Fast — shell first | Always current | Pages where part of the data is slow |
| SSI | Fragments assembled by the server or CDN | Fast | Per-fragment | Shared headers, footers, widgets across pages |

## Implementations

### `react-csr`

Client-side rendering. The server returns a near-empty document; React builds the entire page in the browser. The baseline every other strategy is measured against — and the reason the others exist, since nothing is visible until the bundle has loaded and executed.

### `react-csr-app-shell`

CSR with an App Shell. The static skeleton — layout, navigation, placeholders — ships and renders immediately, while the content-dependent parts arrive afterwards. The user sees structure instead of a blank screen, which changes perceived performance without changing the actual data timings.

### `custom-ssg`

Static Site Generation. Pages are rendered to HTML during the build, so the server only has to serve files. Nothing is faster, and nothing is more stale: changed data requires a rebuild.

### `custom-partial-ssg`

Partial Static Site Generation. Only part of the pages are pre-rendered at build; the rest are produced on demand. The answer to catalogues where pre-rendering every page would make the build unacceptably long, but a small subset accounts for most of the traffic.

### `custom-isr`

Incremental Static Regeneration. Pages are served statically, but after a revalidation window the next request triggers a background regeneration while the stale version is still served. The compromise between SSG's speed and SSR's freshness — and the strategy whose implementation is the least obvious of the set.

### `custom-ssr`

Classic server-side rendering. HTML is generated per request, so the response contains real content — indexable and immediately visible. The cost is TTFB: the server must fetch the data before it can send anything.

### `custom-ssr-slow-request`

A deliberately slowed SSR request. It exists to make the previous cost visible: with a slow data source, the whole page waits, and the user sees nothing at all. This is the problem the next implementation solves.

### `custom-ssr-stream`

Streaming SSR. The server sends the shell as soon as it is ready and flushes the rest as data resolves, rather than holding the response until everything is done. TTFB drops back to near-static levels while the content stays server-rendered.

### `custom-ssi`

Server Side Includes. The server or CDN assembles a page from separately cached fragments. Lets a shared header, footer or widget be cached once and reused across pages with different caching rules.

### `stream`

Data streaming demonstrations — the transport mechanism underneath streaming SSR.

## Running

Each folder is a self-contained project. Enter the one you want and run it:

    cd custom-ssr
    npm install
    npm run dev

## Author

Rodion Ramazanov — [GitHub](https://github.com/FatB0YY) · [Telegram](https://t.me/iamrodionn)
