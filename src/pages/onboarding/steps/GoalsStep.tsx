import { MultiOptionGroup } from '../../../components/OptionCard/OptionGroup';
import { GOAL_OPTIONS } from '../onboardingOptions';
import type { OnboardingAnswersDraft } from '../../../hooks/useOnboardingDraft';
import type { Goal } from '../../../types/onboarding';

interface GoalsStepProps {
  answers: OnboardingAnswersDraft;
  onChange: (patch: Partial<OnboardingAnswersDraft>) => void;
  showErrors: boolean;
}

export function GoalsStep({ answers, onChange, showErrors }: GoalsStepProps) {
  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <span className="onboarding-step__eyebrow text-label">Objetivos</span>
        <h1 className="onboarding-step__title text-title">¿Qué quieres conseguir?</h1>
        <p className="onboarding-step__description text-small">Puedes elegir varios.</p>
      </div>

      <MultiOptionGroup
        legend="Selecciona tus objetivos"
        name="goals"
        options={GOAL_OPTIONS}
        values={answers.goals}
        onChange={(values) => onChange({ goals: values as Goal[] })}
        error={showErrors && answers.goals.length === 0 ? 'Selecciona al menos un objetivo.' : undefined}
      />
    </div>
  );
}
