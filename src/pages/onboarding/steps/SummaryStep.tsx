import { Badge } from '../../../components/Badge/Badge';
import { GlassCard } from '../../../components/GlassCard/GlassCard';
import { calculateAge } from '../../../utils/age';
import { inferCardioStartingPoint, inferStrengthStartingPoint } from '../../../utils/fitnessInference';
import { CARDIO_STARTING_POINT_COPY, GOAL_LABELS, STRENGTH_STARTING_POINT_COPY } from '../../../utils/startingPointMessages';
import { toOnboardingAnswers } from '../onboardingValidation';
import type { OnboardingAnswersDraft, OnboardingPersonalDraft } from '../../../hooks/useOnboardingDraft';

interface SummaryStepProps {
  personal: OnboardingPersonalDraft;
  answers: OnboardingAnswersDraft;
  submissionError: string | null;
}

export function SummaryStep({ personal, answers, submissionError }: SummaryStepProps) {
  const onboardingAnswers = toOnboardingAnswers(answers);
  const strengthStartingPoint = inferStrengthStartingPoint(onboardingAnswers);
  const cardioStartingPoint = inferCardioStartingPoint(onboardingAnswers);
  const strengthCopy = STRENGTH_STARTING_POINT_COPY[strengthStartingPoint];
  const cardioCopy = CARDIO_STARTING_POINT_COPY[cardioStartingPoint];
  const age = calculateAge(personal.birthDate);

  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <span className="onboarding-step__eyebrow text-label">Resumen</span>
        <h1 className="onboarding-step__title text-title">Tu punto de partida</h1>
        <p className="onboarding-step__description text-small">
          Esto es lo que hemos entendido a partir de tus respuestas.
        </p>
      </div>

      {submissionError && (
        <p className="onboarding-alert text-small" role="alert" aria-live="polite">
          {submissionError}
        </p>
      )}

      <GlassCard level="subtle">
        <p className="text-label text-secondary">Fuerza</p>
        <p className="text-heading">{strengthCopy.title}</p>
        <p className="text-small text-secondary">{strengthCopy.description}</p>
      </GlassCard>

      <GlassCard level="subtle">
        <p className="text-label text-secondary">Cardio</p>
        <p className="text-heading">{cardioCopy.title}</p>
        <p className="text-small text-secondary">{cardioCopy.description}</p>
      </GlassCard>

      <GlassCard level="subtle">
        <p className="text-label text-secondary">Tus datos</p>
        <p className="text-body">
          {personal.displayName} · {age} años
        </p>
        <p className="text-small text-secondary">
          {personal.heightCm} cm · {personal.currentWeightKg} kg
        </p>
      </GlassCard>

      <GlassCard level="subtle">
        <p className="text-label text-secondary">Objetivos</p>
        <div className="onboarding-summary__goals">
          {answers.goals.map((goal) => (
            <Badge key={goal} tone="brand">
              {GOAL_LABELS[goal]}
            </Badge>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
