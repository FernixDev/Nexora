import { useState } from 'react';
import { Button } from '../components/Button/Button';
import { ArrowRightIcon } from '../components/icons';
import './WelcomePage.css';

type DemoStatus = 'idle' | 'start' | 'login';

const DEMO_MESSAGES: Record<Exclude<DemoStatus, 'idle'>, string> = {
  start: 'Muy pronto podrás crear tu cuenta y comenzar tu plan.',
  login: 'Muy pronto podrás iniciar sesión con tu cuenta.',
};

export function WelcomePage() {
  const [status, setStatus] = useState<DemoStatus>('idle');

  return (
    <main className="welcome">
      <div className="welcome-card glass-strong">
        <span className="welcome-badge text-label">Nexora</span>
        <h1 className="welcome-title text-display">Nexora</h1>
        <p className="welcome-slogan text-subtitle">Tu siguiente versión</p>
        <p className="welcome-message text-body text-secondary">
          Empieza donde estás. Avanza a tu ritmo.
        </p>

        <div className="welcome-actions">
          <Button
            size="large"
            fullWidth
            trailingIcon={<ArrowRightIcon />}
            onClick={() => setStatus('start')}
          >
            Comenzar
          </Button>
          <Button variant="ghost" size="medium" fullWidth onClick={() => setStatus('login')}>
            Ya tengo una cuenta
          </Button>
        </div>

        {status !== 'idle' && (
          <p className="welcome-status text-small text-muted" role="status">
            {DEMO_MESSAGES[status]}
          </p>
        )}
      </div>

      <a className="welcome-dev-link text-small" href="#/design-system">
        Design System (dev)
      </a>

      <div className="welcome-signature">
        <span className="welcome-signature-label">App desarrollada por</span>
        <span className="welcome-signature-author">FernixDev</span>
      </div>
    </main>
  );
}
