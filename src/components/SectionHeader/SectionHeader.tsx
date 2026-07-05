import type { ReactNode } from 'react';
import './SectionHeader.css';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-header__text">
        {eyebrow && <span className="section-header__eyebrow text-label">{eyebrow}</span>}
        <h2 className="section-header__title text-heading">{title}</h2>
        {description && <p className="section-header__description text-small">{description}</p>}
      </div>
      {action && <div className="section-header__action">{action}</div>}
    </div>
  );
}
