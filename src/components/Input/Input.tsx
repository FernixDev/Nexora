import { useId, type InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  helperText?: string;
  error?: string;
  id?: string;
}

export function Input({
  label,
  helperText,
  error,
  id,
  disabled,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = error || helperText ? `${inputId}-description` : undefined;

  return (
    <div className={['input-field', className ?? ''].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className="input-field__label text-label">
        {label}
      </label>
      <input
        id={inputId}
        className={['input-field__control', error ? 'input-field__control--error' : '']
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={descriptionId}
        {...rest}
      />
      {error ? (
        <p id={descriptionId} className="input-field__error text-small">
          {error}
        </p>
      ) : helperText ? (
        <p id={descriptionId} className="input-field__helper text-small">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
