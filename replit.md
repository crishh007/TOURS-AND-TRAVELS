# WanderIndia

A futuristic AI-powered Smart Travel Planner web app for India with cinematic dark UI, full JWT auth, AI itinerary generation, mood-based recommendations, destination explorer, budget tracker, AI chatbot, packing lists, and weather integration.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/wander-india run dev` — run the React frontend (port 24932)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: React + Vite + Wouter routing + Framer Motion + shadcn/ui
- **API**: Express 5 (port 8080, paths under `/api/`)
- **DB**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (stored in localStorage as `wander_token`), bcryptjs for password hashing
- **Validation**: Zod (`zod/v4`), `drizzle-zod`, Orval-generated schemas
- **Build**: esbuild (CJS bundle)

## Where things live

- `artifacts/wander-india/src/` — React frontend
  - `pages/` — All 18 page components
  - `components/` — Navbar, DestinationCard, ProtectedRoute, shadcn/ui
  - `hooks/use-auth.tsx` — Auth context + JWT management
  - `lib/api-client.ts` — setAuthTokenGetter initialization
  - `index.css` — Cinematic dark theme, custom utilities
- `artifacts/api-server/src/routes/` — All API route handlers
  - `auth.ts` — register, login, logout, me, profile
  - `destinations.ts` — list, trending, hidden-gems, detail
  - `trips.ts` — CRUD + expenses
  - `ai.ts` — itinerary, mood-recs, chat, packing-list
  - `weather.ts` — weather by destination
  - `dashboard.ts` — summary, recent-activity
- `artifacts/api-server/src/middlewares/auth.ts` — JWT middleware
- `lib/db/src/schema/` — Drizzle schema: users, destinations, trips, expenses
- `lib/api-zod/src/generated/` — Auto-generated Zod validators (from OpenAPI)
- `lib/api-client-react/src/generated/` — Auto-generated React Query hooks (from OpenAPI)

## Architecture decisions

- JWT stored in localStorage (`wander_token`, `wander_user`), injected via `setAuthTokenGetter` custom-fetch hook
- Dark mode is default `:root` — `.light` class switches to light mode (not toggled by default)
- All API routes under `/api/*` prefix — global proxy routes `/api` to port 8080
- AI features are rule-based (no external AI API needed) — deterministic but context-aware
- Mood system maps 8 emotional states to destination types, activities, and travel styles

## Product

- **Home**: Cinematic hero, mood selector grid, trending destinations, feature showcase, testimonials
- **Destinations Explorer**: Search + category filter across 15 seeded Indian destinations
- **AI Itinerary Generator**: Day-by-day plans with activities, meals, accommodation, tips
- **Mood Travel Engine**: Emotional state → destination + activity recommendations
- **Hidden Gems**: Curated off-beat Indian destinations (Spiti, Hampi, Majuli, Ziro, Kutch)
- **My Trips**: CRUD trips, budget progress bars, status tracking
- **Budget Tracker**: Per-trip and overall spending with visual breakdowns
- **AI Chat**: Context-aware India travel chatbot with quick-reply suggestions
- **AI Packing Lists**: Activity/season/destination-aware checklists with checkoff
- **Profile**: Editable name, bio, location
- **Emergency**: India emergency numbers with tap-to-call + safety tips

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always restart the API server workflow after changing route files (it rebuilds via esbuild)
- The `custom-fetch` export must exist in `lib/api-client-react/package.json` exports for JWT injection to work
- DB seeding: 15 destinations are seeded via `code_execution` SQL insert; run again if DB is reset
- `SESSION_SECRET` env var is used as JWT secret — must be set

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- OpenAPI spec at `lib/api-spec/openapi.yaml` — source of truth for API contract
