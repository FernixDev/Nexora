import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import './GlassCard.css';

type GlassLevel = 'subtle' | 'medium' | 'strong';

interface GlassCardBaseProps {
  level?: GlassLevel;
  children: ReactNode;
  className?: string;
}

type GlassCardProps =
  | (GlassCardBaseProps & HTMLAttributes<HTMLDivElement> & { onClick?: undefined })
  | (GlassCardBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { onClick: NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['onClick']> });

export function GlassCard({
  level = 'medium',
  children,
  className,
  onClick,
  ...rest
}: GlassCardProps) {
  const levelClass = level === 'medium' ? 'glass' : `glass-${level}`;
  const classes = ['glass-card', levelClass, onClick ? 'glass-card--interactive' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={classes} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}
