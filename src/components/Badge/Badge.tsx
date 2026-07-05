import type { ReactNode } from 'react';
import './Badge.css';

type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`badge badge--${tone} text-label`}>{children}</span>;
}
