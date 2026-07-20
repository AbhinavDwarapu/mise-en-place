# Mise en Place - A Shopping List App for the Weekly Shopper

A mobile app for tracking kitchen inventory, recipes, and shopping lists, with AI-assisted suggestions. The frontend is Vite + React (via Ionic/Capacitor), the backend is Encore.ts, managed together as a Turborepo.

## Prerequisites

- [Bun](https://bun.sh) 1.3.14+
- [Encore CLI](https://encore.dev/docs/ts/install) (for the backend)

Install dependencies from the repo root:

```sh
bun install
```

## Build

```sh
bun run build
```

Build a single app with a filter, e.g. `bun run build -- --filter=frontend`.

## Run

```sh
bun run dev
```

This starts the frontend (Vite) and backend (Encore) together. To run just one, add `--filter=frontend` or `--filter=backend`.

## Test

```sh
bun run test
```

## Environment variables

The backend uses Encore's secrets manager rather than `.env` files. For local development, create `apps/backend/.secrets.local.cue` with:

```cue
AIGatewayApiKey: "your-ai-gateway-key"
```

This key is used to call the AI gateway for recipe suggestions.

## Architecture

See [apps/frontend/docs/architecture.md](apps/frontend/docs/architecture.md) for how the frontend is organized.
