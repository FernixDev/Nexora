import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { ArrowRightIcon } from '../components/icons';
import { AuthLayout } from '../layouts/AuthLayout';
import './WelcomePage.css';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      footer={
        <>
          <Link className="welcome-dev-link text-small" to="/design-system">
            Design System (dev)
          </Link>

          <div className="welcome-signature">
            <span className="welcome-signature-label">App desarrollada por</span>
            <span className="welcome-signature-author">FernixDev</span>
          </div>
        </>
      }
    >
      <span className="welcome-badge text-label">Nexora</span>
      <h1 className="welcome-title">Nexora</h1>
      <p className="welcome-slogan text-label">Tu siguiente versión</p>
      <p className="welcome-message">
        Más fuerte.
        <br />
        Más lejos.
        <br />
        Más tú.
      </p>

      <div className="welcome-actions">
        <Button size="large" fullWidth trailingIcon={<ArrowRightIcon />} onClick={() => navigate('/registro')}>
          Comenzar
        </Button>
        <Button variant="ghost" size="medium" fullWidth onClick={() => navigate('/login')}>
          Ya tengo una cuenta
        </Button>
      </div>
    </AuthLayout>
  );
}
