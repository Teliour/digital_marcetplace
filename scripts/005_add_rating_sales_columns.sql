-- Add rating and sales columns to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating numeric(2,1) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sales integer DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge text;

-- Update the required_field_type check to allow more values
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_required_field_type_check;
ALTER TABLE public.products ADD CONSTRAINT products_required_field_type_check
  CHECK (required_field_type IN ('email', 'steam_login', 'steam', 'phone', 'psn', 'custom'));
