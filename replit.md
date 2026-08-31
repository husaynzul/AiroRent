# AiroRent

AiroRent is a pink-first property marketplace for discovering, saving, and booking homes, rentals, and short stays.

## Run & Operate

- `pnpm --filter @workspace/jakurzi run dev` — run the AiroRent Vite frontend (the Replit `AiroRent web` workflow supplies `PORT=18514` and `BASE_PATH=/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- API/database env: `DATABASE_URL` is required only when running database-backed API or Drizzle commands.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/jakurzi/src/App.tsx` — AiroRent routes, page composition, listings, and interactions
- `artifacts/jakurzi/src/index.css` — global Inter typography, pink palette, responsive tokens, shadows, and motion
- `attached_assets/` — supplied AiroRent logo, reference images, and property imagery
- `artifacts/api-server/src/` — Express API entry point and `/api/healthz` route
- `lib/db/src/schema/` — Drizzle database schema source of truth
- `lib/api-spec/openapi.yaml` — OpenAPI contract source of truth

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

AiroRent supports browsing Malta and Gozo property listings by rent, buy, and short-let modes; location search; category filters; map browsing; wishlists; listing details; trips; messages; profile/settings; and a multi-step listing-posting flow.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The frontend Vite config requires both `PORT` and `BASE_PATH`; use the configured `AiroRent web` workflow or provide both variables manually.
- Keep the provided AiroRent logo asset unchanged when updating the UI.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
