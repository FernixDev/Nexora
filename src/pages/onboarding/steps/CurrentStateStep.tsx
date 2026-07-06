import { SingleOptionGroup } from '../../../components/OptionCard/OptionGroup';
import {
  RUNNING_CAPACITY_OPTIONS,
  TRAINING_GAP_OPTIONS,
  WALKING_CAPACITY_OPTIONS,
  WEEKLY_ACTIVITY_DAYS_OPTIONS,
} from '../onboardingOptions';
import type { OnboardingAnswersDraft } from '../../../hooks/useOnboardingDraft';
import type { RunningCapacity, TrainingGap, WalkingCapacity, WeeklyActivityDays } from '../../../types/onboarding';

interface CurrentStateStepProps {
  answers: OnboardingAnswersDraft;
  onChange: (patch: Partial<OnboardingAnswersDraft>) => void;
  showErrors: boolean;
}

const REQUIRED_ERROR = 'Selecciona una opción para continuar.';

export function CurrentStateStep({ answers, onChange, showErrors }: CurrentStateStepProps) {
  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <span className="onboarding-step__eyebrow text-label">Estado actual</span>
        <h1 className="onboarding-step__title text-title">¿Dónde estás hoy?</h1>
      </div>

      <SingleOptionGroup
        legend="¿Cuánto hace que no entrenas regularmente?"
        name="trainingGap"
        options={TRAINING_GAP_OPTIONS}
        value={answers.trainingGap}
        onChange={(value) => onChange({ trainingGap: value as TrainingGap })}
        error={showErrors && !answers.trainingGap ? REQUIRED_ERROR : undefined}
      />

      <SingleOptionGroup
        legend="¿Cuánto tiempo puedes caminar sin parar?"
        name="walkingCapacity"
        options={WALKING_CAPACITY_OPTIONS}
        value={answers.walkingCapacity}
        onChange={(value) => onChange({ walkingCapacity: value as WalkingCapacity })}
        error={showErrors && !answers.walkingCapacity ? REQUIRED_ERROR : undefined}
      />

      <SingleOptionGroup
        legend="¿Puedes correr actualmente?"
        name="runningCapacity"
        options={RUNNING_CAPACITY_OPTIONS}
        value={answers.runningCapacity}
        onChange={(value) => onChange({ runningCapacity: value as RunningCapacity })}
        error={showErrors && !answers.runningCapacity ? REQUIRED_ERROR : undefined}
      />

      <SingleOptionGroup
        legend="¿Cuántos días a la semana haces actividad física actualmente?"
        name="weeklyActivityDays"
        options={WEEKLY_ACTIVITY_DAYS_OPTIONS}
        value={answers.weeklyActivityDays !== null ? String(answers.weeklyActivityDays) : null}
        onChange={(value) => onChange({ weeklyActivityDays: Number(value) as WeeklyActivityDays })}
        error={showErrors && answers.weeklyActivityDays === null ? REQUIRED_ERROR : undefined}
      />
    </div>
  );
}
