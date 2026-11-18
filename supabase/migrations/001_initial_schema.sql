-- Divide Aê | Schema inicial (Supabase / PostgreSQL)
-- Execute no SQL Editor do projeto Supabase.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  address text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create index if not exists household_members_user_id_idx on public.household_members(user_id);
create index if not exists households_created_by_idx on public.households(created_by);

-- Cria perfil automaticamente quando uma conta é criada no Supabase Auth.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do update set full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- RPC transacional: cria a moradia e adiciona o usuário atual como proprietário.
create or replace function public.create_household(household_name text, household_address text default null)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare new_household_id uuid;
begin
  if auth.uid() is null then raise exception 'Autenticação necessária.'; end if;
  if household_name is null or char_length(trim(household_name)) not between 1 and 80 then
    raise exception 'Informe um nome de moradia entre 1 e 80 caracteres.';
  end if;
  insert into public.households (name, address, created_by)
  values (trim(household_name), nullif(trim(household_address), ''), auth.uid())
  returning id into new_household_id;
  insert into public.household_members (household_id, user_id, role)
  values (new_household_id, auth.uid(), 'owner');
  return new_household_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;

-- Perfis: cada usuário lê e atualiza apenas o próprio perfil.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Moradias: membros podem consultar espaços dos quais participam.
drop policy if exists "Members can read their households" on public.households;
create policy "Members can read their households" on public.households for select to authenticated
using (exists (select 1 from public.household_members hm where hm.household_id = id and hm.user_id = (select auth.uid())));

-- Membros só conseguem visualizar as próprias associações.
drop policy if exists "Users can read own memberships" on public.household_members;
create policy "Users can read own memberships" on public.household_members for select to authenticated
using (user_id = (select auth.uid()));

revoke all on function public.create_household(text, text) from public;
grant execute on function public.create_household(text, text) to authenticated;

grant select, update on public.profiles to authenticated;
grant select on public.households to authenticated;
grant select on public.household_members to authenticated;
