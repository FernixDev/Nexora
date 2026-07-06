import type { CardioStartingPoint, OnboardingAnswers, StrengthStartingPoint } from '../types/onboarding';

/**
 * Reglas de inferencia del punto de partida deportivo.
 *
 * Son deterministas y no dependen de inteligencia artificial: mismas
 * respuestas, mismo resultado, siempre reproducible y testable. No usan el
 * peso ni la edad como variables de decisión, y ninguna de las dos reglas
 * hace un diagnóstico médico: solo eligen un punto de partida razonable y
 * conservador para empezar a entrenar.
 */

type StrengthInferenceInput = Pick<
  OnboardingAnswers,
  'strengthExperience' | 'currentStrengthFrequency' | 'techniqueFamiliarity' | 'trainingGap'
>;

/**
 * FOUNDATION — punto de partida más seguro.
 *   - Señal única y suficiente por sí sola: nunca ha entrenado con pesas.
 *   - O bien, la combinación de al menos dos señales más débiles: poca
 *     experiencia, no conoce la técnica, o lleva mucho tiempo sin entrenar
 *     de ninguna forma. Ninguna de ellas por separado basta.
 *
 * EXPERIENCED — requiere que se cumplan las tres condiciones a la vez:
 * experiencia prolongada, entrenamiento actual frecuente y buena
 * familiaridad con la técnica.
 *
 * RETURNING — el resto de casos: tiene alguna experiencia previa relevante,
 * pero hoy no cumple los tres requisitos de EXPERIENCED (por ejemplo, ha
 * estado parado o entrena con poca frecuencia).
 */
export function inferStrengthStartingPoint(answers: StrengthInferenceInput): StrengthStartingPoint {
  const neverTrainedWithWeights = answers.strengthExperience === 'none';
  if (neverTrainedWithWeights) {
    return 'foundation';
  }

  const littleExperience = answers.strengthExperience === 'under_6_months';
  const lowTechnique = answers.techniqueFamiliarity === 'no';
  const longTrainingGap = answers.trainingGap === 'never' || answers.trainingGap === 'over_1_year';

  const weakSignals = [littleExperience, lowTechnique, longTrainingGap].filter(Boolean).length;
  if (weakSignals >= 2) {
    return 'foundation';
  }

  const longExperience = answers.strengthExperience === 'over_2_years';
  const trainsFrequentlyNow =
    answers.currentStrengthFrequency === '1_to_2_days' || answers.currentStrengthFrequency === '3_or_more_days';
  const knowsTechnique = answers.techniqueFamiliarity === 'yes';

  if (longExperience && trainsFrequentlyNow && knowsTechnique) {
    return 'experienced';
  }

  return 'returning';
}

type CardioInferenceInput = Pick<
  OnboardingAnswers,
  'runningCapacity' | 'walkingCapacity' | 'trainingGap' | 'weeklyActivityDays'
>;

/**
 * LOW_IMPACT — se activa cuando se combinan al menos dos señales de bajo
 * punto de partida (no una sola): no puede correr hoy, capacidad de
 * caminar muy limitada, mucho tiempo sin entrenar, o actividad semanal
 * actual muy baja.
 *
 * RUNNING_BASE — requiere a la vez una base de carrera sólida (más de 20
 * minutos corriendo) y mantener cierta actividad semanal actual.
 *
 * WALK_RUN — el punto intermedio por defecto: puede caminar razonablemente
 * y tiene base suficiente para progresar combinando caminata y carrera,
 * pero todavía no cumple los requisitos de RUNNING_BASE.
 */
export function inferCardioStartingPoint(answers: CardioInferenceInput): CardioStartingPoint {
  const cannotRunNow = answers.runningCapacity === 'cannot_run';
  const veryLimitedWalking = answers.walkingCapacity === 'under_10_min';
  const longTrainingGap = answers.trainingGap === 'never' || answers.trainingGap === 'over_1_year';
  const veryLowWeeklyActivity = answers.weeklyActivityDays <= 1;

  const lowImpactSignals = [cannotRunNow, veryLimitedWalking, longTrainingGap, veryLowWeeklyActivity].filter(
    Boolean,
  ).length;
  if (lowImpactSignals >= 2) {
    return 'low_impact';
  }

  const solidRunningBase = answers.runningCapacity === 'over_20_min';
  const maintainsWeeklyActivity = answers.weeklyActivityDays >= 2;
  if (solidRunningBase && maintainsWeeklyActivity) {
    return 'running_base';
  }

  return 'walk_run';
}
