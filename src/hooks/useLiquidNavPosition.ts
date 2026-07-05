import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import {
  clampPosition,
  loadStoredPosition,
  saveStoredPosition,
  clearStoredPosition,
  rescalePosition,
  readSafeAreaInsets,
  NAV_DRAG_THRESHOLD,
} from '../utils/liquidNavGeometry';

interface Position {
  x: number;
  y: number;
}

interface UseLiquidNavPositionOptions {
  elementRef: RefObject<HTMLElement | null>;
  disabled?: boolean;
}

interface DragState {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  dragging: boolean;
}

/**
 * Owns the floating control's on-screen position: initial centering,
 * pointer-driven dragging (with click/drag disambiguation), viewport
 * clamping, and localStorage persistence.
 */
export function useLiquidNavPosition({ elementRef, disabled = false }: UseLiquidNavPositionOptions) {
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<DragState | null>(null);
  const draggedRef = useRef(false);

  const clampCurrent = useCallback(
    (x: number, y: number) => {
      const el = elementRef.current;
      const width = el?.offsetWidth ?? 0;
      const height = el?.offsetHeight ?? 0;
      const insets = readSafeAreaInsets();
      return clampPosition(x, y, width, height, window.innerWidth, window.innerHeight, insets);
    },
    [elementRef],
  );

  // Resolve the initial position before the first paint: either a stored
  // position (rescaled to the current viewport) or the natural centered
  // spot near the bottom, computed from the element's own measured size.
  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const stored = loadStoredPosition();
    if (stored) {
      const rescaled = rescalePosition(stored, window.innerWidth, window.innerHeight);
      setPosition(clampCurrent(rescaled.x, rescaled.y));
      return;
    }

    const insets = readSafeAreaInsets();
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const defaultX = (window.innerWidth - width) / 2;
    const defaultY = window.innerHeight - insets.bottom - 24 - height;
    setPosition(clampCurrent(defaultX, defaultY));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    function handleResize() {
      setPosition((prev) => (prev ? clampCurrent(prev.x, prev.y) : prev));
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampCurrent]);

  const persist = useCallback((x: number, y: number) => {
    saveStoredPosition({ x, y, viewportWidth: window.innerWidth, viewportHeight: window.innerHeight });
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (!position) return;

      dragRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startX: position.x,
        startY: position.y,
        dragging: false,
      };
    },
    [disabled, position],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const dx = event.clientX - drag.startClientX;
      const dy = event.clientY - drag.startClientY;

      if (!drag.dragging) {
        if (Math.abs(dx) < NAV_DRAG_THRESHOLD && Math.abs(dy) < NAV_DRAG_THRESHOLD) return;
        drag.dragging = true;
        draggedRef.current = true;
        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
      setPosition(clampCurrent(drag.startX + dx, drag.startY + dy));
    },
    [clampCurrent],
  );

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      if (drag.dragging) {
        setIsDragging(false);
        setPosition((prev) => {
          if (!prev) return prev;
          const clamped = clampCurrent(prev.x, prev.y);
          persist(clamped.x, clamped.y);
          return clamped;
        });
        // A click event still follows this gesture; let it be suppressed once,
        // then release the flag shortly after as a safety net.
        window.setTimeout(() => {
          draggedRef.current = false;
        }, 400);
      }
      dragRef.current = null;
    },
    [clampCurrent, persist],
  );

  const consumeDragFlag = useCallback(() => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return true;
    }
    return false;
  }, []);

  const nudge = useCallback((dx: number, dy: number) => {
    if (dx === 0 && dy === 0) return;
    setPosition((prev) => (prev ? { x: prev.x + dx, y: prev.y + dy } : prev));
  }, []);

  const resetPosition = useCallback(() => {
    clearStoredPosition();
    const el = elementRef.current;
    if (!el) return;
    const insets = readSafeAreaInsets();
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const defaultX = (window.innerWidth - width) / 2;
    const defaultY = window.innerHeight - insets.bottom - 24 - height;
    setPosition(clampCurrent(defaultX, defaultY));
  }, [clampCurrent, elementRef]);

  return {
    position,
    isDragging,
    consumeDragFlag,
    nudge,
    resetPosition,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
