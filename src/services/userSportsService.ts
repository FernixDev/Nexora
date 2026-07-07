import { supabase } from '../integrations/supabase/client';
import { mapUserSportRow, toUserSportInsert, type UserSport, type UserSportRow, type UserSportSelection } from '../types/sport';

/**
 * Obtiene los deportes elegidos por el usuario indicado. La seguridad real
 * la impone RLS en PostgreSQL (auth.uid() = user_id).
 */
export async function getUserSports(userId: string): Promise<UserSport[]> {
  const { data, error } = await supabase
    .from('user_sports')
    .select('user_id, sport, discipline, custom_discipline_label, created_at')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []).map((row) => mapUserSportRow(row as UserSportRow));
}

/**
 * Sustituye por completo las selecciones deportivas del usuario: borra todas
 * las filas existentes y crea las nuevas. Es idempotente y segura de
 * reintentar — un fallo tras el borrado deja al usuario sin deportes
 * temporalmente, pero un reintento repite el mismo borrado (sin efecto) y
 * vuelve a insertar; nunca puede generar filas duplicadas.
 */
export async function replaceUserSports(userId: string, selections: readonly UserSportSelection[]): Promise<void> {
  const { error: deleteError } = await supabase.from('user_sports').delete().eq('user_id', userId);
  if (deleteError) throw deleteError;

  if (selections.length === 0) return;

  const rows = selections.map((selection) => toUserSportInsert(userId, selection));
  const { error: insertError } = await supabase.from('user_sports').insert(rows);
  if (insertError) throw insertError;
}
