import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../layouts/OnboardingLayout';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import {
  useOnboardingDraft,
  type OnboardingAnswersDraft,
  type OnboardingPersonalDraft,
  type OnboardingSportsDraft,
} from '../../hooks/useOnboardingDraft';
import { completeOnboarding } from '../../services/onboardingService';
import {
  isAvailabilityStepValid,
  isCurrentStateStepValid,
  isGoalsStepValid,
  isPersonalDataStepValid,
  isSportsStepValid,
  isStrengthStepValid,
  toOnboardingAnswers,
  toOnboardingPersonalData,
  toUserSportSelections,
} from './onboardingValidation';
import { WelcomeStep } from './steps/WelcomeStep';
import { SportsStep } from './steps/SportsStep';
import { PersonalDataStep } from './steps/PersonalDataStep';
import { CurrentStateStep } from './steps/CurrentStateStep';
import { StrengthStep } from './steps/StrengthStep';
import { GoalsStep } from './steps/GoalsStep';
import { AvailabilityStep } from './steps/AvailabilityStep';
import { SummaryStep } from './steps/SummaryStep';
import './Onboarding.css';

const STEP_COUNT = 8;
const STEP_LABELS = [
  'Bienvenida',
  'Deportes',
  'Tus datos',
  'Estado actual',
  'Fuerza',
  'Objetivos',
  'Disponibilidad',
  'Resumen',
];

function isStepValid(
  step: number,
  personal: OnboardingPersonalDraft,
  sports: OnboardingSportsDraft,
  answers: OnboardingAnswersDraft,
): boolean {
  switch (step) {
    case 2:
      return isSportsStepValid(sports);
    case 3:
      return isPersonalDataStepValid(personal);
    case 4:
      return isCurrentStateStepValid(answers);
    case 5:
      return isStrengthStepValid(answers);
    case 6:
      return isGoalsStepValid(answers);
    case 7:
      return isAvailabilityStepValid(answers);
    default:
      return true;
  }
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user!.id;
  const { profile } = useProfile();
  const { draft, setDraft, clearDraft } = useOnboardingDraft(userId);
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Si el usuario ya tenía nombre guardado (por ejemplo, desde el registro), lo usamos para no pedirlo dos veces.
  useEffect(() => {
    if (profile?.displayName && !draft.personal.displayName) {
      setDraft((prev) => ({ ...prev, personal: { ...prev.personal, displayName: profile.displayName ?? '' } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.displayName]);

  const step = draft.step;

  function goToStep(nextStep: number) {
    setAttemptedNext(false);
    setSubmissionError(null);
    setDraft((prev) => ({ ...prev, step: nextStep }));
  }

  function updatePersonal(patch: Partial<OnboardingPersonalDraft>) {
    setDraft((prev) => ({ ...prev, personal: { ...prev.personal, ...patch } }));
  }

  function updateSports(patch: Partial<OnboardingSportsDraft>) {
    setDraft((prev) => ({ ...prev, sports: { ...prev.sports, ...patch } }));
  }

  function updateAnswers(patch: Partial<OnboardingAnswersDraft>) {
    setDraft((prev) => ({ ...prev, answers: { ...prev.answers, ...patch } }));
  }

  async function handleContinue() {
    if (step < STEP_COUNT) {
      if (!isStepValid(step, draft.personal, draft.sports, draft.answers)) {
        setAttemptedNext(true);
        return;
      }
      goToStep(step + 1);
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);

    try {
      const personalData = toOnboardingPersonalData(draft.personal);
      const answers = toOnboardingAnswers(draft.answers);
      const sportSelections = toUserSportSelections(draft.sports);
      await completeOnboarding(userId, personalData, answers, sportSelections);
      clearDraft();
      navigate('/app', { replace: true });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[onboarding] Error al guardar el onboarding:', err);
      }
      setSubmissionError('No hemos podido guardar tu punto de partida. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (step > 1) {
      goToStep(step - 1);
    }
  }

  return (
    <OnboardingLayout
      stepIndex={step}
      stepCount={STEP_COUNT}
      stepLabel={STEP_LABELS[step - 1] ?? ''}
      onBack={step > 1 ? handleBack : undefined}
      onContinue={handleContinue}
      continueLabel={step === STEP_COUNT ? 'Crear mi punto de partida' : 'Continuar'}
      continueLoading={submitting}
    >
      {step === 1 && <WelcomeStep />}
      {step === 2 && <SportsStep sports={draft.sports} onChange={updateSports} showErrors={attemptedNext} />}
      {step === 3 && <PersonalDataStep personal={draft.personal} onChange={updatePersonal} showErrors={attemptedNext} />}
      {step === 4 && <CurrentStateStep answers={draft.answers} onChange={updateAnswers} showErrors={attemptedNext} />}
      {step === 5 && <StrengthStep answers={draft.answers} onChange={updateAnswers} showErrors={attemptedNext} />}
      {step === 6 && <GoalsStep answers={draft.answers} onChange={updateAnswers} showErrors={attemptedNext} />}
      {step === 7 && <AvailabilityStep answers={draft.answers} onChange={updateAnswers} showErrors={attemptedNext} />}
      {step === 8 && (
        <SummaryStep personal={draft.personal} sports={draft.sports} answers={draft.answers} submissionError={submissionError} />
      )}
    </OnboardingLayout>
  );
}
