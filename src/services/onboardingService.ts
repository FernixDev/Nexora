import { markOnboardingCompleted, updatePersonalData } from './profileService';
import { upsertFitnessProfile } from './fitnessProfileService';
import { inferCardioStartingPoint, inferStrengthStartingPoint } from '../utils/fitnessInference';
import type { OnboardingAnswers, OnboardingPersonalData } from '../types/onboarding';

/**
 * Guarda el resultado completo del onboarding en un orden seguro:
 *
 * 1. Actualiza los datos personales en public.profiles (sin tocar
 *    onboarding_completed todavía).
 * 2. Crea o actualiza public.fitness_profiles con las respuestas y el punto
 *    de partida inferido (upsert: un reintento tras un fallo es seguro).
 * 3. Solo si los dos pasos anteriores tienen éxito, marca
 *    onboarding_completed = true.
 *
 * No hay una transacción real disponible desde el cliente, así que si algún
 * paso falla la función lanza un error y el usuario nunca queda marcado
 * como completado con datos a medias. Volver a llamar a esta función tras un
 * fallo es seguro: los tres pasos son idempotentes.
 */
export async function completeOnboarding(
  userId: string,
  personalData: OnboardingPersonalData,
  answers: OnboardingAnswers,
): Promise<void> {
  await updatePersonalData(userId, personalData);

  const strengthStartingPoint = inferStrengthStartingPoint(answers);
  const cardioStartingPoint = inferCardioStartingPoint(answers);

  await upsertFitnessProfile({
    user_id: userId,
    training_gap: answers.trainingGap,
    walking_capacity: answers.walkingCapacity,
    running_capacity: answers.runningCapacity,
    weekly_activity_days: answers.weeklyActivityDays,
    strength_experience: answers.strengthExperience,
    current_strength_frequency: answers.currentStrengthFrequency,
    technique_familiarity: answers.techniqueFamiliarity,
    goals: answers.goals,
    available_days_per_week: answers.availableDaysPerWeek,
    session_duration_minutes: answers.sessionDurationMinutes,
    strength_starting_point: strengthStartingPoint,
    cardio_starting_point: cardioStartingPoint,
  });

  await markOnboardingCompleted(userId);
}
