import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { updatePassword } from '../../services/authService';
import { mapAuthError } from '../../utils/authErrors';
import './AuthForms.css';

const MIN_PASSWORD_LENGTH = 8;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { isPasswordRecovery, clearPasswordRecovery } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateError } = await updatePassword(password);

    if (updateError) {
      setError(mapAuthError(updateError));
      setLoading(false);
      return;
    }

    clearPasswordRecovery();
    navigate('/app', { replace: true });
  }

  if (!isPasswordRecovery) {
    return (
      <AuthLayout>
        <header className="auth-header">
          <span className="auth-header__eyebrow text-label">Nexora</span>
          <h1 className="auth-header__title text-title">Enlace no válido</h1>
          <p className="auth-header__description text-small">
            Este enlace de recuperación no es válido o ha caducado. Solicita uno nuevo.
          </p>
        </header>
        <div className="auth-links">
          <Link to="/recuperar-contrasena" className="text-small">
            Solicitar nuevo enlace
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <header className="auth-header">
        <span className="auth-header__eyebrow text-label">Nexora</span>
        <h1 className="auth-header__title text-title">Nueva contraseña</h1>
        <p className="auth-header__description text-small">Elige una contraseña nueva para tu cuenta.</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="auth-alert auth-alert--error text-small" role="alert">
            {error}
          </p>
        )}

        <Input
          label="Nueva contraseña"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          helperText={`Al menos ${MIN_PASSWORD_LENGTH} caracteres.`}
        />
        <Input
          label="Repite la contraseña"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <Button type="submit" size="large" fullWidth loading={loading}>
          Guardar contraseña
        </Button>
      </form>
    </AuthLayout>
  );
}
