/**
 * Vocabulario del onboarding deportivo. Estos valores son las respuestas
 * objetivas que puede dar el usuario; el punto de partida (fuerza/cardio) lo
 * infiere Nexora a partir de ellas — ver src/utils/fitnessInference.ts.
 */

export type TrainingGap = 'never' | 'over_1_year' | '3_to_12_months' | 'under_3_months' | 'currently_training';

export type WalkingCapacity = 'under_10_min' | '10_to_30_min' | '30_to_60_min' | 'over_60_min';

export type RunningCapacity = 'cannot_run' | 'under_5_min' | '5_to_20_min' | 'over_20_min';

/** 5 representa "5 o más días". */
export type WeeklyActivityDays = 0 | 1 | 2 | 3 | 4 | 5;

export type StrengthExperience = 'none' | 'under_6_months' | '6_months_to_2_years' | 'over_2_years';

export type CurrentStrengthFrequency = 'none' | 'occasional' | '1_to_2_days' | '3_or_more_days';

export type TechniqueFamiliarity = 'no' | 'a_little' | 'yes';

export type Goal =
  | 'lose_weight'
  | 'improve_fitness'
  | 'build_strength'
  | 'build_muscle'
  | 'start_running'
  | 'race_distance'
  | 'improve_mobility';

/** 6 representa "6 o más días". */
export type AvailableDaysPerWeek = 2 | 3 | 4 | 5 | 6;

/** 90 representa "90 minutos o más". */
export type SessionDurationMinutes = 30 | 45 | 60 | 90;

/** Punto de partida de fuerza inferido. Nunca lo elige el usuario. */
export type StrengthStartingPoint = 'foundation' | 'returning' | 'experienced';

/** Punto de partida de cardio inferido. Nunca lo elige el usuario. */
export type CardioStartingPoint = 'low_impact' | 'walk_run' | 'running_base';

/** Respuestas objetivas del onboarding, sin los datos personales. */
export interface OnboardingAnswers {
  trainingGap: TrainingGap;
  walkingCapacity: WalkingCapacity;
  runningCapacity: RunningCapacity;
  weeklyActivityDays: WeeklyActivityDays;
  strengthExperience: StrengthExperience;
  currentStrengthFrequency: CurrentStrengthFrequency;
  techniqueFamiliarity: TechniqueFamiliarity;
  goals: Goal[];
  availableDaysPerWeek: AvailableDaysPerWeek;
  sessionDurationMinutes: SessionDurationMinutes;
}

/** Datos personales que se guardan en public.profiles. */
export interface OnboardingPersonalData {
  displayName: string;
  /** Fecha ISO (yyyy-mm-dd). La edad se calcula a partir de este valor, nunca se almacena. */
  birthDate: string;
  heightCm: number;
  currentWeightKg: number;
}
