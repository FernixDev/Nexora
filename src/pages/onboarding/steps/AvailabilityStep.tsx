import { SingleOptionGroup } from '../../../components/OptionCard/OptionGroup';
import { AVAILABLE_DAYS_PER_WEEK_OPTIONS, SESSION_DURATION_MINUTES_OPTIONS } from '../onboardingOptions';
import type { OnboardingAnswersDraft } from '../../../hooks/useOnboardingDraft';
import type { AvailableDaysPerWeek, SessionDurationMinutes } from '../../../types/onboarding';

interface AvailabilityStepProps {
  answers: OnboardingAnswersDraft;
  onChange: (patch: Partial<OnboardingAnswersDraft>) => void;
  showErrors: boolean;
}

const REQUIRED_ERROR = 'Selecciona una opción para continuar.';

export function AvailabilityStep({ answers, onChange, showErrors }: AvailabilityStepProps) {
  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <span className="onboarding-step__eyebrow text-label">Disponibilidad</span>
        <h1 className="onboarding-step__title text-title">¿Con cuánto tiempo cuentas?</h1>
      </div>

      <SingleOptionGroup
        legend="¿Cuántos días puedes entrenar normalmente?"
        name="availableDaysPerWeek"
        options={AVAILABLE_DAYS_PER_WEEK_OPTIONS}
        value={answers.availableDaysPerWeek !== null ? String(answers.availableDaysPerWeek) : null}
        onChange={(value) => onChange({ availableDaysPerWeek: Number(value) as AvailableDaysPerWeek })}
        error={showErrors && answers.availableDaysPerWeek === null ? REQUIRED_ERROR : undefined}
      />

      <SingleOptionGroup
        legend="¿Cuánto tiempo tienes normalmente para entrenar?"
        name="sessionDurationMinutes"
        options={SESSION_DURATION_MINUTES_OPTIONS}
        value={answers.sessionDurationMinutes !== null ? String(answers.sessionDurationMinutes) : null}
        onChange={(value) => onChange({ sessionDurationMinutes: Number(value) as SessionDurationMinutes })}
        error={showErrors && answers.sessionDurationMinutes === null ? REQUIRED_ERROR : undefined}
      />
    </div>
  );
}
