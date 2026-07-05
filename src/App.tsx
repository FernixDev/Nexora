import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { WelcomePage } from './pages/WelcomePage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { PrivateHomePage } from './pages/PrivateHomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CheckEmailPage } from './pages/auth/CheckEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AuthProvider, useAuth } from './hooks/useAuth';

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
          path="/app"
          element={
            <RequireAuth>
              <PrivateHomePage />
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
