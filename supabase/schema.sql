-- INDIVYA application tables and owner-scoped policies.
-- Review this script against an existing production schema before applying it.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Traveller',
  onboarding_complete boolean not null default false,
  language text not null default 'en'
    check (language in ('en', 'hi', 'te', 'ta', 'kn', 'ml', 'bn', 'mr')),
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist (
  user_id uuid not null references auth.users (id) on delete cascade,
  destination_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, destination_id)
);

alter table public.profiles enable row level security;
alter table public.wishlist enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can read own wishlist" on public.wishlist;
create policy "Users can read own wishlist"
  on public.wishlist for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own wishlist" on public.wishlist;
create policy "Users can insert own wishlist"
  on public.wishlist for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own wishlist" on public.wishlist;
create policy "Users can delete own wishlist"
  on public.wishlist for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update on public.profiles to authenticated;
grant select, insert, delete on public.wishlist to authenticated;
