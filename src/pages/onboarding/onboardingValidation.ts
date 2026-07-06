import { isValidBirthDate } from '../../utils/age';
import type { OnboardingAnswersDraft, OnboardingPersonalDraft, OnboardingSportsDraft } from '../../hooks/useOnboardingDraft';
import type { OnboardingAnswers, OnboardingPersonalData } from '../../types/onboarding';
import type { UserSportSelection } from '../../types/sport';

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

export function isSportsStepValid(sports: OnboardingSportsDraft): boolean {
  if (sports.sports.length === 0) return false;
  if (sports.sports.includes('cycling') && sports.cyclingDisciplines.length === 0) return false;
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
  sports: OnboardingSportsDraft,
  answers: OnboardingAnswersDraft,
): boolean {
  return (
    isPersonalDataStepValid(personal) &&
    isSportsStepValid(sports) &&
    isCurrentStateStepValid(answers) &&
    isStrengthStepValid(answers) &&
    isGoalsStepValid(answers) &&
    isAvailabilityStepValid(answers)
  );
}

/**
 * Expande la selección de deportes del borrador a filas finales: cycling
 * genera una selección por cada disciplina elegida (road y/o mtb), el resto
 * de deportes genera una única selección sin disciplina. Solo debe llamarse
 * cuando `isSportsStepValid` ha devuelto `true`.
 */
export function toUserSportSelections(sports: OnboardingSportsDraft): UserSportSelection[] {
  const selections: UserSportSelection[] = [];
  for (const sport of sports.sports) {
    if (sport === 'cycling') {
      for (const discipline of sports.cyclingDisciplines) {
        selections.push({ sport: 'cycling', discipline });
      }
    } else {
      selections.push({ sport, discipline: null });
    }
  }
  return selections;
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
