export interface Profile {
  id: string;
  displayName: string | null;
  birthDate: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Forma exacta de la fila tal como la devuelve public.profiles (snake_case). */
export interface ProfileRow {
  id: string;
  display_name: string | null;
  birth_date: string | null;
  height_cm: number | null;
  current_weight_kg: number | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    birthDate: row.birth_date,
    heightCm: row.height_cm,
    currentWeightKg: row.current_weight_kg,
    onboardingCompleted: row.onboarding_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
