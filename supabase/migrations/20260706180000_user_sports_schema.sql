-- Nexora — deportes de interés del usuario (multideporte)
--
-- Crea public.user_sports: relaciona cada usuario con los deportes que
-- quiere practicar en Nexora. Un usuario puede elegir varias áreas a la vez
-- (fuerza, atletismo, ciclismo, natación, estiramientos) sin deporte
-- principal ni deportes secundarios. Para ciclismo, discipline distingue
-- carretera (road) de montaña (mtb); el resto de deportes no tiene
-- disciplina propia todavía.
--
-- discipline se modela como texto NOT NULL con '' representando "sin
-- disciplina": forma parte de la clave primaria compuesta de la tabla, y una
-- clave primaria no admite NULL en ninguna de sus columnas. Esta capa de
-- almacenamiento es un detalle interno; src/types/sport.ts la traduce a
-- `CyclingDiscipline | null` antes de llegar al resto de la aplicación.

-- ---------------------------------------------------------------------------
-- 1. Tabla user_sports
-- ---------------------------------------------------------------------------

create table if not exists public.user_sports (
  user_id uuid not null references auth.users (id) on delete cascade,
  sport text not null
    check (sport in ('strength', 'athletics', 'cycling', 'swimming', 'stretching')),
  discipline text not null default ''
    check (discipline = '' or discipline in ('road', 'mtb')),
  created_at timestamptz not null default now(),

  primary key (user_id, sport, discipline),

  -- Solo cycling tiene disciplina propia por ahora; el resto de deportes
  -- debe guardarse siempre con discipline = ''.
  constraint user_sports_discipline_only_cycling
    check (discipline = '' or sport = 'cycling')
);

comment on table public.user_sports is
  'Deportes que cada usuario quiere practicar en Nexora. Varias filas por usuario (una por deporte/disciplina elegida). discipline solo aplica a cycling (road/mtb); para el resto vale ''''.';

-- ---------------------------------------------------------------------------
-- 2. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.user_sports enable row level security;

-- Un usuario autenticado puede leer únicamente sus propias selecciones.
create policy "user_sports_select_own"
  on public.user_sports
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Un usuario autenticado puede crear únicamente selecciones propias.
create policy "user_sports_insert_own"
  on public.user_sports
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Un usuario autenticado puede eliminar únicamente sus propias selecciones
-- (el cliente sustituye la selección completa borrando e insertando de
-- nuevo, ver src/services/userSportsService.ts).
create policy "user_sports_delete_own"
  on public.user_sports
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Deliberadamente NO se define policy de UPDATE: las filas nunca se
-- actualizan, solo se borran y se vuelven a crear. Sin una policy que lo
-- permita, esa operación queda denegada por defecto. Tampoco se concede
-- ningún privilegio a 'anon'.

-- ---------------------------------------------------------------------------
-- 3. Grants
-- ---------------------------------------------------------------------------
-- RLS por sí solo no basta: PostgreSQL primero comprueba el privilegio a
-- nivel de tabla (GRANT) antes de evaluar las políticas de RLS.

grant select, insert, delete on public.user_sports to authenticated;
