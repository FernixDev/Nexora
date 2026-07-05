import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { AuthLayout } from '../../layouts/AuthLayout';
import { signUpWithPassword } from '../../services/authService';
import { mapAuthError } from '../../utils/authErrors';
import './AuthForms.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validate(name: string, email: string, password: string, confirmPassword: string): string | null {
  if (!name.trim()) return 'Introduce tu nombre.';
  if (!EMAIL_PATTERN.test(email)) return 'Introduce un correo válido.';
  if (password.length < MIN_PASSWORD_LENGTH) return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
  return null;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validate(name, email, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await signUpWithPassword({ email, password, displayName: name.trim() });

    if (signUpError) {
      setError(mapAuthError(signUpError));
      setLoading(false);
      return;
    }

    if (data.session) {
      navigate('/app', { replace: true });
      return;
    }

    navigate(`/revisa-tu-correo?email=${encodeURIComponent(email)}`, { replace: true });
  }

  return (
    <AuthLayout>
      <header className="auth-header">
        <span className="auth-header__eyebrow text-label">Nexora</span>
        <h1 className="auth-header__title text-title">Crea tu cuenta</h1>
        <p className="auth-header__description text-small">Tu siguiente versión empieza aquí.</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="auth-alert auth-alert--error text-small" role="alert">
            {error}
          </p>
        )}

        <Input
          label="Nombre"
          type="text"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
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
          Crear cuenta
        </Button>
      </form>

      <div className="auth-links">
        <p className="text-small text-secondary">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
