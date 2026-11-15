# NextGen Laptops

A fresh Next.js storefront and Supabase-backed inventory starter. The supplied list is transcribed as 95 numbered units, grouped into 45 configurations. Repeated configurations retain their source row numbers and quantity. In the absence of a configured database, the site displays this data as an explicitly labelled preview; the preview is not live stock.

## Run locally

```sh
npm ci
npm run dev
npm run build
```

Copy `.env.example` to `.env.local` to configure a dedicated Supabase project. The WhatsApp number must be in international format without `+` or spaces. If not set, the site uses the owner-confirmed shop number, 923215744034.

## Database and administrator setup

Use a dedicated NextGen Supabase project. Do not run these operations against an unrelated project. In the Supabase SQL editor, apply `supabase/migrations/0001_initial_schema.sql` **once**, then apply the later migrations in `supabase/migrations` in order (including `0002_product_uniqueness.sql`), and then run `supabase/seed.sql`. The seed uses `ON CONFLICT DO NOTHING`, so rerunning it will not overwrite edits. To regenerate after changing the transcription, run `npx tsx scripts/generate-seed.ts`.

Create an Auth user through Supabase, then grant that specific user access from the SQL editor (replace with the actual user UUID from Auth, not an email):

```sql
insert into public.admin_users (user_id) values ('<auth-user-uuid>');
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, restart the application, and sign in at `/admin/login`. Only users explicitly listed in `admin_users` can modify products, categories or storage. Use the public anon key in the application, never the service-role key. The migration creates the public `product-images` bucket and restricts image writes to admins. Uploaded images should be optimized WebP where possible, maximum 2 MB.

Configure the same public environment variables for the Vercel project and deploy this branch through the normal Git workflow. No deployment or remote database migration has been performed automatically.

## Data provenance and limitations

The source list does not include prices, actual stock status, condition, screen, exact processor models, graphics, warranty or drive type. Those fields must be verified before publishing; the app does not infer them. The quantities reflect the supplied rows, not confirmed current inventory. Some model names in the image are abbreviated (for example HP 840 G8, Lenovo L13 and HP ZBook); they are kept as provided rather than guessing a more specific variant. Product image placeholders clearly indicate missing photos. Manufacturer images are representative, not proof of an exact unit's appearance. Source links are provided on product pages; verify model variants and usage rights before production. Optimized local copies are included with the application; admin uploads use Supabase Storage.

This is a functional foundation, not a complete implementation of every item in `docs/architecture.md`: remaining work includes the two unverified product images and verified descriptions, banner management, advanced search RPCs, performance-budget validation, and production deployment. The supplied blueprint is retained for reference. The security policy in the blueprint granting write access to *every* authenticated account has intentionally been replaced with an explicit administrator allowlist.

### Signage and product imagery

The storefront uses an optimized copy of the owner-supplied NextGen logo. The browser icon is cropped from the same artwork; the original is backed up in the NextGen Laptops Drive folder. Contact numbers are reproduced from the sign; WhatsApp uses the owner-confirmed number 0321 5744034. Manufacturer reference images are illustrative, not photos of the exact inventory unit. They were obtained from manufacturer pages and compressed locally for reliable delivery; each product page links to the source. Lenovo L13, Lenovo V15 and shortened HP names need confirmation against the actual units. `Microsoft Surface 3` and `HP ZBook` remain placeholders because the source list does not identify their exact variants. Verify all models, image rights, and configurations before publishing. Seed updates do not overwrite existing database records, so existing stores need deliberate admin edits rather than a blind rerun.

### Shop information

The sign supplied by the owner provides the two phone numbers; the owner confirmed that 0321 5744034 is the WhatsApp number. A web search for NextGen Laptops Abbottabad surfaced a TikTok listing identifying Jadoon Plaza Phase 2, Mandian, Abbottabad: https://www.tiktok.com/discover/cycle-shop-in-abbottabad. The previous repository also listed this area. Confirm the precise unit and hours with the shop before visiting. Search results also include similarly named businesses in other cities; their addresses, contact details and commercial claims have not been copied. The catalogue is a preview until Supabase is configured and stock is verified.

Product detail pages distinguish the listed unit configuration from researched manufacturer model-family display options. Manufacturer sources are linked on the page; display panels and optional features may vary. Where the inventory lacks a precise model or specifications, the shop must verify them before listing them as facts for an individual unit.

The homepage selects distinct brands first, then fills any remaining featured slots with distinct models. Product images use native lazy loading and a shimmer while an image is actually pending; the shop progressively adds results as the user approaches the bottom, with a Show more button as a fallback. Fast or cached images may finish too quickly for the shimmer to be noticeable.

The model-family reference section includes separately sourced, researched information beyond display for 43 of 45 inventory configurations. These summaries are not yet exhaustive: some models have only a few researched fields, and HP examples may describe a specific manufacturer SKU rather than all variants. The inventory does not identify the exact Surface or ZBook model, and the listed unit's CPU SKU, ports, storage type, battery health and other individual details must be verified. The manufacturer's linked documentation is the source for further specifications; do not treat examples as confirmed stock features.

Facebook, Instagram and TikTok links in the visit section and About page use the URLs supplied by the shop owner. They can be overridden with `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_INSTAGRAM_URL` and `NEXT_PUBLIC_TIKTOK_URL` respectively. Rebuild the site after changing these public environment variables.

### Duplicate protection and migration safety

Each listing is unique by product title, processor, RAM and storage, ignoring capitalization and repeated whitespace. Use its quantity for identical units; different RAM, storage or processors remain separate variants. The database also enforces case-insensitive, trimmed URL slugs. Migration `0002_product_uniqueness.sql` requires PostgreSQL 15 or newer and fails rather than deleting or merging any existing duplicates. Before applying it to an existing store, back up the database and check for normalized duplicate configurations and slugs; resolve any conflicts with the owner. Deploy the migration before deploying application code that relies on it. The existing slug constraint remains in place.

A failed form save keeps text inputs on screen and explains the specific issue when possible. For security and browser compatibility, reselect an image after a failed submission.

### Inventory integrity and deployments

Apply migrations in order, including `0003_inventory_integrity.sql`, **before** deploying the corresponding application. It adds product revisions, non-negative specification and discount checks, and automatic availability: when not explicitly unconfirmed, zero quantity means out of stock and a positive quantity means in stock. Existing unconfirmed availability is preserved. Audit existing data before applying; a migration constraint failure rolls back instead of changing or deleting inventory.

Product edits and deletions use a database-generated revision so a stale admin tab cannot silently overwrite or delete a newer version. If a conflict occurs, copy any unsaved text, refresh, and review the latest product. Images are intentionally not automatically deleted when a product is deleted or its photo replaced: images may be shared by other products and the product database and object storage cannot be updated atomically. Review unreferenced uploads before any manual cleanup; never remove a photo merely because one product stopped using it.
