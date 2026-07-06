-- Nexora — perfil deportivo (onboarding adaptativo)
--
-- Crea public.fitness_profiles (relación 1:1 con auth.users), independiente
-- de public.profiles: aquí vive únicamente la información deportiva que
-- alimenta el onboarding (respuestas objetivas) y el punto de partida que
-- Nexora infiere a partir de ellas.
--
-- IMPORTANTE: strength_starting_point y cardio_starting_point los calcula la
-- aplicación con reglas deterministas (ver src/utils/fitnessInference.ts).
-- El usuario nunca elige directamente "principiante/intermedio/avanzado" ni
-- un nivel de fuerza o cardio: responde preguntas concretas y Nexora infiere.

-- ---------------------------------------------------------------------------
-- 1. Tabla fitness_profiles
-- ---------------------------------------------------------------------------

create table if not exists public.fitness_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,

  -- Estado actual
  training_gap text not null
    check (training_gap in ('never', 'over_1_year', '3_to_12_months', 'under_3_months', 'currently_training')),
  walking_capacity text not null
    check (walking_capacity in ('under_10_min', '10_to_30_min', '30_to_60_min', 'over_60_min')),
  running_capacity text not null
    check (running_capacity in ('cannot_run', 'under_5_min', '5_to_20_min', 'over_20_min')),
  weekly_activity_days smallint not null
    check (weekly_activity_days between 0 and 5),

  -- Experiencia de fuerza
  strength_experience text not null
    check (strength_experience in ('none', 'under_6_months', '6_months_to_2_years', 'over_2_years')),
  current_strength_frequency text not null
    check (current_strength_frequency in ('none', 'occasional', '1_to_2_days', '3_or_more_days')),
  technique_familiarity text not null
    check (technique_familiarity in ('no', 'a_little', 'yes')),

  -- Objetivos (selección múltiple)
  goals text[] not null default '{}'
    check (
      goals <@ array[
        'lose_weight', 'improve_fitness', 'build_strength',
        'build_muscle', 'start_running', 'race_distance', 'improve_mobility'
      ]::text[]
    ),

  -- Disponibilidad
  available_days_per_week smallint not null
    check (available_days_per_week between 2 and 6),
  session_duration_minutes smallint not null
    check (session_duration_minutes in (30, 45, 60, 90)),

  -- Punto de partida inferido (nunca elegido por el usuario)
  strength_starting_point text not null
    check (strength_starting_point in ('foundation', 'returning', 'experienced')),
  cardio_starting_point text not null
    check (cardio_starting_point in ('low_impact', 'walk_run', 'running_base')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.fitness_profiles is
  'Respuestas del onboarding deportivo y punto de partida inferido por Nexora. 1:1 con auth.users. No contiene datos personales (esos viven en public.profiles).';

-- ---------------------------------------------------------------------------
-- 2. updated_at automático
-- ---------------------------------------------------------------------------
-- Reutiliza public.set_updated_at(), ya creada en la migración de profiles.

drop trigger if exists set_fitness_profiles_updated_at on public.fitness_profiles;

create trigger set_fitness_profiles_updated_at
  before update on public.fitness_profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.fitness_profiles enable row level security;

-- Un usuario autenticado puede leer únicamente su propio perfil deportivo.
create policy "fitness_profiles_select_own"
  on public.fitness_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Un usuario autenticado puede crear únicamente su propio perfil deportivo
-- (se crea desde el cliente al completar el onboarding, a diferencia de
-- public.profiles que se crea por trigger).
create policy "fitness_profiles_insert_own"
  on public.fitness_profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Un usuario autenticado puede actualizar únicamente su propio perfil
-- deportivo (por ejemplo, si repite el onboarding más adelante).
create policy "fitness_profiles_update_own"
  on public.fitness_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Deliberadamente NO se define policy de DELETE para 'authenticated': el
-- perfil deportivo no debe poder borrarse desde el frontend. Sin una policy
-- que lo permita, esa operación queda denegada por defecto tanto para
-- 'authenticated' como para 'anon'. Tampoco se concede ningún privilegio a
-- 'anon'.

-- ---------------------------------------------------------------------------
-- 4. Grants
-- ---------------------------------------------------------------------------
-- RLS por sí solo no basta: PostgreSQL primero comprueba el privilegio a
-- nivel de tabla (GRANT) antes de evaluar las políticas de RLS.

grant select, insert, update on public.fitness_profiles to authenticated;
