import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { Badge } from '../components/Badge/Badge';
import { GlassCard } from '../components/GlassCard/GlassCard';
import { AuthLayout } from '../layouts/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useFitnessProfile } from '../hooks/useFitnessProfile';
import { signOut } from '../services/authService';
import { CARDIO_STARTING_POINT_COPY, GOAL_LABELS, STRENGTH_STARTING_POINT_COPY } from '../utils/startingPointMessages';
import './auth/AuthForms.css';
import './PrivateHomePage.css';

export function PrivateHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, status: profileStatus, error: profileError, refresh: refreshProfile } = useProfile();
  const { fitnessProfile, status: fitnessStatus, error: fitnessError, refresh: refreshFitness } = useFitnessProfile();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    navigate('/', { replace: true });
  }

  const displayName = profile?.displayName || user?.email || 'Nexora';
  const loading = profileStatus === 'idle' || profileStatus === 'loading' || fitnessStatus === 'idle' || fitnessStatus === 'loading';
  const hasError = profileStatus === 'error' || fitnessStatus === 'error';

  return (
    <AuthLayout>
      <header className="auth-header">
        <span className="auth-header__eyebrow text-label">Nexora</span>
        <h1 className="auth-header__title text-title">Zona privada</h1>
      </header>

      {loading && (
        <p className="text-small text-secondary" role="status">
          Cargando tu punto de partida…
        </p>
      )}

      {hasError && (
        <>
          <p className="auth-alert auth-alert--error text-small" role="alert">
            {profileError ?? fitnessError}
          </p>
          <Button
            variant="secondary"
            size="medium"
            onClick={() => {
              refreshProfile();
              refreshFitness();
            }}
          >
            Reintentar
          </Button>
        </>
      )}

      {!loading && !hasError && fitnessProfile && (
        <>
          <p className="text-body">
            Hola, <strong>{displayName}</strong>.
          </p>

          <GlassCard level="subtle">
            <p className="text-label text-secondary">Fuerza</p>
            <p className="text-heading">{STRENGTH_STARTING_POINT_COPY[fitnessProfile.strengthStartingPoint].title}</p>
            <p className="text-small text-secondary">
              {STRENGTH_STARTING_POINT_COPY[fitnessProfile.strengthStartingPoint].description}
            </p>
          </GlassCard>

          <GlassCard level="subtle">
            <p className="text-label text-secondary">Cardio</p>
            <p className="text-heading">{CARDIO_STARTING_POINT_COPY[fitnessProfile.cardioStartingPoint].title}</p>
            <p className="text-small text-secondary">
              {CARDIO_STARTING_POINT_COPY[fitnessProfile.cardioStartingPoint].description}
            </p>
          </GlassCard>

          {fitnessProfile.goals.length > 0 && (
            <GlassCard level="subtle">
              <p className="text-label text-secondary">Objetivos</p>
              <div className="private-home__goals">
                {fitnessProfile.goals.map((goal) => (
                  <Badge key={goal} tone="brand">
                    {GOAL_LABELS[goal]}
                  </Badge>
                ))}
              </div>
            </GlassCard>
          )}

          <p className="text-body">
            <strong>Tu siguiente versión empieza aquí.</strong>
          </p>
        </>
      )}

      {!loading && !hasError && !fitnessProfile && (
        <p className="text-small text-secondary" role="status">
          Tu perfil deportivo se está preparando. Esto puede tardar unos segundos.
        </p>
      )}

      <Button variant="ghost" size="medium" fullWidth loading={signingOut} onClick={handleSignOut}>
        Cerrar sesión
      </Button>
    </AuthLayout>
  );
}
