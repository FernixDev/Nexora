export type NavOrientation = 'horizontal-right' | 'horizontal-left' | 'vertical-down' | 'vertical-up';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const NAV_DRAG_THRESHOLD = 6;
export const NAV_EDGE_MARGIN = 8;

const STORAGE_KEY = 'nexora:liquid-nav:position';

interface StoredPosition {
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
}

export function readSafeAreaInsets(): Insets {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => parseFloat(styles.getPropertyValue(name)) || 0;
  return {
    top: read('--safe-area-inset-top'),
    right: read('--safe-area-inset-right'),
    bottom: read('--safe-area-inset-bottom'),
    left: read('--safe-area-inset-left'),
  };
}

export function clampPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
  insets: Insets,
  margin: number = NAV_EDGE_MARGIN,
): { x: number; y: number } {
  const minX = insets.left + margin;
  const maxX = Math.max(minX, viewportWidth - insets.right - margin - width);
  const minY = insets.top + margin;
  const maxY = Math.max(minY, viewportHeight - insets.bottom - margin - height);
  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
}

interface DecideOrientationParams {
  anchor: Rect;
  openHorizontalWidth: number;
  openVerticalHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  insets: Insets;
  margin?: number;
}

/**
 * Decide which direction the control should morph into, using real measured
 * space around its current (closed) position.
 *
 * A control resting right against a side edge is treated as "docked" to that
 * edge: it expands vertically along the same edge (matching how a floating
 * control parked on a side is expected to behave) whenever there is vertical
 * room, even though the far side technically has space too. Anywhere else
 * (center, top or bottom zones without hugging a side) it prefers whichever
 * horizontal direction fits, falling back to vertical when neither does.
 */
export function decideOrientation({
  anchor,
  openHorizontalWidth,
  openVerticalHeight,
  viewportWidth,
  viewportHeight,
  insets,
  margin = NAV_EDGE_MARGIN,
}: DecideOrientationParams): NavOrientation {
  const spaceRight = viewportWidth - insets.right - margin - anchor.x;
  const spaceLeft = anchor.x + anchor.width - insets.left - margin;
  const spaceBelow = viewportHeight - insets.bottom - margin - (anchor.y + anchor.height);
  const spaceAbove = anchor.y - insets.top - margin;

  const canRight = spaceRight >= openHorizontalWidth;
  const canLeft = spaceLeft >= openHorizontalWidth;
  const canDown = spaceBelow >= openVerticalHeight;
  const canUp = spaceAbove >= openVerticalHeight;

  const distanceFromLeftEdge = anchor.x - insets.left;
  const distanceFromRightEdge = viewportWidth - insets.right - (anchor.x + anchor.width);
  const dockThreshold = margin * 3;
  const isDocked = distanceFromLeftEdge <= dockThreshold || distanceFromRightEdge <= dockThreshold;

  if (isDocked && (canDown || canUp)) {
    return spaceBelow >= spaceAbove ? 'vertical-down' : 'vertical-up';
  }

  if (canRight && canLeft) return spaceRight >= spaceLeft ? 'horizontal-right' : 'horizontal-left';
  if (canRight) return 'horizontal-right';
  if (canLeft) return 'horizontal-left';

  if (canDown && canUp) return spaceBelow >= spaceAbove ? 'vertical-down' : 'vertical-up';
  if (canDown) return 'vertical-down';
  if (canUp) return 'vertical-up';

  return spaceBelow >= spaceAbove ? 'vertical-down' : 'vertical-up';
}

export function loadStoredPosition(): StoredPosition | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPosition>;
    if (
      typeof parsed.x === 'number' &&
      typeof parsed.y === 'number' &&
      typeof parsed.viewportWidth === 'number' &&
      typeof parsed.viewportHeight === 'number'
    ) {
      return parsed as StoredPosition;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveStoredPosition(position: StoredPosition): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  } catch {
    // localStorage may be unavailable (private mode, quota exceeded) — non-critical.
  }
}

export function clearStoredPosition(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function rescalePosition(
  stored: StoredPosition,
  viewportWidth: number,
  viewportHeight: number,
): { x: number; y: number } {
  const scaleX = stored.viewportWidth > 0 ? viewportWidth / stored.viewportWidth : 1;
  const scaleY = stored.viewportHeight > 0 ? viewportHeight / stored.viewportHeight : 1;
  return { x: stored.x * scaleX, y: stored.y * scaleY };
}
