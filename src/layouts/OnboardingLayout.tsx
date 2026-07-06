import type { ReactNode } from 'react';
import gymBackdrop from '../assets/welcome-gym.jpg';
import { Button } from '../components/Button/Button';
import { Progress } from '../components/Progress/Progress';
import './OnboardingLayout.css';

interface OnboardingLayoutProps {
  children: ReactNode;
  stepIndex: number;
  stepCount: number;
  stepLabel: string;
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueLoading?: boolean;
  canGoBack?: boolean;
}

/**
 * Escena compartida por todos los pasos del onboarding: mismo fondo
 * deportivo que la autenticación, cabecera con progreso y un panel de
 * cristal con el contenido del paso actual. La navegación (Atrás/Continuar)
 * vive en un pie fijo para que siempre esté accesible sin depender de dónde
 * termine el scroll del contenido.
 */
export function OnboardingLayout({
  children,
  stepIndex,
  stepCount,
  stepLabel,
  onBack,
  onContinue,
  continueLabel = 'Continuar',
  continueLoading = false,
  canGoBack = true,
}: OnboardingLayoutProps) {
  const progressValue = (stepIndex / stepCount) * 100;

  return (
    <div className="onboarding-shell">
      <div className="onboarding-backdrop" aria-hidden="true">
        <img className="onboarding-backdrop__image" src={gymBackdrop} alt="" loading="eager" fetchPriority="high" />
        <div className="onboarding-backdrop__scrim" />
      </div>

      <header className="onboarding-header">
        <Progress value={progressValue} label={`Paso ${stepIndex} de ${stepCount} · ${stepLabel}`} showValue={false} />
      </header>

      <main className="onboarding-content glass-strong">{children}</main>

      <footer className="onboarding-footer">
        <Button variant="ghost" size="large" onClick={onBack} disabled={!onBack || !canGoBack}>
          Atrás
        </Button>
        <Button variant="primary" size="large" fullWidth loading={continueLoading} onClick={onContinue}>
          {continueLabel}
        </Button>
      </footer>
    </div>
  );
}
