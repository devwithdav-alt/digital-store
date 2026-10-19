create extension if not exists pgcrypto;
create table settings(key text primary key, value jsonb not null, updated_at timestamptz default now());
create table categories(id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, image_url text, sort int default 0);
create table products(id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, category_id uuid references categories(id),
 brand text, price numeric(10,2) not null check(price>=0), compare_price numeric(10,2), stock int not null default 0 check(stock>=0),
 images text[] default '{}', colors jsonb default '[]', sizes jsonb default '[]', description text, specs jsonb default '{}', tags text[] default '{}',
 featured boolean default false, active boolean default true, created_at timestamptz default now());
create table discounts(id uuid primary key default gen_random_uuid(), name text, code text unique, scope text check(scope in('cart','item')) not null,
 kind text check(kind in('percent','fixed')) not null, value numeric(10,2) not null check(value>0), min_qty int default 1, min_subtotal numeric(10,2) default 0,
 product_ids uuid[] default '{}', starts_at timestamptz, ends_at timestamptz, active boolean default true);
create table pickup_locations(id uuid primary key default gen_random_uuid(), name text, address text, hours text, active boolean default true);
create table orders(id uuid primary key default gen_random_uuid(), short_id text unique not null, name text not null, email text not null, phone text not null, phone2 text,
 method text check(method in('delivery','pickup')) not null, address text, city text, region text, pickup_date date, pickup_location_id uuid references pickup_locations(id),
 items jsonb not null, subtotal numeric(10,2), discount_total numeric(10,2), delivery_fee numeric(10,2), total numeric(10,2),
 payment text check(payment in('paystack','momo','whatsapp')), status text default 'pending', paystack_ref text, notes text, created_at timestamptz default now());
create table admins(user_id uuid primary key references auth.users(id));
create or replace function is_admin() returns boolean language sql security definer stable as $$ select exists(select 1 from admins where user_id=auth.uid()) $$;
alter table settings enable row level security; alter table categories enable row level security; alter table products enable row level security;
alter table discounts enable row level security; alter table pickup_locations enable row level security; alter table orders enable row level security; alter table admins enable row level security;
create policy "public read" on settings for select using(true);
create policy "public read" on categories for select using(true);
create policy "public read active" on products for select using(active or is_admin());
create policy "public read" on pickup_locations for select using(active or is_admin());
create policy "admin all" on settings for all using(is_admin()) with check(is_admin());
create policy "admin all" on categories for all using(is_admin()) with check(is_admin());
create policy "admin all" on products for all using(is_admin()) with check(is_admin());
create policy "admin all" on discounts for all using(is_admin()) with check(is_admin());
create policy "admin all" on pickup_locations for all using(is_admin()) with check(is_admin());
create policy "admin all" on orders for all using(is_admin()) with check(is_admin());
-- orders and discounts have no public insert or read: the server route validates, re-prices the cart and writes with the service role
insert into storage.buckets(id,name,public) values('media','media',true) on conflict do nothing;
create policy "media read" on storage.objects for select using(bucket_id='media');
create policy "media admin write" on storage.objects for all using(bucket_id='media' and is_admin()) with check(bucket_id='media' and is_admin());
insert into settings(key,value) values
('brand','{"name":"Digital Store","tagline":"We add care in electronic product","logo_url":"/logo.png"}'),
('theme','{"base":"#FFFFFF","surface":"#F4F6F9","text":"#333333","primary":"#0066CC","dark":"#000000","cta":"#FF6A00","accent":"#19D3E6","danger":"#D92D20"}'),
('contact','{"phone":"+233 00 000 0000","whatsapp":"233000000000","email":"hello@digitalstore.demo","address":"Accra, Ghana"}'),
('payments','{"banners":[],"momo_number":"","momo_name":""}');
