create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text unique,
  phone text,
  age integer,
  gender text,
  telegram_id bigint unique,
  telegram_username text,
  telegram_url text,
  first_name text,
  last_name text,
  photo_url text,
  auth_provider text not null default 'email',
  email_verified boolean not null default false,
  password_ready boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint app_users_auth_provider_check
    check (auth_provider in ('email', 'telegram', 'hybrid'))
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists app_users_set_updated_at on public.app_users;
create trigger app_users_set_updated_at
before update on public.app_users
for each row
execute function public.set_updated_at();

alter table public.app_users enable row level security;

drop policy if exists "Users can read own app profile" on public.app_users;
create policy "Users can read own app profile"
on public.app_users
for select
to authenticated
using (auth.uid() = auth_user_id);

drop policy if exists "Users can insert own app profile" on public.app_users;
create policy "Users can insert own app profile"
on public.app_users
for insert
to authenticated
with check (auth.uid() = auth_user_id);

drop policy if exists "Users can update own app profile" on public.app_users;
create policy "Users can update own app profile"
on public.app_users
for update
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);
