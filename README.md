# Condor — Earthquake Explorer

Interactive map to explore earthquakes worldwide using the USGS Earthquake API.

## Stack

- React + TypeScript + Vite
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

Make sure you have Docker installed.

```bash
docker compose up
```
Open http://localhost:8080

## How to use

1. Open the sidebar using the arrow button.
2. Select a start date, end date, and minimum magnitude.
3. Click Search.
4. Click any marker on the map to see details.
5. Toggle between "Dark Mode" and "Light Mode" in the top navbar to change the map style instantly.

Tip: keep date ranges under 30 days or use magnitude 4.5+ to avoid API limits.

