import { AppLayout } from './layouts/AppLayout';
import { WelcomePage } from './pages/WelcomePage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { useLocationHash } from './hooks/useLocationHash';

function App() {
  const hash = useLocationHash();
  const isDesignSystem = hash === '#/design-system';

  return (
    <AppLayout hasBottomNav={isDesignSystem}>
      {isDesignSystem ? <DesignSystemPage /> : <WelcomePage />}
    </AppLayout>
  );
}

export default App;
