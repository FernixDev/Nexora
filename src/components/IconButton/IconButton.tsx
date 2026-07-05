import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './IconButton.css';

type IconButtonVariant = 'glass' | 'solid' | 'ghost';
type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export function IconButton({
  icon,
  label,
  variant = 'glass',
  size = 'medium',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  const classes = ['icon-btn', `icon-btn--${variant}`, `icon-btn--${size}`, className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} aria-label={label} title={label} {...rest}>
      {icon}
    </button>
  );
}
