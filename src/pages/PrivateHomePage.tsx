import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { AuthLayout } from '../layouts/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { signOut } from '../services/authService';
import './auth/AuthForms.css';

export function PrivateHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, status, error, refresh } = useProfile();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    navigate('/', { replace: true });
  }

  const displayName = profile?.displayName || user?.email || 'Nexora';

  return (
    <AuthLayout>
      <header className="auth-header">
        <span className="auth-header__eyebrow text-label">Nexora</span>
        <h1 className="auth-header__title text-title">Zona privada</h1>
      </header>

      {(status === 'idle' || status === 'loading') && (
        <p className="text-small text-secondary" role="status">
          Cargando tu perfil…
        </p>
      )}

      {status === 'error' && (
        <>
          <p className="auth-alert auth-alert--error text-small" role="alert">
            {error}
          </p>
          <Button variant="secondary" size="medium" onClick={refresh}>
            Reintentar
          </Button>
        </>
      )}

      {status === 'ready' && !profile && (
        <>
          <p className="text-small text-secondary" role="status">
            Tu perfil se está preparando. Esto puede tardar unos segundos.
          </p>
          <Button variant="secondary" size="medium" onClick={refresh}>
            Reintentar
          </Button>
        </>
      )}

      {status === 'ready' && profile && !profile.onboardingCompleted && (
        <>
          <p className="text-body">
            Hola, <strong>{displayName}</strong>.
          </p>
          <p className="text-small text-secondary">{user?.email}</p>
          <p className="text-small text-secondary">
            Tu perfil está listo para comenzar. El siguiente paso será preparar tu perfil deportivo (fuerza, carrera y
            movilidad), pero eso llegará en una próxima misión.
          </p>
        </>
      )}

      {status === 'ready' && profile && profile.onboardingCompleted && (
        <>
          <p className="text-body">
            Bienvenido de nuevo, <strong>{displayName}</strong>.
          </p>
          <p className="text-small text-secondary">{user?.email}</p>
        </>
      )}

      <Button variant="ghost" size="medium" fullWidth loading={signingOut} onClick={handleSignOut}>
        Cerrar sesión
      </Button>
    </AuthLayout>
  );
}
