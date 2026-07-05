import type { ReactNode } from 'react';
import './BottomNav.css';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function BottomNav({ items, activeId, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav-wrap" aria-label="Navegación principal">
      <div className="bottom-nav glass-strong">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              className={`bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onChange(item.id)}
            >
              <span className="bottom-nav__icon">{item.icon}</span>
              <span className="bottom-nav__label text-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
