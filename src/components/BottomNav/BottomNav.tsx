import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const orderedItems = useMemo(() => {
    const active = items.find((item) => item.id === activeId);
    const rest = items.filter((item) => item.id !== activeId);
    return active ? [active, ...rest] : items;
  }, [items, activeId]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        activeButtonRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleItemClick(id: string) {
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    if (id === activeId) {
      setIsOpen(false);
      return;
    }
    onChange(id);
    setIsOpen(false);
  }

  return (
    <nav className="bottom-nav-wrap" aria-label="Navegación principal">
      <div
        ref={containerRef}
        id={panelId}
        className={`bottom-nav glass-strong${isOpen ? ' bottom-nav--open' : ''}`}
      >
        {orderedItems.map((item) => {
          const isActive = item.id === activeId;
          const isVisible = isOpen || isActive;

          return (
            <button
              key={item.id}
              ref={isActive ? activeButtonRef : undefined}
              type="button"
              className={`bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              aria-expanded={isActive ? isOpen : undefined}
              aria-controls={isActive ? panelId : undefined}
              tabIndex={isVisible ? 0 : -1}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="bottom-nav__icon">{item.icon}</span>
              <span className="bottom-nav__label text-label" aria-hidden="true">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
