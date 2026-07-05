-- Nexora — conceder los privilegios de tabla necesarios para que las
-- políticas de RLS de public.profiles puedan evaluarse.
--
-- RLS por sí solo no es suficiente: PostgreSQL primero comprueba si el rol
-- tiene privilegio a nivel de tabla (GRANT) antes de evaluar las políticas
-- de RLS que deciden qué filas son visibles o modificables. Sin este GRANT,
-- 'authenticated' recibe "permission denied for table profiles" (42501)
-- aunque las políticas ya existan.
--
-- Deliberadamente NO se concede insert ni delete a 'authenticated' (el
-- perfil se crea solo mediante el trigger con SECURITY DEFINER de la
-- migración anterior, y no debe poder borrarse desde el frontend), y no se
-- concede ningún privilegio a 'anon'.

grant select, update on public.profiles to authenticated;
