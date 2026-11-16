-- Existing rows are not selected automatically; the homepage retains its current
-- automatic selection until at least one published product is marked as featured.
alter table public.products add column is_featured boolean not null default false;
