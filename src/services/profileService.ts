import { supabase } from '../integrations/supabase/client';
import { mapProfileRow, type Profile, type ProfileRow } from '../types/profile';

/**
 * Obtiene el perfil del usuario indicado. La seguridad real la impone RLS en
 * PostgreSQL (auth.uid() = id): esta consulta nunca debe usarse como barrera
 * de seguridad por sí sola.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, birth_date, height_cm, current_weight_kg, onboarding_completed, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle<ProfileRow>();

  if (error) throw error;
  return data ? mapProfileRow(data) : null;
}
