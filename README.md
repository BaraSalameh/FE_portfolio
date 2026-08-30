# Portfolio frontend

Next.js App Router frontend for `portfolio-api`. The application includes the public landing/search experience, authentication, public portfolios, and the owner dashboard.

## Architecture

- `src/app` owns routes, layouts, route handlers, loading states, and error boundaries.
- `src/components` contains reusable presentation and form primitives.
- `src/features/dashboard` contains dashboard domain state, forms, and UI orchestration.
- `src/lib/api` is the single HTTP/authentication boundary. Dashboard thunks currently use the compatibility adapter in `src/lib/utils/api`; it delegates to the same fetch client.
- `src/lib/schemas`, `src/lib/definitions`, and `src/lib/data` contain shared validation, contracts, and server data access.

## Backend configuration

Copy `.env.example` to `.env.local` and configure at least:

```dotenv
API_URL=https://localhost:5001
```

`API_URL` is server-only and may include `/api`; the client normalizes it. Browser requests use the same-origin `/api/*` backend-for-frontend route, which relays requests to `portfolio-api` and preserves its `HttpOnly` authentication cookies. The API signing secret is never shared with the frontend.

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
