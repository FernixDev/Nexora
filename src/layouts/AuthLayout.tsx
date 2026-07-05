import type { ReactNode } from 'react';
import gymBackdrop from '../assets/welcome-gym.jpg';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: ReactNode;
  /** Contenido opcional fuera de la tarjeta (sobre el fondo), como enlaces discretos o firma. */
  footer?: ReactNode;
}

/**
 * Escena compartida por la pantalla de bienvenida y toda la autenticación:
 * el mismo fondo deportivo con velo, y una tarjeta de cristal centrada.
 * Mantiene la identidad visual coherente sin duplicar el fondo en cada pantalla.
 */
export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <main className="auth-shell">
      <div className="auth-backdrop" aria-hidden="true">
        <img
          className="auth-backdrop__image"
          src={gymBackdrop}
          alt=""
          loading="eager"
          fetchPriority="high"
        />
        <div className="auth-backdrop__scrim" />
      </div>

      <div className="auth-card glass-strong">{children}</div>
      {footer}
    </main>
  );
}
