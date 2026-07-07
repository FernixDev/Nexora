-- Nexora — ampliación multideporte de user_sports (Cardio en gimnasio,
-- Entreno en casa, máquina de cardio personalizada)
--
-- Migración ADITIVA sobre la tabla ya creada en
-- 20260706180000_user_sports_schema.sql. Esa migración NO se reescribe ni
-- se vuelve a ejecutar: aquí solo se amplían los valores permitidos de
-- sport/discipline y se añade una columna nueva.
--
-- Nuevo catálogo de sport: se añaden 'gym_cardio' (Cardio en gimnasio) y
-- 'home_training' (Entreno en casa). Los valores existentes ('strength',
-- 'athletics', 'cycling', 'swimming', 'stretching') no cambian, así que las
-- filas ya guardadas siguen siendo válidas sin necesidad de ningún backfill.
--
-- Nuevo catálogo de discipline: cycling mantiene 'road'/'mtb'; gym_cardio
-- añade 'stationary_bike', 'treadmill', 'elliptical', 'stair_climber' y
-- 'other' (máquina de cardio personalizada). El resto de deportes sigue sin
-- disciplina ('').
--
-- "Cardio" (Atletismo + Ciclismo + Cardio en gimnasio) es una agrupación
-- puramente visual del frontend: no se guarda como valor de sport en
-- ningún sitio, evitando redundancia en la base de datos.

-- ---------------------------------------------------------------------------
-- 1. Ampliar los valores permitidos de sport
-- ---------------------------------------------------------------------------
-- El check original era anónimo; Postgres le asignó el nombre por defecto
-- "user_sports_sport_check" (columna "sport" de la tabla "user_sports").

alter table public.user_sports
  drop constraint user_sports_sport_check;

alter table public.user_sports
  add constraint user_sports_sport_check
  check (sport in ('strength', 'athletics', 'cycling', 'gym_cardio', 'home_training', 'swimming', 'stretching'));

-- ---------------------------------------------------------------------------
-- 2. Ampliar los valores permitidos de discipline
-- ---------------------------------------------------------------------------

alter table public.user_sports
  drop constraint user_sports_discipline_check;

alter table public.user_sports
  add constraint user_sports_discipline_check
  check (
    discipline = ''
    or discipline in ('road', 'mtb', 'stationary_bike', 'treadmill', 'elliptical', 'stair_climber', 'other')
  );

-- ---------------------------------------------------------------------------
-- 3. Restringir qué deporte puede llevar qué disciplina
-- ---------------------------------------------------------------------------
-- Sustituye la restricción original (que solo contemplaba cycling) por una
-- que también cubre gym_cardio: cycling solo admite road/mtb, gym_cardio
-- solo admite las 4 máquinas estándar u 'other', y el resto de deportes debe
-- ir siempre sin disciplina.

alter table public.user_sports
  drop constraint user_sports_discipline_only_cycling;

alter table public.user_sports
  add constraint user_sports_discipline_by_sport
  check (
    (sport = 'cycling' and discipline in ('road', 'mtb'))
    or (sport = 'gym_cardio' and discipline in ('stationary_bike', 'treadmill', 'elliptical', 'stair_climber', 'other'))
    or (sport not in ('cycling', 'gym_cardio') and discipline = '')
  );

-- ---------------------------------------------------------------------------
-- 4. Máquina de cardio personalizada (solo cuando discipline = 'other')
-- ---------------------------------------------------------------------------
-- El texto libre que escribe el usuario nunca se guarda en discipline (que
-- sigue siendo un identificador interno estable): vive en esta columna
-- nueva, exigida por la base de datos únicamente cuando discipline =
-- 'other'. Al ser 'other' parte de la clave primaria (user_id, sport,
-- discipline), cada usuario solo puede tener una máquina personalizada a la
-- vez, sin necesidad de ninguna restricción adicional. Es privada por
-- construcción: RLS ya limita todo a auth.uid() = user_id.

alter table public.user_sports
  add column if not exists custom_discipline_label text;

alter table public.user_sports
  add constraint user_sports_custom_label_only_for_other
  check (
    (discipline = 'other' and custom_discipline_label is not null
       and length(btrim(custom_discipline_label)) between 1 and 40)
    or (discipline <> 'other' and custom_discipline_label is null)
  );

comment on column public.user_sports.custom_discipline_label is
  'Nombre libre de la máquina de cardio cuando discipline = ''other''. Privado del usuario que la registró, no es un catálogo público ni compartido con otros usuarios.';
