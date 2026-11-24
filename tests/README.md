# Admin regression checks

These are **local isolated tests**, not tests of the production Supabase project. They use a fake auth/database/storage server that keeps all data in memory. No real credentials, product records or files are needed. The mock is deliberately incomplete and is not a security boundary or a replacement for a real end-to-end test.

In separate terminals, with no `.env.local` containing real credentials:

```sh
node tests/fixtures/mock-supabase.cjs
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:4001 NEXT_PUBLIC_SUPABASE_ANON_KEY=mock-publishable npx next dev --hostname 0.0.0.0 --port 3002
node tests/admin-flows.integration.cjs
```

Restart the mock before each run to clear its state. The integration script only targets loopback and uses fake local credentials. It exercises the actual HTTP server actions and renders pages, but not browser JavaScript, real Supabase Auth/Storage, or production infrastructure.

To check the framework multipart limit, build and start the app **without Supabase environment variables**, on local port 3000, then run `node tests/admin-action-body.test.mjs`. The check sends a large file to the login action solely to test the request body limit; it does not test authenticated uploads.

The optional `tests/admin-browser.integration.cjs` exercises category filters, safe deletion, and simulated camera-file selection and resizing using Playwright with the same in-memory mock. Install Playwright and its Chromium browser separately (`npm install --no-save --package-lock=false playwright` and `npx playwright install --with-deps chromium`), start the two local services above, then run `node tests/admin-browser.integration.cjs`. A simulated file input does not test a physical device camera or permission prompt.

Run `npx tsx tests/product-uniqueness.test.ts` to verify the SQL indexes using an isolated PostgreSQL-compatible PGlite database; no production records are touched. `tests/product-validation.test.ts` covers form validation.

`npx tsx tests/inventory-integrity.test.ts` exercises revision changes, stale writes, automatic availability, explicit unconfirmed status, and direct-database checks in an isolated PostgreSQL-compatible PGlite instance. The isolated browser suite also exercises stale tabs, stale deletes, stock transitions, and product-page database failure recovery.

Homepage and URL coverage includes `tests/homepage-brands.test.ts`, `tests/featured.test.ts`, `tests/homepage-migration.test.ts`, and `tests/product-slug.test.ts`. The mock integration test forces a generated-slug collision and checks retry and stable edit URLs; the isolated browser suite selects five products, checks draft visibility, and navigates a brand containing special characters.

`tests/hero-carousel.browser.cjs` checks that pointer and touch interaction do not stop the hero slideshow, while keyboard focus and reduced-motion preferences pause it. It uses Playwright and the same isolated local server as the browser suite; it never accesses production.

`tests/catalog-cache.integration.cjs` verifies the public data cache in **production mode** against the isolated mock: shared hits across pages, anonymous access, edits to price and stock, related listings, slug changes, unpublishing, deletion, and recovery after a cache-miss database failure. Start a fresh mock, build with `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:4001` and `NEXT_PUBLIC_SUPABASE_ANON_KEY=mock-publishable`, and start the built app on port 3002 before running it. Never point this test at a real database. The cache has a five-minute revalidation safety net for changes made outside the admin; Next.js may serve stale data while refreshing, and already-open browser tabs are not pushed updates.

`tests/catalog-cache-ttl.integration.cjs` is an extended production-mode test against the same local mock. It waits just over five minutes to check that an out-of-band database change becomes visible after the actual time-based cache revalidation; run it with a fresh mock and the production-mode server on port 3002.

`tests/admin-performance.integration.cjs` runs in production mode with a fresh isolated mock on ports 3002 and 4001. It checks that product and category reads overlap, authentication and permission checks are deduplicated within the render, query failures recover, permission revocation takes effect on subsequent requests and actions, and private drafts stay private. The simulated 250 ms query delay is useful for comparing request patterns, not for predicting real-world response times. React's request-scoped memoization must not be replaced by a shared cache for authenticated data.

`tests/admin-session-refresh.integration.cjs` tests session refresh in production mode using the isolated mock: an expired session rotates and persists across server-rendered pages and server actions, unauthorized users and invalid tokens are rejected, and the public storefront does not invoke admin middleware. The mock models token rotation but cannot replicate real Supabase session policies, network failures, or all concurrent-refresh races; test those separately in a non-production environment.
