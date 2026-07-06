import { Input } from '../../../components/Input/Input';
import { calculateAge, isValidBirthDate } from '../../../utils/age';
import type { OnboardingPersonalDraft } from '../../../hooks/useOnboardingDraft';

interface PersonalDataStepProps {
  personal: OnboardingPersonalDraft;
  onChange: (patch: Partial<OnboardingPersonalDraft>) => void;
  showErrors: boolean;
}

const today = new Date().toISOString().slice(0, 10);

export function PersonalDataStep({ personal, onChange, showErrors }: PersonalDataStepProps) {
  const age = personal.birthDate && isValidBirthDate(personal.birthDate) ? calculateAge(personal.birthDate) : null;

  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <span className="onboarding-step__eyebrow text-label">Sobre ti</span>
        <h1 className="onboarding-step__title text-title">Tus datos</h1>
        <p className="onboarding-step__description text-small">Nos ayudan a personalizar tu experiencia.</p>
      </div>

      <Input
        label="Nombre"
        type="text"
        autoComplete="name"
        required
        value={personal.displayName}
        onChange={(event) => onChange({ displayName: event.target.value })}
        error={showErrors && !personal.displayName.trim() ? 'Introduce tu nombre.' : undefined}
      />

      <Input
        label="Fecha de nacimiento"
        type="date"
        max={today}
        required
        value={personal.birthDate}
        onChange={(event) => onChange({ birthDate: event.target.value })}
        error={showErrors && !isValidBirthDate(personal.birthDate) ? 'Introduce una fecha de nacimiento válida.' : undefined}
        helperText={age !== null ? `${age} años` : undefined}
      />

      <Input
        label="Altura (cm)"
        type="number"
        inputMode="numeric"
        min={100}
        max={230}
        required
        value={personal.heightCm}
        onChange={(event) => onChange({ heightCm: event.target.value })}
        error={
          showErrors && (!personal.heightCm || Number(personal.heightCm) < 100 || Number(personal.heightCm) > 230)
            ? 'Introduce una altura entre 100 y 230 cm.'
            : undefined
        }
      />

      <Input
        label="Peso actual (kg)"
        type="number"
        inputMode="decimal"
        step="0.1"
        min={30}
        max={250}
        required
        value={personal.currentWeightKg}
        onChange={(event) => onChange({ currentWeightKg: event.target.value })}
        error={
          showErrors &&
          (!personal.currentWeightKg || Number(personal.currentWeightKg) < 30 || Number(personal.currentWeightKg) > 250)
            ? 'Introduce un peso entre 30 y 250 kg.'
            : undefined
        }
      />
    </div>
  );
}
