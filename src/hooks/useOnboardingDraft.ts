import { useCallback, useEffect, useState } from 'react';
import type {
  AvailableDaysPerWeek,
  CurrentStrengthFrequency,
  Goal,
  RunningCapacity,
  SessionDurationMinutes,
  StrengthExperience,
  TechniqueFamiliarity,
  TrainingGap,
  WalkingCapacity,
  WeeklyActivityDays,
} from '../types/onboarding';

const STORAGE_PREFIX = 'nexora.onboarding.draft.';
const STEP_COUNT = 7;

/** Datos personales del borrador. Se guardan como texto para controlar los inputs sin fricción. */
export interface OnboardingPersonalDraft {
  displayName: string;
  birthDate: string;
  heightCm: string;
  currentWeightKg: string;
}

/** Respuestas del borrador. `null`/`[]` significa "todavía sin responder". */
export interface OnboardingAnswersDraft {
  trainingGap: TrainingGap | null;
  walkingCapacity: WalkingCapacity | null;
  runningCapacity: RunningCapacity | null;
  weeklyActivityDays: WeeklyActivityDays | null;
  strengthExperience: StrengthExperience | null;
  currentStrengthFrequency: CurrentStrengthFrequency | null;
  techniqueFamiliarity: TechniqueFamiliarity | null;
  goals: Goal[];
  availableDaysPerWeek: AvailableDaysPerWeek | null;
  sessionDurationMinutes: SessionDurationMinutes | null;
}

export interface OnboardingDraft {
  step: number;
  personal: OnboardingPersonalDraft;
  answers: OnboardingAnswersDraft;
}

export function createEmptyDraft(): OnboardingDraft {
  return {
    step: 1,
    personal: { displayName: '', birthDate: '', heightCm: '', currentWeightKg: '' },
    answers: {
      trainingGap: null,
      walkingCapacity: null,
      runningCapacity: null,
      weeklyActivityDays: null,
      strengthExperience: null,
      currentStrengthFrequency: null,
      techniqueFamiliarity: null,
      goals: [],
      availableDaysPerWeek: null,
      sessionDurationMinutes: null,
    },
  };
}

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

function loadDraft(userId: string): OnboardingDraft {
  const empty = createEmptyDraft();
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
    const parsedStep = typeof parsed.step === 'number' ? parsed.step : empty.step;
    return {
      step: Math.min(Math.max(parsedStep, 1), STEP_COUNT),
      personal: { ...empty.personal, ...parsed.personal },
      answers: { ...empty.answers, ...parsed.answers },
    };
  } catch {
    return empty;
  }
}

/**
 * Borrador del onboarding persistido en localStorage, aislado por usuario.
 * Nunca guarda contraseñas ni tokens: solo las respuestas del formulario.
 * Permite recargar la página a mitad de flujo sin perder lo ya respondido.
 */
export function useOnboardingDraft(userId: string) {
  const [draft, setDraft] = useState<OnboardingDraft>(() => loadDraft(userId));

  useEffect(() => {
    setDraft(loadDraft(userId));
  }, [userId]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(draft));
    } catch {
      // localStorage puede no estar disponible (p. ej. navegación privada);
      // el onboarding sigue funcionando en memoria para la sesión actual.
    }
  }, [draft, userId]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey(userId));
    } catch {
      // no-op
    }
    setDraft(createEmptyDraft());
  }, [userId]);

  return { draft, setDraft, clearDraft };
}
