-- No product data is modified. The migration fails safely if duplicates exist;
-- review and resolve them manually before applying it. PostgreSQL 15+ is required.
begin;

-- One listing represents a model/configuration; use quantity for identical units.
-- Case and runs of whitespace do not distinguish names or processors.
create unique index products_unique_configuration on public.products (
  lower(btrim(regexp_replace(title, '[[:space:]]+', ' ', 'g'))),
  lower(btrim(regexp_replace(cpu, '[[:space:]]+', ' ', 'g'))),
  ram_gb,
  storage_gb
) nulls not distinct;

-- Preserve the existing slug constraint, and also guard against case/space variants
-- written outside the admin form.
create unique index products_slug_normalized_key on public.products (lower(btrim(slug)));

commit;
