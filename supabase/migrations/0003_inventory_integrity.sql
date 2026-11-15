-- Deploy before the application code. The migration fails without changing inventory
-- if existing records violate these constraints; review them before applying.
begin;
alter table public.products
 add column revision uuid not null default gen_random_uuid(),
 add constraint products_ram_nonnegative check (ram_gb is null or ram_gb >= 0),
 add constraint products_storage_nonnegative check (storage_gb is null or storage_gb >= 0),
 add constraint products_discount_requires_price check (discount_price_pkr is null or (price_pkr is not null and discount_price_pkr >= 0 and discount_price_pkr < price_pkr));

-- Unconfirmed stays explicitly unconfirmed; otherwise quantity determines availability.
-- A new revision for every update lets the admin reject stale edits atomically.
create function public.products_set_integrity() returns trigger
language plpgsql set search_path = public as $$
begin
 if new.stock_status <> 'unconfirmed' then
  new.stock_status := case when new.quantity = 0 then 'out_of_stock' else 'in_stock' end;
 end if;
 if tg_op = 'UPDATE' then new.revision := gen_random_uuid(); end if;
 return new;
end;
$$;
create trigger products_set_integrity before insert or update on public.products
for each row execute function public.products_set_integrity();
commit;
