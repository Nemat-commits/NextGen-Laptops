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
