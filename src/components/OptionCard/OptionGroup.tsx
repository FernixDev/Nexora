import type { ReactNode } from 'react';
import { OptionCard } from './OptionCard';
import './OptionCard.css';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface OptionGroupShellProps {
  legend: string;
  error?: string;
  children: ReactNode;
}

function OptionGroupShell({ legend, error, children }: OptionGroupShellProps) {
  return (
    <fieldset className="option-card-group">
      <legend className="option-card-group__legend text-heading">{legend}</legend>
      {children}
      {error && (
        <p className="option-card-group__error text-small" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </fieldset>
  );
}

interface SingleOptionGroupProps {
  legend: string;
  name: string;
  options: readonly Option[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
}

/** Grupo de tarjetas seleccionables de opción única (equivalente a radio buttons). */
export function SingleOptionGroup({ legend, name, options, value, onChange, error }: SingleOptionGroupProps) {
  return (
    <OptionGroupShell legend={legend} error={error}>
      {options.map((option) => (
        <OptionCard
          key={option.value}
          type="radio"
          name={name}
          value={option.value}
          label={option.label}
          description={option.description}
          icon={option.icon}
          checked={value === option.value}
          onChange={onChange}
        />
      ))}
    </OptionGroupShell>
  );
}

interface MultiOptionGroupProps {
  legend: string;
  name: string;
  options: readonly Option[];
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

/** Grupo de tarjetas seleccionables de opción múltiple (equivalente a checkboxes). */
export function MultiOptionGroup({ legend, name, options, values, onChange, error }: MultiOptionGroupProps) {
  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  return (
    <OptionGroupShell legend={legend} error={error}>
      {options.map((option) => (
        <OptionCard
          key={option.value}
          type="checkbox"
          name={name}
          value={option.value}
          label={option.label}
          description={option.description}
          icon={option.icon}
          checked={values.includes(option.value)}
          onChange={toggle}
        />
      ))}
    </OptionGroupShell>
  );
}
