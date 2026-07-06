import { supabase } from '../integrations/supabase/client';
import { mapFitnessProfileRow, type FitnessProfile, type FitnessProfileInsert, type FitnessProfileRow } from '../types/fitnessProfile';

const FITNESS_PROFILE_COLUMNS =
  'user_id, training_gap, walking_capacity, running_capacity, weekly_activity_days, ' +
  'strength_experience, current_strength_frequency, technique_familiarity, goals, ' +
  'available_days_per_week, session_duration_minutes, strength_starting_point, ' +
  'cardio_starting_point, created_at, updated_at';

/**
 * Obtiene el perfil deportivo del usuario indicado. La seguridad real la
 * impone RLS en PostgreSQL (auth.uid() = user_id).
 */
export async function getFitnessProfile(userId: string): Promise<FitnessProfile | null> {
  const { data, error } = await supabase
    .from('fitness_profiles')
    .select(FITNESS_PROFILE_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle<FitnessProfileRow>();

  if (error) throw error;
  return data ? mapFitnessProfileRow(data) : null;
}

/**
 * Crea o actualiza el perfil deportivo del usuario. Usa upsert por user_id
 * para que un reintento tras un fallo parcial del onboarding sea seguro
 * (idempotente) en lugar de fallar por clave duplicada.
 */
export async function upsertFitnessProfile(input: FitnessProfileInsert): Promise<void> {
  const { error } = await supabase.from('fitness_profiles').upsert(input, { onConflict: 'user_id' });
  if (error) throw error;
}
