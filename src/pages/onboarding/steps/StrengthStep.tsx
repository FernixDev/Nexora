import { SingleOptionGroup } from '../../../components/OptionCard/OptionGroup';
import {
  CURRENT_STRENGTH_FREQUENCY_OPTIONS,
  STRENGTH_EXPERIENCE_OPTIONS,
  TECHNIQUE_FAMILIARITY_OPTIONS,
} from '../onboardingOptions';
import type { OnboardingAnswersDraft } from '../../../hooks/useOnboardingDraft';
import type { CurrentStrengthFrequency, StrengthExperience, TechniqueFamiliarity } from '../../../types/onboarding';

interface StrengthStepProps {
  answers: OnboardingAnswersDraft;
  onChange: (patch: Partial<OnboardingAnswersDraft>) => void;
  showErrors: boolean;
}

const REQUIRED_ERROR = 'Selecciona una opción para continuar.';

export function StrengthStep({ answers, onChange, showErrors }: StrengthStepProps) {
  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <span className="onboarding-step__eyebrow text-label">Fuerza</span>
        <h1 className="onboarding-step__title text-title">Tu experiencia con pesas</h1>
      </div>

      <SingleOptionGroup
        legend="¿Cuánta experiencia tienes entrenando con pesas?"
        name="strengthExperience"
        options={STRENGTH_EXPERIENCE_OPTIONS}
        value={answers.strengthExperience}
        onChange={(value) => onChange({ strengthExperience: value as StrengthExperience })}
        error={showErrors && !answers.strengthExperience ? REQUIRED_ERROR : undefined}
      />

      <SingleOptionGroup
        legend="¿Entrenas actualmente con pesas?"
        name="currentStrengthFrequency"
        options={CURRENT_STRENGTH_FREQUENCY_OPTIONS}
        value={answers.currentStrengthFrequency}
        onChange={(value) => onChange({ currentStrengthFrequency: value as CurrentStrengthFrequency })}
        error={showErrors && !answers.currentStrengthFrequency ? REQUIRED_ERROR : undefined}
      />

      <SingleOptionGroup
        legend="¿Conoces la técnica básica de los ejercicios de gimnasio?"
        name="techniqueFamiliarity"
        options={TECHNIQUE_FAMILIARITY_OPTIONS}
        value={answers.techniqueFamiliarity}
        onChange={(value) => onChange({ techniqueFamiliarity: value as TechniqueFamiliarity })}
        error={showErrors && !answers.techniqueFamiliarity ? REQUIRED_ERROR : undefined}
      />
    </div>
  );
}
