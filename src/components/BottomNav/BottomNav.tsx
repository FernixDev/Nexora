import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useLiquidNavPosition } from '../../hooks/useLiquidNavPosition';
import { decideOrientation, readSafeAreaInsets, type NavOrientation } from '../../utils/liquidNavGeometry';
import './BottomNav.css';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface BottomNavHandle {
  resetPosition: () => void;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeId: string;
  onChange: (id: string) => void;
}

const ORIENTATION_CLASS: Record<NavOrientation, string> = {
  'horizontal-right': 'liquid-nav--horizontal-right',
  'horizontal-left': 'liquid-nav--horizontal-left',
  'vertical-down': 'liquid-nav--vertical-down',
  'vertical-up': 'liquid-nav--vertical-up',
};

export const BottomNav = forwardRef<BottomNavHandle, BottomNavProps>(function BottomNav(
  { items, activeId, onChange },
  forwardedRef,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [orientation, setOrientation] = useState<NavOrientation>('horizontal-right');
  const [openSize, setOpenSize] = useState({ horizontalWidth: 0, verticalHeight: 0 });

  const mainRef = useRef<HTMLElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const horizontalProbeRef = useRef<HTMLDivElement>(null);
  const verticalProbeRef = useRef<HTMLDivElement>(null);
  const closedSizeRef = useRef({ width: 0, height: 0 });
  const panelId = useId();

  const orderedItems = useMemo(() => {
    const active = items.find((item) => item.id === activeId);
    const rest = items.filter((item) => item.id !== activeId);
    return active ? [active, ...rest] : items;
  }, [items, activeId]);

  const { position, isDragging, consumeDragFlag, nudge, resetPosition, dragHandlers } = useLiquidNavPosition({
    elementRef: mainRef,
    disabled: isOpen,
  });

  useImperativeHandle(forwardedRef, () => ({ resetPosition }), [resetPosition]);

  // Mide, en dos sondas ocultas, el tamaño real que necesitaría el control
  // al abrirse en horizontal o en vertical (respetando el breakpoint actual).
  useEffect(() => {
    const hEl = horizontalProbeRef.current;
    const vEl = verticalProbeRef.current;
    if (!hEl || !vEl) return;

    const measure = () => {
      setOpenSize({ horizontalWidth: hEl.scrollWidth, verticalHeight: vEl.scrollHeight });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(hEl);
    ro.observe(vEl);
    return () => ro.disconnect();
  }, [items.length]);

  // Sigue el tamaño real del control. Si crece hacia la izquierda o hacia
  // arriba (row-reverse / column-reverse), compensa la posición para que el
  // borde opuesto permanezca fijo: así el material parece anclado, no saltar.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let prevWidth = el.offsetWidth;
    let prevHeight = el.offsetHeight;

    const ro = new ResizeObserver(() => {
      const newWidth = el.offsetWidth;
      const newHeight = el.offsetHeight;
      const dWidth = newWidth - prevWidth;
      const dHeight = newHeight - prevHeight;

      if (orientation === 'horizontal-left' && dWidth !== 0) nudge(-dWidth, 0);
      if (orientation === 'vertical-up' && dHeight !== 0) nudge(0, -dHeight);

      prevWidth = newWidth;
      prevHeight = newHeight;

      if (!isOpen) {
        closedSizeRef.current = { width: newWidth, height: newHeight };
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [orientation, isOpen, nudge]);

  const openNav = useCallback(() => {
    const el = mainRef.current;
    if (!el || !position) return;

    const size = closedSizeRef.current.width
      ? closedSizeRef.current
      : { width: el.offsetWidth, height: el.offsetHeight };

    const decided = decideOrientation({
      anchor: { x: position.x, y: position.y, width: size.width, height: size.height },
      openHorizontalWidth: openSize.horizontalWidth,
      openVerticalHeight: openSize.verticalHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      insets: readSafeAreaInsets(),
    });

    setOrientation(decided);
    setIsOpen(true);
  }, [position, openSize]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (mainRef.current && !mainRef.current.contains(event.target as Node)) {
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

  // Cerrar ante un cambio de viewport evita orientaciones obsoletas mientras se redimensiona.
  useEffect(() => {
    function handleResize() {
      setIsOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleItemClick(id: string) {
    if (consumeDragFlag()) return;
    if (!isOpen) {
      openNav();
      return;
    }
    if (id === activeId) {
      setIsOpen(false);
      return;
    }
    onChange(id);
    setIsOpen(false);
  }

  const rootClassName = [
    'liquid-nav',
    'glass-strong',
    isOpen ? 'liquid-nav--open' : '',
    isOpen ? ORIENTATION_CLASS[orientation] : '',
    isDragging ? 'liquid-nav--dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style: CSSProperties = position
    ? { transform: `translate3d(${position.x}px, ${position.y}px, 0)` }
    : { visibility: 'hidden' };

  function renderItem(item: BottomNavItem, tabbable: boolean) {
    const isActive = item.id === activeId;
    const isVisible = isOpen || isActive;

    return (
      <button
        key={item.id}
        ref={isActive && tabbable ? activeButtonRef : undefined}
        type="button"
        className={`liquid-nav__item${isActive ? ' liquid-nav__item--active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
        aria-label={item.label}
        aria-expanded={tabbable && isActive ? isOpen : undefined}
        aria-controls={tabbable && isActive ? panelId : undefined}
        tabIndex={tabbable && isVisible ? 0 : -1}
        onClick={tabbable ? () => handleItemClick(item.id) : undefined}
      >
        <span className="liquid-nav__icon">{item.icon}</span>
        <span className="liquid-nav__label text-label" aria-hidden="true">
          {item.label}
        </span>
      </button>
    );
  }

  return (
    <>
      <nav
        ref={mainRef}
        id={panelId}
        aria-label="Navegación principal"
        className={rootClassName}
        style={style}
        {...dragHandlers}
      >
        {orderedItems.map((item) => renderItem(item, true))}
      </nav>

      <div className="liquid-nav__probe-container" aria-hidden="true" inert>
        <div ref={horizontalProbeRef} className="liquid-nav liquid-nav--open liquid-nav--horizontal-right">
          {orderedItems.map((item) => renderItem(item, false))}
        </div>
        <div ref={verticalProbeRef} className="liquid-nav liquid-nav--open liquid-nav--vertical-down">
          {orderedItems.map((item) => renderItem(item, false))}
        </div>
      </div>
    </>
  );
});
