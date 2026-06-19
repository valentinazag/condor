# Condor — Earthquake Explorer

Interactive map to explore earthquakes worldwide using the USGS Earthquake API.

## Stack

- React + TypeScript + Vite + Vitest
- MapLibre GL JS
- OpenFreeMap
- Valibot
- USGS Earthquake API

## Run locally

```bash
pnpm install
pnpm dev
```
Open http://localhost:5173

## Run with Docker

**Start (attached):**
```bash
docker compose up --build
```

**Start (detached):**
```bash
docker compose up --build -d
```

**Stop:**
```bash
docker compose down
```
Open http://localhost:8080

## Tests

```bash
pnpm test
```

To watch for changes:

```bash
pnpm test:watch
```

## How to use

1. Open the sidebar using the arrow button.
2. Select a start date, end date, and minimum magnitude.
3. The form validates the date range, prevents a future end date, and checks that magnitude is between 0 and 10.
4. Click Search to load earthquake data from the USGS API.
5. Use the magnitude legend in the sidebar to interpret marker colors.
6. Click any marker to fly to that location and open a details popup. The popup includes magnitude, location, time, and a link to the full event page on USGS.
7. If the map shows a "Showing 500 results" banner, narrow your filters because the app caps results at 500 for performance.
8. Use the crosshair button (bottom-right) to reset the map to the initial view or your detected location.
9. Use the "Filters" button in the top navbar to show/hide the sidebar, and toggle "Dark Mode" / "Light Mode" to switch map styles instantly.
10. If your browser allows it, the map will automatically center on your current location when the app loads; if not, the map stays on the default world view.

## Bonus: Web Worker

The USGS fetch and response parsing run inside a dedicated Web Worker (`src/workers/earthquakeWorker.ts`), keeping the main thread free while the request is in flight. The worker receives filter params via `postMessage`, fetches and validates the data with Valibot, sorts the results by magnitude descending, caps them at 500 via the API's `limit` parameter, and posts back a typed `EarthquakeWorkerMessage` — either the earthquake array or an error string.

The `useEarthquakes` hook owns the worker lifecycle: it spawns the worker on mount, wires up `message` and `error` listeners per search, and terminates it on unmount. Shared types (`EarthquakeSchema`, `EarthquakeFeature`, `EarthquakeWorkerMessage`) live in `src/types/EarthquakeTypes.ts` so both sides of the worker boundary use the same definitions without duplication.

To handle the race condition from rapid consecutive searches, each request is stamped with a `requestId`. The worker echoes it back in every response, and the hook discards any message whose ID doesn't match the most recent request.

## Tradeoffs and incomplete work

**Markers: DOM elements vs. WebGL layer**

Each earthquake is rendered as a custom DOM element via `maplibregl.Marker`. The limitation of this approach is performance: when the map is panned or zoomed with thousands of markers visible, the browser has to recalculate the screen position of each DOM element on every frame, which causes lag.

The scalable alternative is to use MapLibre's `addSource` + `addLayer` API with a `circle` layer. That renders all points directly on the WebGL canvas — the GPU handles positioning. The DOM approach was chosen because it was simpler to reason about given no prior MapLibre experience, and the performance impact only becomes noticeable with very large datasets (low magnitude + long date range).

Results are capped at 500 per search via the API's `limit` parameter. This prevents both API rate-limit errors and UI lag from rendering too many DOM markers at once. When the cap is reached, the map shows a notice prompting the user to narrow their search.

**IndexedDB (not implemented)**

Results are not cached between searches. Implementing IndexedDB would allow the app to serve repeated or overlapping queries from local storage instead of re-fetching. The main decision to defer it was prioritizing correctness of the core features (filtering, rendering, Web Worker) over the caching layer.

**Service Worker (not implemented)**

No offline support. A Service Worker would enable caching the app shell and API responses for offline use. This was deprioritized for the same reason as IndexedDB.

