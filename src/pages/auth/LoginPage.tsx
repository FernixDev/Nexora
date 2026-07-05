import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { AuthLayout } from '../../layouts/AuthLayout';
import { signInWithPassword } from '../../services/authService';
import { isEmailNotConfirmedError, mapAuthError } from '../../utils/authErrors';
import './AuthForms.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResendLink, setShowResendLink] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setShowResendLink(false);

    const { error: signInError } = await signInWithPassword({ email, password });

    if (signInError) {
      setError(mapAuthError(signInError));
      setShowResendLink(isEmailNotConfirmedError(signInError));
      setLoading(false);
      return;
    }

    navigate('/app', { replace: true });
  }

  return (
    <AuthLayout>
      <header className="auth-header">
        <span className="auth-header__eyebrow text-label">Nexora</span>
        <h1 className="auth-header__title text-title">Inicia sesión</h1>
        <p className="auth-header__description text-small">Continúa donde lo dejaste.</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="auth-alert auth-alert--error text-small" role="alert">
            {error}
            {showResendLink && (
              <>
                {' '}
                <Link to={`/revisa-tu-correo?email=${encodeURIComponent(email)}`}>Reenviar confirmación</Link>
              </>
            )}
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
        <Input
          label="Contraseña"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" size="large" fullWidth loading={loading}>
          Entrar
        </Button>
      </form>

      <div className="auth-links">
        <Link to="/recuperar-contrasena" className="text-small">
          ¿Has olvidado tu contraseña?
        </Link>
        <p className="text-small text-secondary">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
