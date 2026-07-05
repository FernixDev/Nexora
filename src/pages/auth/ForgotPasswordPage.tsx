import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { AuthLayout } from '../../layouts/AuthLayout';
import { sendPasswordResetEmail } from '../../services/authService';
import { mapAuthError } from '../../utils/authErrors';
import './AuthForms.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email)) {
      setStatus('error');
      setError('Introduce un correo válido.');
      return;
    }

    setStatus('sending');
    setError(null);

    const { error: resetError } = await sendPasswordResetEmail(email);

    if (resetError) {
      setStatus('error');
      setError(mapAuthError(resetError));
      return;
    }

    setStatus('sent');
  }

  return (
    <AuthLayout>
      <header className="auth-header">
        <span className="auth-header__eyebrow text-label">Nexora</span>
        <h1 className="auth-header__title text-title">Recuperar contraseña</h1>
        <p className="auth-header__description text-small">
          Introduce tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </header>

      {status === 'sent' ? (
        <p className="auth-alert auth-alert--success text-small" role="status">
          Si existe una cuenta con ese correo, te hemos enviado un enlace para restablecer tu contraseña.
        </p>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {status === 'error' && error && (
            <p className="auth-alert auth-alert--error text-small" role="alert">
              {error}
            </p>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Button type="submit" size="large" fullWidth loading={status === 'sending'}>
            Enviar enlace
          </Button>
        </form>
      )}

      <div className="auth-links">
        <Link to="/login" className="text-small">
          Volver al inicio de sesión
        </Link>
      </div>
    </AuthLayout>
  );
}
