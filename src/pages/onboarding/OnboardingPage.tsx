import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../layouts/OnboardingLayout';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useOnboardingDraft, type OnboardingAnswersDraft, type OnboardingPersonalDraft } from '../../hooks/useOnboardingDraft';
import { completeOnboarding } from '../../services/onboardingService';
import {
  isAvailabilityStepValid,
  isCurrentStateStepValid,
  isGoalsStepValid,
  isPersonalDataStepValid,
  isStrengthStepValid,
  toOnboardingAnswers,
  toOnboardingPersonalData,
} from './onboardingValidation';
import { WelcomeStep } from './steps/WelcomeStep';
import { PersonalDataStep } from './steps/PersonalDataStep';
import { CurrentStateStep } from './steps/CurrentStateStep';
import { StrengthStep } from './steps/StrengthStep';
import { GoalsStep } from './steps/GoalsStep';
import { AvailabilityStep } from './steps/AvailabilityStep';
import { SummaryStep } from './steps/SummaryStep';
import './Onboarding.css';

const STEP_COUNT = 7;
const STEP_LABELS = ['Bienvenida', 'Tus datos', 'Estado actual', 'Fuerza', 'Objetivos', 'Disponibilidad', 'Resumen'];

function isStepValid(step: number, personal: OnboardingPersonalDraft, answers: OnboardingAnswersDraft): boolean {
  switch (step) {
    case 2:
      return isPersonalDataStepValid(personal);
    case 3:
      return isCurrentStateStepValid(answers);
    case 4:
      return isStrengthStepValid(answers);
    case 5:
      return isGoalsStepValid(answers);
    case 6:
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

  function updateAnswers(patch: Partial<OnboardingAnswersDraft>) {
    setDraft((prev) => ({ ...prev, answers: { ...prev.answers, ...patch } }));
  }

  async function handleContinue() {
    if (step < STEP_COUNT) {
      if (!isStepValid(step, draft.personal, draft.answers)) {
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
      await completeOnboarding(userId, personalData, answers);
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
      {step === 2 && <PersonalDataStep personal={draft.personal} onChange={updatePersonal} showErrors={attemptedNext} />}
      {step === 3 && <CurrentStateStep answers={draft.answers} onChange={updateAnswers} showErrors={attemptedNext} />}
      {step === 4 && <StrengthStep answers={draft.answers} onChange={updateAnswers} showErrors={attemptedNext} />}
      {step === 5 && <GoalsStep answers={draft.answers} onChange={updateAnswers} showErrors={attemptedNext} />}
      {step === 6 && <AvailabilityStep answers={draft.answers} onChange={updateAnswers} showErrors={attemptedNext} />}
      {step === 7 && <SummaryStep personal={draft.personal} answers={draft.answers} submissionError={submissionError} />}
    </OnboardingLayout>
  );
}
