import { CheckIcon } from '../icons';
import './OptionCard.css';

interface OptionCardProps {
  name: string;
  value: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: string) => void;
  /** 'radio' para selección única, 'checkbox' para selección múltiple. */
  type?: 'radio' | 'checkbox';
}

/**
 * Tarjeta seleccionable táctil para preguntas de opción única o múltiple.
 * Usa un <input> nativo (oculto visualmente, no del árbol de accesibilidad)
 * para conservar semántica de formulario, foco de teclado y lectura por
 * lector de pantalla, con la tarjeta completa como área de toque.
 */
export function OptionCard({ name, value, label, description, checked, onChange, type = 'radio' }: OptionCardProps) {
  const inputId = `${name}-${value}`;

  return (
    <label
      htmlFor={inputId}
      className={['option-card', checked ? 'option-card--selected' : ''].filter(Boolean).join(' ')}
    >
      <input
        id={inputId}
        className="option-card__input"
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span className="option-card__body">
        <span className="option-card__label text-body">{label}</span>
        {description && <span className="option-card__description text-small text-secondary">{description}</span>}
      </span>
      <span className="option-card__indicator" aria-hidden="true">
        <CheckIcon />
      </span>
    </label>
  );
}
