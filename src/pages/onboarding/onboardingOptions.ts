/** Texto de preguntas y opciones del onboarding. Contenido de producto, no lógica de negocio. */

export const TRAINING_GAP_OPTIONS = [
  { value: 'never', label: 'Nunca he entrenado' },
  { value: 'over_1_year', label: 'Hace más de 1 año' },
  { value: '3_to_12_months', label: 'Entre 3 y 12 meses' },
  { value: 'under_3_months', label: 'Menos de 3 meses' },
  { value: 'currently_training', label: 'Entreno actualmente' },
] as const;

export const WALKING_CAPACITY_OPTIONS = [
  { value: 'under_10_min', label: 'Menos de 10 minutos' },
  { value: '10_to_30_min', label: 'Entre 10 y 30 minutos' },
  { value: '30_to_60_min', label: 'Entre 30 y 60 minutos' },
  { value: 'over_60_min', label: 'Más de 60 minutos' },
] as const;

export const RUNNING_CAPACITY_OPTIONS = [
  { value: 'cannot_run', label: 'No' },
  { value: 'under_5_min', label: 'Menos de 5 minutos' },
  { value: '5_to_20_min', label: 'Entre 5 y 20 minutos' },
  { value: 'over_20_min', label: 'Más de 20 minutos' },
] as const;

export const WEEKLY_ACTIVITY_DAYS_OPTIONS = [
  { value: '0', label: '0 días' },
  { value: '1', label: '1 día' },
  { value: '2', label: '2 días' },
  { value: '3', label: '3 días' },
  { value: '4', label: '4 días' },
  { value: '5', label: '5 o más días' },
] as const;

export const STRENGTH_EXPERIENCE_OPTIONS = [
  { value: 'none', label: 'Ninguna' },
  { value: 'under_6_months', label: 'Menos de 6 meses' },
  { value: '6_months_to_2_years', label: 'Entre 6 meses y 2 años' },
  { value: 'over_2_years', label: 'Más de 2 años' },
] as const;

export const CURRENT_STRENGTH_FREQUENCY_OPTIONS = [
  { value: 'none', label: 'No' },
  { value: 'occasional', label: 'Ocasionalmente' },
  { value: '1_to_2_days', label: '1 o 2 días por semana' },
  { value: '3_or_more_days', label: '3 o más días por semana' },
] as const;

export const TECHNIQUE_FAMILIARITY_OPTIONS = [
  { value: 'no', label: 'No' },
  { value: 'a_little', label: 'Un poco' },
  { value: 'yes', label: 'Sí' },
] as const;

export const GOAL_OPTIONS = [
  { value: 'lose_weight', label: 'Perder peso' },
  { value: 'improve_fitness', label: 'Mejorar la condición física' },
  { value: 'build_strength', label: 'Ganar fuerza' },
  { value: 'build_muscle', label: 'Ganar masa muscular' },
  { value: 'start_running', label: 'Empezar a correr' },
  { value: 'race_distance', label: 'Preparar una distancia' },
  { value: 'improve_mobility', label: 'Mejorar movilidad' },
] as const;

export const AVAILABLE_DAYS_PER_WEEK_OPTIONS = [
  { value: '2', label: '2 días' },
  { value: '3', label: '3 días' },
  { value: '4', label: '4 días' },
  { value: '5', label: '5 días' },
  { value: '6', label: '6 o más días' },
] as const;

export const SESSION_DURATION_MINUTES_OPTIONS = [
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '60 minutos' },
  { value: '90', label: '90 minutos o más' },
] as const;
