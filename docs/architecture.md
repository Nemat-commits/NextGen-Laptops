# NextGen Laptops — Production E-Commerce & Inventory Architecture Blueprint

**Project Name:** NextGen Laptops (Pakistan Premier Laptop Retail Platform)  
**Target Environment:** Autonomous Coding Agent connected to Git, [Supabase](https://supabase.com/docs), and [Vercel](https://vercel.com/docs)  
**Primary Objective:** Build a blazing-fast, high-craft laptop storefront and real-time admin inventory system optimized for Pakistani network conditions (3G/4G/Fiber) and low-to-mid-range mobile hardware, with zero "AI slop" design patterns.

## 1. Executive Architecture & Stack Decisions

Every technology choice in this blueprint is selected to maximize page speed on budget Android/iOS devices, minimize bandwidth usage via WebP compression, and operate comfortably within [Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) and [Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) tiers while supporting instant updates when inventory or deals change.

| Architectural Layer | Technology Selection | Role & Optimization Rationale | Official Reference |
| :--- | :--- | :--- | :--- |
| **Application Framework** | [Next.js App Router](https://nextjs.org/docs/app/getting-started) (React 19 + TypeScript) | Uses React Server Components (RSC) to ship minimal JavaScript to low-end phones while rendering product catalogs on the server. | [Next.js Docs](https://nextjs.org/docs) |
| **Deployment & Edge CDN** | [Vercel CDN](https://vercel.com/docs/cdn) + [Vercel Functions](https://vercel.com/docs/functions) | Serves cached static/ISR product pages from edge nodes closest to Pakistan and triggers instant cache invalidation on admin edits. | [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) |
| **Database & Search Engine** | [Supabase PostgreSQL](https://supabase.com/docs/guides/database/full-text-search) + [`pg_trgm`](https://www.postgresql.org/docs/current/pgtrgm.html) | Combines relational catalog storage, Row-Level Security (RLS), Full-Text Search (`tsvector`), and trigram fuzzy matching in one backend. | [Supabase FTS](https://supabase.com/docs/guides/database/full-text-search) |
| **Client Instant Search** | [Fuse.js](https://www.fusejs.io/) (~6.8 KB gzipped) | Powers zero-latency (<5 ms) typo-tolerant, case-insensitive, partial-word, and multi-token search directly in the browser without network lag. | [Fuse.js Fuzzy Search](https://www.fusejs.io/fuzzy-search.html) |
| **URL Filter State** | [`nuqs`](https://nuqs.dev/) | Syncs multi-facet filters (price, CPU, RAM, GPU, brand, stock, deals) with URL query parameters so filtered views are shareable via WhatsApp. | [nuqs Server-Side](https://nuqs.dev/docs/server-side) |
| **Authentication** | [Supabase Auth](https://supabase.com/docs/guides/auth) (`@supabase/ssr`) | Protects `/admin` routes and database write operations using HTTP-only cookie sessions verified by Next.js middleware/proxy. | [Supabase SSR Auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client) |
| **Media & Image Delivery** | [Supabase Storage](https://supabase.com/docs/guides/storage) + [`next/image`](https://nextjs.org/docs/app/api-reference/components/image) | Stores clean manufacturer photos converted to WebP prior to upload via [`browser-image-compression`](https://www.npmjs.com/package/browser-image-compression) and [`sharp`](https://www.npmjs.com/package/sharp). | [Next.js Image Optimization](https://nextjs.org/docs/app/getting-started/images) |
| **Styling & UI Primitives** | [Tailwind CSS v4](https://ui.shadcn.com/docs/tailwind-v4) + [shadcn/ui](https://ui.shadcn.com/docs) + [Lucide React](https://lucide.dev/guide/react/) | Zero-runtime CSS utility system with accessible, unbloated primitives and tree-shakable SVG icons. | [shadcn/ui Docs](https://ui.shadcn.com/docs) |

## 2. Strict Anti-Slop Design Manifesto & UI/UX System

The storefront must look like an authoritative hardware retailer (inspired by Apple Retail, Framework, and B&H Photo) rather than a generic AI template. The coding agent must enforce these rules across every component:

### 2.1 Prohibited "AI Slop" Patterns (Never Implement)
* **No Neon Gradients or Cyber Blobs:** Never use purple-to-cyan gradients, glowing neon drop shadows, floating 3D meshes, or glassmorphism cards over busy backgrounds.
* **No Heavy JS Animation Libraries:** Do not install Three.js, GSAP, Lottie, or Framer Motion on catalog/product pages. Low-end mobile GPUs throttle heavily on scroll-hijacking and blur filters (`backdrop-filter: blur()` must be avoided or restricted to simple header bars).
* **No Fake Urgency Widgets:** No fake "27 people are viewing this laptop right now" popups, spinning discount wheels, or fake countdown timers.
* **No Emoji Clutter in UI Labels:** Use crisp 1.5px stroke SVG icons from [Lucide React](https://lucide.dev/guide/react/) instead of emojis in navigation, filter headers, or spec tables.
* **No Unbounded Image Aspect Ratios:** Product cards must never jump or shift layout due to inconsistent manufacturer image dimensions.

### 2.2 Precision Hardware Aesthetic & Design Tokens
* **Color System (High-Contrast Daylight-First with Optional Slate Dark Mode):**
  * **Canvas Background:** Pure Alabaster `#FAFAFA` (`bg-neutral-50`) for page background; Pure White `#FFFFFF` (`bg-white`) for product cards and spec containers.
  * **Primary Typography:** Carbon Black `#0A0A0A` (`text-neutral-950`) for headings and prices; Slate `#525252` (`text-neutral-600`) for secondary specs.
  * **Borders & Dividers:** Crisp 1px hairlines `#E5E5E5` (`border-neutral-200`), shifting to `#171717` on active/focused inputs.
  * **Brand Accent (Derived from NextGen Shop Identity):** Deep Cobalt `#0F172A` primary action surfaces with Electric Blue `#2563EB` interactive focus/deal highlights.
  * **Semantic Status Badges:**
    * **In Stock:** `#15803D` text on `#DCFCE7` pill (`border-green-200`)
    * **Low Stock:** `#B45309` text on `#FEF3C7` pill (`border-amber-200`)
    * **Out of Stock:** `#B91C1C` text on `#FEE2E2` pill (`border-red-200`), with product card thumbnail desaturated to `opacity-75`
    * **Deal / Discount Badge:** Solid `#DC2626` or `#2563EB` pill with crisp white tabular percentage text (`SAVE 15%` or `DEAL`)
* **Typography & Numeric Discipline:**
  * Primary Sans: `Geist` or `Inter` (`font-sans`) with tight tracking (`tracking-tight`) on headings.
  * Technical Monospace: `Geist Mono` or `JetBrains Mono` (`font-mono`) for SKUs, model numbers (e.g., `82XT001NUS`), CPU codes (`i7-13700H`), and price tags.
  * **Mandatory Tabular Numerals:** Apply `tabular-nums` to all `PKR / Rs.` price displays, discount percentages, and hardware specification tables so digits align vertically across cards.
* **Product Card Image Container:**
  * Every product image sits inside an `aspect-[4/3]` container with a subtle neutral surface (`bg-neutral-100/70`), `p-4` internal breathing room, and `object-contain` alignment so clean manufacturer cutouts (HP, Dell, Lenovo, Apple, ASUS) look uniform across the entire grid.

### 2.3 Brand SVG Icon & Shop Banner Integration Pipeline
* **Custom SVG Shop Icon (`/public/brand/nextgen-logo.svg` & `/public/brand/nextgen-mark.svg`):**
  * When the user provides photos of the physical shop signage and promotional banners, extract the core geometric emblem and wordmark into a clean, scalable vector `<svg>` component (`src/components/brand/NextGenLogo.tsx`) using `currentColor` and brand accent fills (<4 KB inline SVG, zero external network request).
  * Use `nextgen-mark.svg` for `src/app/icon.svg` (favicon) and mobile header, and the full lockup for desktop navigation and footer.
* **Hero & Promotional Deal Banners:**
  * Convert user-supplied promotional banners into responsive WebP assets (`1600x600` desktop, `800x600` mobile crop) or build a hybrid HTML/CSS hero banner that overlays live database deal text and CTA buttons over the clean WebP background so text remains razor-sharp on all screen sizes and uses minimal bandwidth.

## 3. Database Schema, Indexing & Security ([Supabase PostgreSQL](https://supabase.com/docs/guides/database/full-text-search))

The agent must execute the following SQL migration in `supabase/migrations/0001_initial_schema.sql` to set up products, banners, trigram indexes, full-text search vectors, related-item scoring, and Row-Level Security (RLS).

```sql
-- 1. Enable required extensions for UUIDs and fuzzy trigram search
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Enum types for strict inventory consistency
CREATE TYPE stock_status_type AS ENUM ('in_stock', 'low_stock', 'out_of_stock');
CREATE TYPE laptop_condition_type AS ENUM ('brand_new', 'open_box', 'refurbished_a_plus', 'used_clean');

-- 3. Core Products Table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  sku TEXT UNIQUE,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,                    -- e.g., 'Lenovo', 'HP', 'Dell', 'Apple', 'ASUS', 'Acer', 'MSI'
  series TEXT,                            -- e.g., 'ThinkPad', 'Legion', 'MacBook Air', 'Victus', 'XPS'
  condition laptop_condition_type NOT NULL DEFAULT 'brand_new',
  
  -- Pricing & Deals (Stored in integer PKR for zero floating-point errors)
  price_pkr INTEGER NOT NULL CHECK (price_pkr >= 0),
  discount_price_pkr INTEGER CHECK (discount_price_pkr IS NULL OR (discount_price_pkr >= 0 AND discount_price_pkr < price_pkr)),
  is_deal BOOLEAN NOT NULL DEFAULT false,
  deal_label TEXT,                        -- e.g., 'Weekly Deal', 'Student Special', 'Clearance'
  is_featured BOOLEAN NOT NULL DEFAULT false,

  -- Inventory & Stock Control
  stock_status stock_status_type NOT NULL DEFAULT 'in_stock',
  stock_quantity INTEGER NOT NULL DEFAULT 1 CHECK (stock_quantity >= 0),
  is_published BOOLEAN NOT NULL DEFAULT true,

  -- Structured Hardware Specs for Fast Faceted Filtering
  cpu_brand TEXT NOT NULL,                -- 'Intel', 'AMD', 'Apple'
  cpu_family TEXT NOT NULL,               -- 'Core i5', 'Core i7', 'Ryzen 7', 'M3', etc.
  cpu_model TEXT NOT NULL,                -- 'i7-13620H', 'Ryzen 7 7840HS', 'M3 8-Core'
  cpu_generation TEXT,                    -- '13th Gen', '14th Gen', '7000 Series', 'M3 Series'
  ram_gb INTEGER NOT NULL,                -- 8, 16, 32, 64
  ram_type TEXT,                          -- 'DDR4', 'DDR5', 'LPDDR5X', 'Unified'
  storage_gb INTEGER NOT NULL,            -- 256, 512, 1024, 2048
  storage_type TEXT NOT NULL DEFAULT 'NVMe SSD', -- 'NVMe Gen4 SSD', 'NVMe Gen3 SSD', 'SSD'
  gpu_type TEXT NOT NULL DEFAULT 'Integrated',   -- 'Integrated' or 'Dedicated'
  gpu_model TEXT NOT NULL,                -- 'Intel Iris Xe', 'NVIDIA RTX 4060 8GB', 'AMD Radeon 780M'
  vram_gb INTEGER DEFAULT 0,              -- 0, 4, 6, 8, 12, 16
  screen_size_inches NUMERIC(3,1) NOT NULL, -- 13.3, 14.0, 15.6, 16.0, 17.3
  screen_resolution TEXT NOT NULL,        -- 'FHD (1920x1080)', 'WUXGA (1920x1200)', 'QHD+ (2560x1600)', 'Liquid Retina'
  refresh_rate_hz INTEGER NOT NULL DEFAULT 60, -- 60, 90, 120, 144, 165, 240
  panel_type TEXT,                        -- 'IPS', 'OLED', 'Mini-LED', 'TN'
  battery_wh NUMERIC(4,1),
  weight_kg NUMERIC(3,2),
  os TEXT DEFAULT 'Windows 11',
  warranty_info TEXT DEFAULT 'Check Warranty with Shop',

  -- Rich Specs & Semantic Use-Case Tags (for "anything related" search)
  use_case_tags TEXT[] NOT NULL DEFAULT '{}', -- e.g., ARRAY['gaming', 'programming', 'university', 'video editing', 'office']
  search_keywords TEXT DEFAULT '',        -- Synonym/related terms (e.g., 'coding laptop graphic design autocad light portable')
  short_highlights TEXT[] NOT NULL DEFAULT '{}', -- 3-4 bullet points for product card / top summary
  description TEXT,
  additional_specs JSONB NOT NULL DEFAULT '{}'::jsonb, -- Ports, keyboard backlight, webcam, fingerprint, charger wattage

  -- Clean WebP Media Assets (Stored in Supabase Storage)
  thumbnail_url TEXT NOT NULL,
  gallery_urls TEXT[] NOT NULL DEFAULT '{}',

  -- Precomputed Search Column for Trigram & Substring Matching
  searchable_text TEXT GENERATED ALWAYS AS (
    lower(
      coalesce(title, '') || ' ' ||
      coalesce(brand, '') || ' ' ||
      coalesce(series, '') || ' ' ||
      coalesce(sku, '') || ' ' ||
      coalesce(cpu_brand, '') || ' ' ||
      coalesce(cpu_family, '') || ' ' ||
      coalesce(cpu_model, '') || ' ' ||
      coalesce(cpu_generation, '') || ' ' ||
      coalesce(ram_gb::text || 'gb ram ' || coalesce(ram_type, ''), '') || ' ' ||
      coalesce(storage_gb::text || 'gb ' || coalesce(storage_type, ''), '') || ' ' ||
      coalesce(gpu_type, '') || ' ' ||
      coalesce(gpu_model, '') || ' ' ||
      coalesce(screen_size_inches::text || ' inch ' || coalesce(screen_resolution, '') || ' ' || refresh_rate_hz::text || 'hz', '') || ' ' ||
      coalesce(deal_label, '') || ' ' ||
      coalesce(search_keywords, '')
    )
  ) STORED,

  -- Precomputed Weighted Full-Text Search Vector
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(brand, '') || ' ' || coalesce(series, '') || ' ' || coalesce(sku, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(cpu_family, '') || ' ' || coalesce(cpu_model, '') || ' ' || coalesce(gpu_model, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(search_keywords, '') || ' ' || coalesce(description, '')), 'C')
  ) STORED,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Promotional Banners Table (Manageable from Admin)
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  badge_text TEXT,
  cta_text TEXT DEFAULT 'Shop Deals',
  cta_link TEXT DEFAULT '/?deals=true',
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. High-Performance Indexes for Instant Filtering & Search
CREATE INDEX idx_products_published_stock ON public.products (is_published, stock_status);
CREATE INDEX idx_products_brand ON public.products (brand);
CREATE INDEX idx_products_price ON public.products (COALESCE(discount_price_pkr, price_pkr));
CREATE INDEX idx_products_is_deal ON public.products (is_deal) WHERE is_deal = true;
CREATE INDEX idx_products_ram_storage ON public.products (ram_gb, storage_gb);
CREATE INDEX idx_products_cpu_family ON public.products (cpu_family);
CREATE INDEX idx_products_gpu_type ON public.products (gpu_type);
CREATE INDEX idx_products_use_case_tags ON public.products USING GIN (use_case_tags);
CREATE INDEX idx_products_search_vector ON public.products USING GIN (search_vector);
CREATE INDEX idx_products_searchable_trgm ON public.products USING GIN (searchable_text gin_trgm_ops);

-- 6. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 7. Row-Level Security (RLS) Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public users can read published products and active banners
CREATE POLICY "Public can view published products"
  ON public.products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view active banners"
  ON public.banners FOR SELECT
  USING (is_active = true);

-- Authenticated Admin users have full CRUD access
CREATE POLICY "Admins have full access to products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins have full access to banners"
  ON public.banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

## 4. "Ultimate" Search & Universal Filter Engine

The user explicitly requested a search bar that works regardless of uppercase/lowercase spelling, partial words, typos, or related concepts, paired with a filter that can slice any item attribute shown.

### 4.1 Dual-Layer Search Architecture

#### Layer 1: Zero-Latency Client Index ([Fuse.js](https://www.fusejs.io/))
Because laptop shop inventories typically range from 30 to 500 active SKUs, the storefront prefetches a compact JSON catalog payload (~15–40 KB compressed) via React Server Components and initializes a [Fuse.js](https://www.fusejs.io/token-search.html) instance on the client:
* **Configuration:**
  * `isCaseSensitive: false` (handles any uppercase/lowercase combination automatically).
  * `ignoreLocation: true` (matches partial words anywhere in the string, e.g., `"13620"` inside `"Intel Core i7-13620H"`).
  * `useTokenSearch: true` and `threshold: 0.35` (splits multi-word queries like `"lenvo i7 16gb gaming"` into tokens, tolerates spelling mistakes via the Bitap algorithm, and ranks items across multiple fields).
  * `minMatchCharLength: 2` (starts showing instant results from the 2nd character typed).
* **Weighted Search Keys:**
  * `title` (weight `2.0`), `brand` (weight `1.8`), `series` (weight `1.8`), `cpu_model` & `cpu_family` (weight `1.5`), `gpu_model` (weight `1.5`), `use_case_tags` (weight `1.4`), `search_keywords` (weight `1.3`), `ram_gb` & `storage_gb` (weight `1.2`), `sku` (weight `1.0`).
* **Synonym & Intent Expansion Dictionary (`src/lib/search-synonyms.ts`):**
  * Automatically expands common Pakistani buyer queries before matching:
    * `"coding"` / `"programming"` / `"cs"` / `"uni"` $\rightarrow$ matches `use_case_tags` containing `programming`, `university`, `16GB` RAM, `Core i5`/`i7`/`Ryzen 5`/`7`.
    * `"editing"` / `"premiere"` / `"blender"` / `"3d"` $\rightarrow$ matches `Dedicated` GPU (`RTX`), `16GB+` RAM, high-color displays.
    * `"mac"` / `"apple"` $\rightarrow$ matches `Apple`, `MacBook`, `M1`, `M2`, `M3`, `M4`.
    * `"1tb"` $\rightarrow$ matches `1024` `storage_gb` as well as `"1TB"` text.

#### Layer 2: Database-Level Hybrid Search RPC ([PostgreSQL `pg_trgm`](https://www.postgresql.org/docs/current/pgtrgm.html) + [Full-Text Search](https://supabase.com/docs/guides/database/full-text-search))
For server-rendered search URLs (`/?q=...`) and deep catalog scalability, create this PostgreSQL RPC function in Supabase:

```sql
CREATE OR REPLACE FUNCTION public.search_and_filter_laptops(
  p_query TEXT DEFAULT NULL,
  p_brands TEXT[] DEFAULT NULL,
  p_conditions laptop_condition_type[] DEFAULT NULL,
  p_cpu_families TEXT[] DEFAULT NULL,
  p_ram_gb INTEGER[] DEFAULT NULL,
  p_storage_gb INTEGER[] DEFAULT NULL,
  p_gpu_type TEXT DEFAULT NULL,
  p_min_price INTEGER DEFAULT NULL,
  p_max_price INTEGER DEFAULT NULL,
  p_only_deals BOOLEAN DEFAULT false,
  p_in_stock_only BOOLEAN DEFAULT false,
  p_use_case TEXT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'featured'
)
RETURNS SETOF public.products
LANGUAGE sql
STABLE
AS $$
  SELECT p.*
  FROM public.products p
  WHERE p.is_published = true
    AND (
      p_query IS NULL OR btrim(p_query) = ''
      OR p.search_vector @@ websearch_to_tsquery('simple', lower(p_query))
      OR p.searchable_text ILIKE '%' || lower(btrim(p_query)) || '%'
      OR word_similarity(lower(btrim(p_query)), p.searchable_text) > 0.35
      OR lower(btrim(p_query)) = ANY(p.use_case_tags)
    )
    AND (p_brands IS NULL OR p.brand = ANY(p_brands))
    AND (p_conditions IS NULL OR p.condition = ANY(p_conditions))
    AND (p_cpu_families IS NULL OR p.cpu_family = ANY(p_cpu_families))
    AND (p_ram_gb IS NULL OR p.ram_gb = ANY(p_ram_gb))
    AND (p_storage_gb IS NULL OR p.storage_gb = ANY(p_storage_gb))
    AND (p_gpu_type IS NULL OR p.gpu_type = p_gpu_type)
    AND (p_min_price IS NULL OR COALESCE(p.discount_price_pkr, p.price_pkr) >= p_min_price)
    AND (p_max_price IS NULL OR COALESCE(p.discount_price_pkr, p.price_pkr) <= p_max_price)
    AND (NOT p_only_deals OR (p.is_deal = true OR p.discount_price_pkr IS NOT NULL))
    AND (NOT p_in_stock_only OR p.stock_status IN ('in_stock', 'low_stock'))
    AND (p_use_case IS NULL OR lower(p_use_case) = ANY(p.use_case_tags))
  ORDER BY
    -- Always keep in-stock items above out-of-stock items unless searching specifically
    CASE WHEN p.stock_status = 'out_of_stock' THEN 1 ELSE 0 END ASC,
    -- Relevance score when query is active
    CASE WHEN p_query IS NOT NULL AND btrim(p_query) <> ''
      THEN GREATEST(
        ts_rank(p.search_vector, websearch_to_tsquery('simple', lower(p_query))),
        word_similarity(lower(btrim(p_query)), p.searchable_text)
      )
      ELSE 0
    END DESC,
    -- Dynamic Sorting
    CASE WHEN p_sort_by = 'price_asc' THEN COALESCE(p.discount_price_pkr, p.price_pkr) END ASC,
    CASE WHEN p_sort_by = 'price_desc' THEN COALESCE(p.discount_price_pkr, p.price_pkr) END DESC,
    CASE WHEN p_sort_by = 'discount_desc' THEN (p.price_pkr - COALESCE(p.discount_price_pkr, p.price_pkr)) END DESC,
    CASE WHEN p_sort_by = 'featured' AND p.is_featured THEN 0 ELSE 1 END ASC,
    p.created_at DESC;
$$;
```

### 4.2 Universal Multi-Facet Filter Architecture
Managed via [`nuqs`](https://nuqs.dev/) so every filter updates the URL query string (`?brand=Lenovo,HP&ram=16&deals=true&inStock=true&maxPrice=250000`) without full page reloads:

| Filter Facet | UI Control Type | Dynamic Behavior |
| :--- | :--- | :--- |
| **Quick Filter Pills (Top Bar)** | Horizontal Scrollable Chips | One-tap toggles for `Hot Deals`, `In Stock Only`, `Gaming RTX`, `Programming / Uni`, `MacBooks`, `Under Rs. 100k`, `Brand New`. |
| **Stock Status** | Switch Toggle | `Hide Out of Stock` (shows total count of available machines). |
| **Price Range (PKR)** | Dual-Thumb Slider + Quick Presets | Min/Max inputs in PKR plus one-tap presets (`< 60k`, `60k–120k`, `120k–200k`, `200k+`). |
| **Brand** | Multi-Select Checkboxes with Counts | Dynamically computed item counts per brand (`Lenovo (14)`, `HP (19)`, `Dell (11)`, `Apple (6)`). |
| **Condition** | Segmented Pills / Checkboxes | `Brand New (Box Pack)`, `Open Box`, `Imported A+ Grade`. |
| **Processor (CPU)** | Grouped Checkboxes | `Intel Core i3/i5/i7/i9/Ultra`, `AMD Ryzen 5/7/9`, `Apple M1/M2/M3/M4`. |
| **RAM & Storage** | Pill Grid | RAM: `8GB`, `16GB`, `32GB`, `64GB` \| Storage: `256GB`, `512GB`, `1TB`, `2TB`. |
| **Graphics (GPU)** | Toggle + Model Checkboxes | `Integrated` vs `Dedicated GPU` (`RTX 3050`, `RTX 4050`, `RTX 4060`, `RTX 4070+`). |
| **Display Specs** | Checkboxes | Screen Size (`13"-14"`, `15.6"`, `16"+`) & Refresh Rate (`60Hz`, `120Hz+`, `144Hz/165Hz+`). |

* **Mobile Filter UX:** On screens `< 768px`, filters live inside a smooth bottom drawer (`vaul` / [shadcn/ui](https://ui.shadcn.com/docs) `Sheet`) with a sticky bottom bar showing `"Show [X] Matching Laptops"` and a `"Reset All"` button.

## 5. Product Detail Page (`/laptops/[slug]`) & Scroll-Triggered Related Items

Every laptop has a dedicated, statically cached route (`/laptops/[slug]`) that loads instantaneously and streams related items as the user scrolls.

### 5.1 Above-the-Fold Product Detail Layout
1. **Breadcrumb Navigation:** `Home / Laptops / [Brand] / [Series] / [Model Title]`
2. **Left Column — Clean WebP Media Gallery:**
   * Primary `aspect-[4/3]` stage using [`next/image`](https://nextjs.org/docs/app/api-reference/components/image) with `priority={true}` for the main image and `sizes="(max-width: 768px) 100vw, 50vw"`.
   * Thumbnail strip below supporting tap/click switching and lightweight CSS zoom-on-hover (desktop) or swipe (mobile).
3. **Right Column — Commercial Buy Box & Key Highlights:**
   * **Badges Row:** Condition badge (`Brand New` / `Imported A+`), Stock Status badge (`In Stock` / `Low Stock — Only 2 Left` / `Out of Stock`), and Deal badge (`SAVE Rs. 18,000` / `12% OFF`).
   * **Title & SKU:** Full laptop title + monospace SKU/Model ID.
   * **PKR Pricing Block:** Large tabular current price (`Rs. 185,000`), strikethrough original price (`Rs. 203,000`) if discounted, and net savings pill.
   * **4-Grid Hardware Summary Cards:** Quick visual pills for **Processor**, **RAM**, **Storage**, and **Display/GPU**.
   * **Primary Conversion CTAs (Tailored for Pakistan):**
     * **Primary Button (`In Stock`):** **"Buy / Inquire on WhatsApp"** — Opens `https://wa.me/<SHOP_WHATSAPP_NUMBER>?text=...` pre-populated with:
       `"Assalam-o-Alaikum NextGen Laptops! I want to inquire about: [Title] (SKU: [SKU]) listed at Rs. [Effective Price]. Link: [Canonical URL]"`
     * **Secondary Button (`Out of Stock`):** **"Notify / Ask for Similar on WhatsApp"** — Lets the buyer ask the shop owner when restock arrives or request a similar unit.
     * **Copy Spec Sheet Link Button:** One-click copy link for sharing with friends/family.
4. **Full Technical Specification Table:**
   * Clean 2-column striped hardware table covering Processor, Memory, Storage, Display, Graphics, Ports & Connectivity, Battery & Power, Physical Dimensions, Condition, and Shop Warranty.

### 5.2 Scroll-Triggered Related Laptops Engine
As the user scrolls past the specification table, a client `IntersectionObserver` wrapper (`src/components/laptop/RelatedLaptopsSection.tsx`, with `rootMargin: "250px"`) triggers loading of the **Similar & Related Laptops** carousel/grid, backed by a similarity-scoring PostgreSQL RPC:

```sql
CREATE OR REPLACE FUNCTION public.get_related_laptops(
  p_product_id UUID,
  p_limit INTEGER DEFAULT 6
)
RETURNS SETOF public.products
LANGUAGE sql
STABLE
AS $$
  WITH current_item AS (
    SELECT
      id, brand, series, cpu_family, gpu_type, ram_gb, use_case_tags,
      COALESCE(discount_price_pkr, price_pkr) AS effective_price
    FROM public.products
    WHERE id = p_product_id
  )
  SELECT p.*
  FROM public.products p
  CROSS JOIN current_item c
  WHERE p.id <> c.id
    AND p.is_published = true
  ORDER BY
    -- 1. Prioritize In-Stock machines first
    CASE WHEN p.stock_status = 'out_of_stock' THEN 1 ELSE 0 END ASC,
    -- 2. Composite similarity score
    (
      -- Same price bracket (+/- 25%) = +40 pts
      CASE WHEN COALESCE(p.discount_price_pkr, p.price_pkr)
                BETWEEN (c.effective_price * 0.75) AND (c.effective_price * 1.25)
           THEN 40 ELSE 0 END +
      -- Shared use-case tags (e.g. both gaming or both programming) = +30 pts
      CASE WHEN p.use_case_tags && c.use_case_tags THEN 30 ELSE 0 END +
      -- Same GPU class (Integrated vs Dedicated) = +20 pts
      CASE WHEN p.gpu_type = c.gpu_type THEN 20 ELSE 0 END +
      -- Same Brand or Series = +15 pts
      CASE WHEN p.brand = c.brand THEN 15 ELSE 0 END +
      -- Same RAM capacity = +10 pts
      CASE WHEN p.ram_gb = c.ram_gb THEN 10 ELSE 0 END +
      -- Bonus for active deal = +5 pts
      CASE WHEN p.is_deal = true OR p.discount_price_pkr IS NOT NULL THEN 5 ELSE 0 END
    ) DESC,
    ABS(COALESCE(p.discount_price_pkr, p.price_pkr) - c.effective_price) ASC
  LIMIT p_limit;
$$;
```

## 6. Admin Dashboard (`/admin`) & Automated WebP Image Pipeline

The shop owner must be able to add, edit, discount, mark out of stock, or remove laptops from a phone or PC in under 60 seconds without touching code.

### 6.1 Security & Access Control
* **Authentication:** Email + Password login via [Supabase Auth](https://supabase.com/docs/guides/auth/quickstarts/nextjs) at `/admin/login` (public sign-up disabled in Supabase Dashboard; only shop owner and authorized admin emails added).
* **Route Protection:** `src/middleware.ts` (or Next.js proxy) validates the session via `@supabase/ssr` `supabase.auth.getUser()` on every `/admin/*` route and Server Action.

### 6.2 Fast Admin Capabilities
1. **Quick Inventory Table (`/admin/products`):**
   * Instant search bar to locate any laptop by name or SKU.
   * **1-Click Stock Status Toggle:** Inline dropdown/buttons on every row to flip between `In Stock`, `Low Stock`, and `Out of Stock` immediately via optimistic UI + Server Action.
   * **1-Click Deal & Discount Editor:** Inline popover to enter a `Discount Price (PKR)`, toggle the `Hot Deal` badge, or set a custom `Deal Label` (e.g., `"Eid Sale"`, `"Student Offer"`), automatically calculating and displaying the `% OFF` badge.
   * **1-Click Delete / Unpublish:** Soft hide (`is_published = false`) or permanent delete (which also removes associated WebP files from [Supabase Storage](https://supabase.com/docs/guides/storage)).
2. **Add / Edit Laptop Form (`/admin/products/new` & `/admin/products/[id]`):**
   * Smart presets for common CPUs, GPUs, RAM (`8GB`, `16GB`, `32GB`), and Storage (`256GB`, `512GB`, `1TB`) so the admin can tap buttons instead of typing everything manually on a phone.
   * Auto-generates clean URL `slug` from `Brand + Series + Model + CPU + RAM + Storage` (e.g., `lenovo-legion-5-i7-13620h-16gb-512gb-rtx-4060`).
3. **Banner & Deal Bar Manager (`/admin/banners`):**
   * Upload or toggle shop promotional banners and set the click-through filter URL.
4. **Bulk Seed / JSON & CSV Importer (`/admin/import` + `scripts/seed-inventory.ts`):**
   * Allows the coding agent (or shop owner) to import the initial list of laptops in a single batch.

### 6.3 Zero-Bloat WebP Image Pipeline
To guarantee blazing speed and avoid burning Supabase Storage bandwidth:
1. **Client-Side Pre-Upload Conversion:** When the admin selects official product images (PNG/JPG/WebP) in `/admin/products/new`, the browser runs [`browser-image-compression`](https://www.npmjs.com/package/browser-image-compression) (`fileType: 'image/webp'`, `maxWidthOrHeight: 1400`, `maxSizeMB: 0.18`, `initialQuality: 0.84`, `useWebWorker: true`).
2. **Result:** Every 3–5 MB manufacturer PNG is converted to a crystal-clear **60–140 KB `.webp`** file *before* it ever uploads to the `product-images` public bucket in [Supabase Storage](https://supabase.com/docs/guides/storage).
3. **Cache Headers & Delivery:** Upload with `cacheControl: '31536000'` (1 year immutable cache) and render through [`next/image`](https://nextjs.org/docs/app/api-reference/components/image) with responsive `sizes` and automatic lazy-loading (`loading="lazy"` on grid cards, `priority` only on the top hero/LCP image).
4. **Instant Cache Revalidation:** Every Admin Server Action (`createProduct`, `updateProduct`, `toggleStockStatus`, `deleteProduct`) calls Next.js `revalidatePath('/')`, `revalidatePath('/laptops/[slug]')`, and `revalidateTag('products')` so changes appear live across the entire website within 1 second.

## 7. Low-End Device & Pakistan Network Performance Budgets

Many shoppers in Pakistan browse on budget Android phones over variable 4G connections. The agent must enforce these engineering budgets:

| Performance Metric / Target | Strict Engineering Budget | Implementation Mechanism |
| :--- | :--- | :--- |
| **First Load JS (Storefront)** | `< 90 KB` gzipped | Keep catalog pages as React Server Components; load admin libraries only under `/admin/*` dynamic imports. |
| **Product Thumbnail Weight** | `< 45 KB` per card (`400x300` WebP) | Use [`next/image`](https://nextjs.org/docs/app/api-reference/components/image) `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"` and `quality={80}`. |
| **Main Thread Frame Rate** | Locked `60 FPS` scroll on budget CPUs | Use CSS `content-visibility: auto` on below-the-fold product grid rows; zero JS scroll listeners; CSS-only hover effects. |
| **Search Input Responsiveness** | `< 16 ms` input latency (INP) | Update input text synchronously; run [Fuse.js](https://www.fusejs.io/) filtering inside React `useTransition` or a `120ms` debounce so typing never stutters. |
| **Database Cold-Start Elimination** | `0 ms` DB wait on cached views | Serve `/Init` and `/laptops/[slug]` via Next.js Incremental Static Regeneration (ISR) backed by [Vercel CDN](https://vercel.com/docs/cdn) + on-demand `revalidateTag('products')`. |

## 8. Future-Ready SEO Hooks (Pre-Wired Without Extra Scope)

While full SEO campaigns will be executed in a future phase, the agent must build the structural foundation cleanly now so zero refactoring is required later:
* **Clean Semantic HTML5:** Proper `<header>`, `<main>`, `<section>`, `<article>`, and a single `<h1>` per page.
* **Human-Readable Slugs:** `/laptops/hp-victus-15-i5-13420h-16gb-512gb-rtx-3050` instead of `/product?id=123`.
* **Dynamic `generateMetadata` in `/laptops/[slug]/page.tsx`:** Automatically populates `<title>`, `<meta name="description">`, and OpenGraph tags (`og:title`, `og:image`, `og:price:amount` in `PKR`) so whenever a laptop link is pasted into **WhatsApp**, **Instagram**, or **Facebook**, a rich preview card with the laptop photo, specs, and PKR price appears automatically.

## 9. Repository File & Directory Blueprint

The coding agent should initialize the repository following this exact [Next.js App Router](https://nextjs.org/docs/app/getting-started/project-structure) structure:

```text
nextgen-laptops/
├── public/
│   └── brand/
│       ├── nextgen-logo.svg          # Full SVG shop logo (generated from shop banner/signage)
│       ├── nextgen-mark.svg          # Compact SVG icon mark for mobile & favicon
│       └── banners/                  # Optimized WebP promotional banners
├── supabase/
│   ├── migrations/
│   │   └── 0001_initial_schema.sql   # Full Postgres schema, indexes, RLS, and RPCs
│   └── seed.sql                      # Optional SQL seed
├── scripts/
│   └── seed-inventory.ts             # CLI script for agent to bulk-insert initial laptop list
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (Geist fonts, NuqsAdapter, clean header/footer)
│   │   ├── page.tsx                  # Storefront Home (Hero deals, Instant Search + Universal Filter Grid)
│   │   ├── laptops/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # Product Detail Page (SSR/ISR + generateMetadata + Spec Table)
│   │   │       └── loading.tsx       # Lightweight skeleton loader
│   │   ├── deals/
│   │   │   └── page.tsx              # Dedicated Hot Deals & Discounted Laptops view
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.tsx          # Supabase Auth Admin Sign-In
│   │       ├── layout.tsx            # Protected Admin Shell
│   │       ├── page.tsx              # Inventory Overview (Total items, In Stock, Out of Stock, Deals)
│   │       ├── products/
│   │       │   ├── page.tsx          # Fast Inventory Table (1-click stock & discount toggles)
│   │       │   ├── new/page.tsx      # Add Laptop Form with client WebP compression
│   │       │   └── [id]/page.tsx     # Edit Laptop Form
│   │       └── banners/
│   │           └── page.tsx          # Banner & Promotional Strip Manager
│   ├── actions/
│   │   ├── product-actions.ts        # Server Actions (CRUD, stock toggle, discount update + revalidateTag)
│   │   └── banner-actions.ts         # Server Actions for promotional banners
│   ├── components/
│   │   ├── brand/
│   │   │   └── NextGenLogo.tsx       # Inline SVG shop logo component
│   │   ├── catalog/
│   │   │   ├── UltimateSearchBar.tsx # Fuse.js instant search + synonym expansion + keyboard nav
│   │   │   ├── FilterSidebar.tsx     # Desktop facet sidebar + Mobile bottom Sheet drawer
│   │   │   ├── QuickFilterPills.tsx  # Horizontal 1-tap category/price/deal chips
│   │   │   ├── ProductCard.tsx       # Anti-slop hardware card (tabular PKR price, specs, stock pill)
│   │   │   └── ProductGrid.tsx       # Responsive 2-col (mobile) to 4-col (desktop) grid
│   │   ├── laptop/
│   │   │   ├── ProductGallery.tsx    # Clean WebP image switcher
│   │   │   ├── SpecTable.tsx         # Structured hardware specification table
│   │   │   ├── WhatsAppOrderButton.tsx # Pre-filled WhatsApp inquiry generator
│   │   │   └── RelatedLaptopsSection.tsx # IntersectionObserver lazy-loaded related items
│   │   └── admin/
│   │       ├── WebpImageUploader.tsx # browser-image-compression -> Supabase Storage uploader
│   │       ├── QuickStockToggle.tsx  # Optimistic 1-click stock status switcher
│   │       └── QuickDiscountPopover.tsx # 1-click deal & discount price editor
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # RSC / Server Action Supabase client (@supabase/ssr)
│   │   │   └── admin.ts              # Service-role client for seed script only
│   │   ├── search-engine.ts          # Fuse.js configuration & synonym dictionary
│   │   ├── filter-params.ts          # nuqs type-safe URL query parsers
│   │   └── formatters.ts             # PKR currency formatter (Rs. 185,000) & discount % calculator
│   └── types/
│       └── database.ts               # TypeScript interfaces matching public.products & public.banners
├── middleware.ts                     # Supabase Auth session refresh & /admin route guard
├── next.config.ts                    # Supabase Storage remotePatterns & image formats: ['image/avif', 'image/webp']
└── package.json
```

## 10. Environment Variables & Configuration (`next.config.ts`)

### 10.1 Required Environment Variables (`.env.local` & Vercel Project Settings)
```ini
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-for-seeding-only>
NEXT_PUBLIC_SHOP_WHATSAPP=923000000000
NEXT_PUBLIC_SITE_URL=https://nextgenlaptops.vercel.app
```

### 10.2 `next.config.ts` Image Optimization Setup
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
```

## 11. Step-by-Step Execution Sequence for the Coding Agent

When the user hands this file to the coding agent along with the shop banners/photos and initial laptop list, the agent must execute in this exact order:

1. **Step 1 — Scaffold & Dependencies:** Initialize [Next.js App Router](https://nextjs.org/docs/app/getting-started/installation) with TypeScript and [Tailwind CSS v4](https://ui.shadcn.com/docs/tailwind-v4). Install `@supabase/supabase-js`, `@supabase/ssr`, `fuse.js`, `nuqs`, `lucide-react`, and `browser-image-compression`.
2. **Step 2 — Database & Storage Provisioning:** Apply `supabase/migrations/0001_initial_schema.sql` to create the `products` and `banners` tables, `pg_trgm` and GIN indexes, RLS policies, and the `search_and_filter_laptops` and `get_related_laptops` RPC functions. Create a public Supabase Storage bucket named `product-images` with authenticated insert/update/delete policies.
3. **Step 3 — Brand SVG & Visual Assets:** Inspect the user-provided shop photos and banners, craft the clean vector logo (`src/components/brand/NextGenLogo.tsx` and `public/brand/nextgen-logo.svg`), and compress promotional banners into WebP.
4. **Step 4 — Storefront, Search & Filter Implementation:** Build the anti-slop hardware storefront (`src/app/page.tsx`), wiring up `UltimateSearchBar.tsx` ([Fuse.js](https://www.fusejs.io/) + synonym map) and `FilterSidebar.tsx` ([`nuqs`](https://nuqs.dev/) URL state) with 2-column mobile / 4-column desktop `ProductCard` grids.
5. **Step 5 — Product Detail Page & Scroll-Triggered Related Items:** Build `/laptops/[slug]/page.tsx` with [`next/image`](https://nextjs.org/docs/app/api-reference/components/image) WebP gallery, full specification table, WhatsApp inquiry integration, and `RelatedLaptopsSection.tsx` powered by `get_related_laptops`.
6. **Step 6 — Protected Admin Portal:** Build `/admin` with [Supabase Auth](https://supabase.com/docs/guides/auth/quickstarts/nextjs), 1-click stock status toggles, 1-click discount/deal editors, client-side WebP uploader, and automatic `revalidateTag('products')` / `revalidatePath` hooks.
7. **Step 7 — Initial Inventory Seeding & Verification:** Parse the user's provided laptop inventory list, source clean official manufacturer images converted to WebP, run `scripts/seed-inventory.ts` to populate Supabase, and verify build/deployment on [Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).
