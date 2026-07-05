import './Progress.css';

interface ProgressProps {
  value: number;
  label?: string;
  showValue?: boolean;
}

export function Progress({ value, label, showValue = true }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="progress">
      {(label || showValue) && (
        <div className="progress__meta text-small">
          {label && <span className="text-secondary">{label}</span>}
          {showValue && <span className="progress__value">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progreso'}
      >
        <div className="progress__fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
