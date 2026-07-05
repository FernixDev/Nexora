-- Nexora — esquema base de perfiles de usuario
--
-- Crea public.profiles (relación 1:1 con auth.users), la creación automática
-- del perfil al registrarse, el mantenimiento automático de updated_at, y las
-- políticas de Row Level Security que limitan a cada usuario a su propio perfil.
--
-- Los campos deportivos (edad, altura, peso, objetivos) existen ya en la tabla
-- para no tener que migrar de nuevo más adelante, pero todavía no se muestran
-- ni se rellenan desde ninguna pantalla: el onboarding completo es una misión
-- futura.

-- ---------------------------------------------------------------------------
-- 1. Tabla profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  birth_date date,
  height_cm numeric check (height_cm is null or height_cm > 0),
  current_weight_kg numeric check (current_weight_kg is null or current_weight_kg > 0),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil público de cada usuario, 1:1 con auth.users. Los campos deportivos se completarán durante el onboarding (misión futura).';

-- ---------------------------------------------------------------------------
-- 2. updated_at automático
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Creación automática del perfil al registrarse
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER + search_path explícito: la función se ejecuta con los
-- privilegios de quien la creó (no del usuario que dispara el trigger), lo
-- justo para poder insertar en public.profiles aunque el usuario recién
-- registrado todavía no tenga permisos propios sobre esa tabla. No concede
-- ningún otro privilegio y no toca ninguna otra tabla.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;

-- Un usuario autenticado puede leer únicamente su propio perfil.
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Un usuario autenticado puede actualizar únicamente su propio perfil.
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Deliberadamente NO se define policy de INSERT ni DELETE para 'authenticated':
-- el perfil se crea solo mediante el trigger anterior (que usa SECURITY DEFINER
-- y por tanto no depende de estas políticas), y no debe poder borrarse desde
-- el frontend. Sin una policy que lo permita, esas operaciones quedan denegadas
-- por defecto tanto para 'authenticated' como para 'anon'.
