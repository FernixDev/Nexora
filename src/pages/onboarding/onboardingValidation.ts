import { isValidBirthDate } from '../../utils/age';
import type { OnboardingAnswersDraft, OnboardingPersonalDraft } from '../../hooks/useOnboardingDraft';
import type { OnboardingAnswers, OnboardingPersonalData } from '../../types/onboarding';

const MIN_HEIGHT_CM = 100;
const MAX_HEIGHT_CM = 230;
const MIN_WEIGHT_KG = 30;
const MAX_WEIGHT_KG = 250;

export function isPersonalDataStepValid(personal: OnboardingPersonalDraft): boolean {
  if (!personal.displayName.trim()) return false;
  if (!isValidBirthDate(personal.birthDate)) return false;

  const height = Number(personal.heightCm);
  if (!Number.isFinite(height) || height < MIN_HEIGHT_CM || height > MAX_HEIGHT_CM) return false;

  const weight = Number(personal.currentWeightKg);
  if (!Number.isFinite(weight) || weight < MIN_WEIGHT_KG || weight > MAX_WEIGHT_KG) return false;

  return true;
}

export function isCurrentStateStepValid(answers: OnboardingAnswersDraft): boolean {
  return Boolean(answers.trainingGap && answers.walkingCapacity && answers.runningCapacity && answers.weeklyActivityDays !== null);
}

export function isStrengthStepValid(answers: OnboardingAnswersDraft): boolean {
  return Boolean(answers.strengthExperience && answers.currentStrengthFrequency && answers.techniqueFamiliarity);
}

export function isGoalsStepValid(answers: OnboardingAnswersDraft): boolean {
  return answers.goals.length > 0;
}

export function isAvailabilityStepValid(answers: OnboardingAnswersDraft): boolean {
  return Boolean(answers.availableDaysPerWeek !== null && answers.sessionDurationMinutes !== null);
}

export function isOnboardingDraftComplete(
  personal: OnboardingPersonalDraft,
  answers: OnboardingAnswersDraft,
): boolean {
  return (
    isPersonalDataStepValid(personal) &&
    isCurrentStateStepValid(answers) &&
    isStrengthStepValid(answers) &&
    isGoalsStepValid(answers) &&
    isAvailabilityStepValid(answers)
  );
}

/**
 * Convierte el borrador (con campos en texto y nulos) a las formas finales
 * tipadas que esperan la inferencia y el guardado. Solo debe llamarse cuando
 * `isOnboardingDraftComplete` ha devuelto `true`.
 */
export function toOnboardingPersonalData(personal: OnboardingPersonalDraft): OnboardingPersonalData {
  return {
    displayName: personal.displayName.trim(),
    birthDate: personal.birthDate,
    heightCm: Number(personal.heightCm),
    currentWeightKg: Number(personal.currentWeightKg),
  };
}

export function toOnboardingAnswers(answers: OnboardingAnswersDraft): OnboardingAnswers {
  return {
    trainingGap: answers.trainingGap!,
    walkingCapacity: answers.walkingCapacity!,
    runningCapacity: answers.runningCapacity!,
    weeklyActivityDays: answers.weeklyActivityDays!,
    strengthExperience: answers.strengthExperience!,
    currentStrengthFrequency: answers.currentStrengthFrequency!,
    techniqueFamiliarity: answers.techniqueFamiliarity!,
    goals: answers.goals,
    availableDaysPerWeek: answers.availableDaysPerWeek!,
    sessionDurationMinutes: answers.sessionDurationMinutes!,
  };
}
