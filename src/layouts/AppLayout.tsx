import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  hasBottomNav?: boolean;
}

export function AppLayout({ children, hasBottomNav = false }: AppLayoutProps) {
  const classes = ['app-shell', hasBottomNav ? 'app-shell--with-nav' : ''].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
