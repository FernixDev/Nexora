import type {
  AvailableDaysPerWeek,
  CardioStartingPoint,
  CurrentStrengthFrequency,
  Goal,
  RunningCapacity,
  SessionDurationMinutes,
  StrengthExperience,
  StrengthStartingPoint,
  TechniqueFamiliarity,
  TrainingGap,
  WalkingCapacity,
  WeeklyActivityDays,
} from './onboarding';

export interface FitnessProfile {
  userId: string;
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
  strengthStartingPoint: StrengthStartingPoint;
  cardioStartingPoint: CardioStartingPoint;
  createdAt: string;
  updatedAt: string;
}

/** Forma exacta de la fila tal como la devuelve public.fitness_profiles (snake_case). */
export interface FitnessProfileRow {
  user_id: string;
  training_gap: TrainingGap;
  walking_capacity: WalkingCapacity;
  running_capacity: RunningCapacity;
  weekly_activity_days: WeeklyActivityDays;
  strength_experience: StrengthExperience;
  current_strength_frequency: CurrentStrengthFrequency;
  technique_familiarity: TechniqueFamiliarity;
  goals: Goal[];
  available_days_per_week: AvailableDaysPerWeek;
  session_duration_minutes: SessionDurationMinutes;
  strength_starting_point: StrengthStartingPoint;
  cardio_starting_point: CardioStartingPoint;
  created_at: string;
  updated_at: string;
}

export function mapFitnessProfileRow(row: FitnessProfileRow): FitnessProfile {
  return {
    userId: row.user_id,
    trainingGap: row.training_gap,
    walkingCapacity: row.walking_capacity,
    runningCapacity: row.running_capacity,
    weeklyActivityDays: row.weekly_activity_days,
    strengthExperience: row.strength_experience,
    currentStrengthFrequency: row.current_strength_frequency,
    techniqueFamiliarity: row.technique_familiarity,
    goals: row.goals,
    availableDaysPerWeek: row.available_days_per_week,
    sessionDurationMinutes: row.session_duration_minutes,
    strengthStartingPoint: row.strength_starting_point,
    cardioStartingPoint: row.cardio_starting_point,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Forma que se envía a Supabase para crear/actualizar el perfil deportivo. */
export interface FitnessProfileInsert {
  user_id: string;
  training_gap: TrainingGap;
  walking_capacity: WalkingCapacity;
  running_capacity: RunningCapacity;
  weekly_activity_days: WeeklyActivityDays;
  strength_experience: StrengthExperience;
  current_strength_frequency: CurrentStrengthFrequency;
  technique_familiarity: TechniqueFamiliarity;
  goals: Goal[];
  available_days_per_week: AvailableDaysPerWeek;
  session_duration_minutes: SessionDurationMinutes;
  strength_starting_point: StrengthStartingPoint;
  cardio_starting_point: CardioStartingPoint;
}
