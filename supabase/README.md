# supabase/

SQL versionado del proyecto, organizado como migraciones (una por cambio de esquema), para que la base de datos sea reproducible desde el repositorio y no dependa únicamente del Dashboard de Supabase.

No se ha configurado todavía el Supabase CLI (requeriría Docker y enlazar el proyecto; no aporta valor real en esta fase). Los nombres de archivo siguen el formato `YYYYMMDDHHMMSS_descripcion.sql` que usa el CLI, así que si en el futuro se instala, estas migraciones ya estarán en el formato correcto.

## Cómo aplicar una migración ahora

1. Abre el proyecto en [supabase.com](https://supabase.com/dashboard).
2. Ve a **SQL Editor**.
3. Pega el contenido del archivo de migración correspondiente en `migrations/`.
4. Ejecuta la consulta.

Nunca incluyas credenciales reales (contraseña de base de datos, `service_role`, etc.) en estos archivos: solo definiciones de esquema, funciones, triggers y políticas.
