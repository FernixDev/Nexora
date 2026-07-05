import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { AuthLayout } from '../../layouts/AuthLayout';
import { resendConfirmationEmail } from '../../services/authService';
import { mapAuthError } from '../../utils/authErrors';
import './AuthForms.css';

const RESEND_COOLDOWN_MS = 30_000;

type ResendState = 'idle' | 'sending' | 'sent' | 'error';

export function CheckEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [resendState, setResendState] = useState<ResendState>('idle');
  const [resendError, setResendError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const isCoolingDown = cooldownUntil !== null && now < cooldownUntil;

  async function handleResend() {
    if (!email || isCoolingDown) return;

    setResendState('sending');
    setResendError(null);

    const { error } = await resendConfirmationEmail(email);

    if (error) {
      setResendState('error');
      setResendError(mapAuthError(error));
      return;
    }

    setResendState('sent');
    const until = Date.now() + RESEND_COOLDOWN_MS;
    setCooldownUntil(until);
    setNow(Date.now());
    window.setTimeout(() => setNow(Date.now()), RESEND_COOLDOWN_MS + 100);
  }

  return (
    <AuthLayout>
      <header className="auth-header">
        <span className="auth-header__eyebrow text-label">Nexora</span>
        <h1 className="auth-header__title text-title">Revisa tu correo</h1>
        <p className="auth-header__description text-small">
          Hemos enviado un enlace de confirmación a{' '}
          {email ? <span className="auth-email-highlight">{email}</span> : 'tu correo'}. Ábrelo para activar tu
          cuenta.
        </p>
      </header>

      {resendState === 'sent' && (
        <p className="auth-alert auth-alert--success text-small" role="status">
          Correo reenviado. Revisa también la carpeta de spam.
        </p>
      )}
      {resendState === 'error' && resendError && (
        <p className="auth-alert auth-alert--error text-small" role="alert">
          {resendError}
        </p>
      )}

      <div className="auth-links">
        <Button
          variant="secondary"
          size="medium"
          fullWidth
          loading={resendState === 'sending'}
          disabled={!email || isCoolingDown}
          onClick={handleResend}
        >
          Reenviar correo
        </Button>
        <Link to="/login" className="text-small">
          Volver al inicio de sesión
        </Link>
      </div>
    </AuthLayout>
  );
}
