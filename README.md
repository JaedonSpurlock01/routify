Routify is a pathfinding visualizer that is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It is designed to work with any city listed on [`OpenStreetMap`](https://www.openstreetmap.org/).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How it works
This project uses ThreeJS for rendering the maps and the data is gathered by the Overpass API offered through OpenStreetMap.
