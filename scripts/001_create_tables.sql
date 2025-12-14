-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (references auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  user_type text not null check (user_type in ('client', 'seller')),
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Create products table
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  category text not null,
  image_url text,
  required_field_type text not null check (required_field_type in ('email', 'steam_login', 'phone', 'custom')),
  required_field_label text,
  stock_quantity integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  customer_data text not null,
  amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create reviews table (optional for future)
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;

-- Profiles policies
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Products policies
create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true or seller_id = auth.uid());

create policy "Sellers can insert their own products"
  on public.products for insert
  with check (auth.uid() = seller_id);

create policy "Sellers can update their own products"
  on public.products for update
  using (auth.uid() = seller_id);

create policy "Sellers can delete their own products"
  on public.products for delete
  using (auth.uid() = seller_id);

-- Orders policies
create policy "Buyers can view their own orders"
  on public.orders for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can create orders"
  on public.orders for insert
  with check (auth.uid() = buyer_id);

create policy "Sellers can update their orders"
  on public.orders for update
  using (auth.uid() = seller_id);

-- Reviews policies
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Buyers can create reviews for their orders"
  on public.reviews for insert
  with check (auth.uid() = buyer_id);

-- Create indexes for better performance
create index if not exists idx_products_seller_id on public.products(seller_id);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_orders_buyer_id on public.orders(buyer_id);
create index if not exists idx_orders_seller_id on public.orders(seller_id);
create index if not exists idx_reviews_product_id on public.reviews(product_id);
