create or replace function increment_sales(product_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update products
  set sales = coalesce(sales, 0) + 1
  where id = product_id;
end;
$$;
