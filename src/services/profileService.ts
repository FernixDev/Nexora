import { supabase } from '../integrations/supabase/client';
import { mapProfileRow, type Profile, type ProfileRow } from '../types/profile';
import type { OnboardingPersonalData } from '../types/onboarding';

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

/** Actualiza los datos personales del onboarding. Deliberadamente no toca onboarding_completed. */
export async function updatePersonalData(userId: string, data: OnboardingPersonalData): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: data.displayName,
      birth_date: data.birthDate,
      height_cm: data.heightCm,
      current_weight_kg: data.currentWeightKg,
    })
    .eq('id', userId);

  if (error) throw error;
}

/** Marca el onboarding como completado. Debe llamarse solo después de guardar con éxito el resto de datos. */
export async function markOnboardingCompleted(userId: string): Promise<void> {
  const { error } = await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', userId);
  if (error) throw error;
}
