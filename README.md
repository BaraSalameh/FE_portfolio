# Portfolio frontend

Next.js App Router frontend for `portfolio-api`. The application includes the public landing/search experience, authentication, public portfolios, and the owner dashboard.

## Architecture

- `src/app` owns routes, layouts, route handlers, loading states, and error boundaries.
- `src/design-system` contains reusable presentation and form primitives.
- `src/features/dashboard` contains dashboard domain state, forms, and UI orchestration.
- `src/lib/api/server-client.ts` is the server-only `portfolio-api` transport. It forwards request cookies when needed, defaults requests to `no-store`, and normalizes backend errors.
- `src/lib/api/browser-client.ts` is the browser transport. It calls the same-origin `/api` BFF and coordinates access-token refresh without exposing authentication cookies to JavaScript.
- `src/lib/api` contains only shared HTTP transport, cookie, configuration, and error infrastructure. Feature endpoint calls stay with the feature that owns them.
- `src/lib/schemas` and `src/lib/definitions` contain genuinely shared validation and contracts. Feature-specific data access stays inside its owning feature.

Initial dashboard data is fetched by the dashboard Server Component and placed into a dashboard-scoped Redux store before the client UI renders. Do not add mount-time requests for initial route data.

Feature mutations cross a Server Action boundary. Domain calls use focused feature-local `api.ts` modules; Redux request adapters live in `thunks/`. Dashboard thunks call the focused `dashboardQuery` or `dashboardMutation` adapters in `src/features/dashboard/requests.ts`; mutations delegate to `src/features/dashboard/actions.ts`. That action performs endpoint-specific Zod validation, requires authentication for owner operations, returns serializable `ActionResult` values, and relies on `portfolio-api` for resource-level authorization.

Keep browser fetching for genuinely interactive reads such as pagination, infinite scrolling, dependent lookup options, search-as-you-type, and polling. Do not use Server Actions for GET-style reads because client-dispatched actions are queued and use POST semantics. Migrate Education, Experience, Certificates, Languages, profile settings, and contact messages one feature family at a time, running all verification commands after each migration.

## Backend configuration

Copy `.env.example` to `.env.local` and configure at least:

```dotenv
API_URL=https://localhost:5001
```

`API_URL` is server-only and may include `/api`; the server client normalizes it. Browser requests use the same-origin `/api/*` backend-for-frontend route, which relays requests to `portfolio-api` and preserves its `HttpOnly` authentication cookies. The API signing secret is never shared with the frontend.

Authentication uses `HttpOnly` cookies issued by `portfolio-api`. Configure the frontend's public origin in the API's `CORS_ALLOWED_ORIGINS`/`Security.AllowedOrigins` setting because the BFF supplies that origin for the API's cookie-CSRF checks. Use HTTPS in production.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. For the optional local HTTPS server, set `LOCAL_SSL_KEY`, `LOCAL_SSL_CERT`, and `LOCAL_SSL_CA`, then run `node server.js`.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

The Playwright suite starts both the frontend and an isolated mock API automatically, including BFF cookie/origin forwarding checks. A real authenticated dashboard walkthrough requires a running, configured `portfolio-api` instance and suitable test data.

## Deployment

Set the variables from `.env.example` in the hosting environment and run `npm run build`. Do not expose `API_URL` or certificate paths with the `NEXT_PUBLIC_` prefix. The API only needs to be reachable from the Next.js runtime; browsers communicate with the frontend origin.
