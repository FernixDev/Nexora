import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Button } from './components/Button/Button';
import { WelcomePage } from './pages/WelcomePage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { PrivateHomePage } from './pages/PrivateHomePage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CheckEmailPage } from './pages/auth/CheckEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import type { Profile } from './types/profile';

function LoadingScreen() {
  return (
    <div className="app-loading" role="status">
      Cargando…
    </div>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading') return <LoadingScreen />;
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading') return <LoadingScreen />;
  if (status === 'authenticated') return <Navigate to="/app" replace />;
  return <>{children}</>;
}

/**
 * Espera a conocer el perfil del usuario antes de decidir a dónde va: evita
 * mostrar la zona privada o el onboarding antes de saber si
 * onboarding_completed es true o false.
 */
function ProfileGate({ children }: { children: (profile: Profile) => ReactNode }) {
  const { profile, status, error, refresh } = useProfile();

  if (status === 'idle' || status === 'loading') return <LoadingScreen />;

  if (status === 'error' || !profile) {
    return (
      <div className="app-loading" role="alert">
        <p>{error ?? 'Tu perfil se está preparando. Esto puede tardar unos segundos.'}</p>
        <Button variant="secondary" size="medium" onClick={refresh}>
          Reintentar
        </Button>
      </div>
    );
  }

  return <>{children(profile)}</>;
}

function RequireOnboardingComplete({ children }: { children: ReactNode }) {
  return (
    <ProfileGate>
      {(profile) => (profile.onboardingCompleted ? <>{children}</> : <Navigate to="/onboarding" replace />)}
    </ProfileGate>
  );
}

function RequireOnboardingIncomplete({ children }: { children: ReactNode }) {
  return (
    <ProfileGate>
      {(profile) => (!profile.onboardingCompleted ? <>{children}</> : <Navigate to="/app" replace />)}
    </ProfileGate>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hasBottomNav = location.pathname === '/design-system';

  return (
    <AppLayout hasBottomNav={hasBottomNav}>
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnly>
              <WelcomePage />
            </PublicOnly>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />
        <Route
          path="/registro"
          element={
            <PublicOnly>
              <RegisterPage />
            </PublicOnly>
          }
        />
        <Route path="/revisa-tu-correo" element={<CheckEmailPage />} />
        <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
        <Route path="/nueva-contrasena" element={<ResetPasswordPage />} />
        <Route
          path="/onboarding"
          element={
            <RequireAuth>
              <RequireOnboardingIncomplete>
                <OnboardingPage />
              </RequireOnboardingIncomplete>
            </RequireAuth>
          }
        />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <RequireOnboardingComplete>
                <PrivateHomePage />
              </RequireOnboardingComplete>
            </RequireAuth>
          }
        />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
