import { MultiOptionGroup } from '../../../components/OptionCard/OptionGroup';
import { CYCLING_DISCIPLINE_OPTIONS, SPORT_OPTIONS } from '../../../utils/sportsCatalog';
import type { OnboardingSportsDraft } from '../../../hooks/useOnboardingDraft';
import type { CyclingDiscipline, Sport } from '../../../types/sport';

interface SportsStepProps {
  sports: OnboardingSportsDraft;
  onChange: (patch: Partial<OnboardingSportsDraft>) => void;
  showErrors: boolean;
}

export function SportsStep({ sports, onChange, showErrors }: SportsStepProps) {
  const cyclingSelected = sports.sports.includes('cycling');

  function handleSportsChange(values: string[]) {
    const nextSports = values as Sport[];
    onChange(
      nextSports.includes('cycling')
        ? { sports: nextSports }
        : { sports: nextSports, cyclingDisciplines: [] },
    );
  }

  return (
    <div className="onboarding-step">
      <div className="onboarding-step__header">
        <span className="onboarding-step__eyebrow text-label">Deportes</span>
        <h1 className="onboarding-step__title text-title">¿Qué quieres trabajar con Nexora?</h1>
        <p className="onboarding-step__description text-small">
          Puedes elegir varias áreas. Podrás ajustar esto más adelante.
        </p>
      </div>

      <MultiOptionGroup
        legend="Elige tus áreas"
        name="sports"
        options={SPORT_OPTIONS}
        values={sports.sports}
        onChange={handleSportsChange}
        error={showErrors && sports.sports.length === 0 ? 'Selecciona al menos un área.' : undefined}
      />

      {cyclingSelected && (
        <MultiOptionGroup
          legend="¿Qué modalidad de ciclismo?"
          name="cyclingDisciplines"
          options={CYCLING_DISCIPLINE_OPTIONS}
          values={sports.cyclingDisciplines}
          onChange={(values) => onChange({ cyclingDisciplines: values as CyclingDiscipline[] })}
          error={
            showErrors && sports.cyclingDisciplines.length === 0 ? 'Selecciona al menos una modalidad.' : undefined
          }
        />
      )}
    </div>
  );
}
