-- Admin access is explicitly granted per user, not to every authenticated account.
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create table public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admin_users enable row level security;
create policy "admin reads own membership" on public.admin_users for select to authenticated using (user_id = auth.uid());
create function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.admin_users where user_id = auth.uid()) $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
create table public.categories (id text primary key default gen_random_uuid()::text, name text not null unique, slug text not null unique);
create table public.products (
 id text primary key default gen_random_uuid()::text, slug text not null unique, title text not null, brand text not null default '', category_id text not null references public.categories(id), cpu text not null default '', ram_gb integer, storage_gb integer,
 quantity integer not null default 0 check (quantity >= 0), price_pkr integer check (price_pkr >= 0), discount_price_pkr integer check (discount_price_pkr >= 0 and discount_price_pkr < price_pkr), stock_status text not null default 'unconfirmed' check (stock_status in ('unconfirmed','in_stock','low_stock','out_of_stock')), is_published boolean not null default false, description text not null default '', image_url text, image_source text, condition text, extra_specs jsonb not null default '{}', source_rows integer[], created_at timestamptz not null default now()
);
create index products_title_trgm on public.products using gin (title gin_trgm_ops);
create index products_category on public.products(category_id);
alter table public.categories enable row level security;
alter table public.products enable row level security;
create policy "public categories" on public.categories for select using (true);
create policy "public products" on public.products for select using (is_published or public.is_admin());
create policy "admin categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
insert into public.categories (id,name,slug) values ('laptops','Laptops','laptops');
-- Product images are publicly readable; only allowlisted admins can upload or manage them.
insert into storage.buckets (id,name,public) values ('product-images','product-images',true) on conflict (id) do nothing;
create policy "public product images" on storage.objects for select using (bucket_id='product-images');
create policy "admin image management" on storage.objects for all to authenticated using (bucket_id='product-images' and public.is_admin()) with check (bucket_id='product-images' and public.is_admin());
