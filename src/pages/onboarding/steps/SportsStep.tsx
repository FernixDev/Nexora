import { Input } from '../../../components/Input/Input';
import { OptionCard } from '../../../components/OptionCard/OptionCard';
import { MultiOptionGroup } from '../../../components/OptionCard/OptionGroup';
import {
  CARDIO_GROUP_LABEL,
  CYCLING_DISCIPLINE_OPTIONS,
  GYM_CARDIO_DISCIPLINE_OPTIONS,
  MAX_CUSTOM_GYM_CARDIO_LABEL_LENGTH,
  SPORT_OPTIONS,
  isCustomGymCardioLabelValid,
  isObviousGymCardioDuplicate,
} from '../../../utils/sportsCatalog';
import type { OnboardingSportsDraft } from '../../../hooks/useOnboardingDraft';
import type { CyclingDiscipline, GymCardioDiscipline, Sport } from '../../../types/sport';

interface SportsStepProps {
  sports: OnboardingSportsDraft;
  onChange: (patch: Partial<OnboardingSportsDraft>) => void;
  showErrors: boolean;
}

interface SportToggleCardProps {
  sport: Sport;
  selected: Sport[];
  onToggle: (sport: Sport) => void;
}

/** Una tarjeta de deporte de nivel superior, leída del catálogo centralizado. */
function SportToggleCard({ sport, selected, onToggle }: SportToggleCardProps) {
  const option = SPORT_OPTIONS.find((candidate) => candidate.value === sport)!;
  return (
    <OptionCard
      type="checkbox"
      name="sports"
      value={option.value}
      label={option.label}
      description={option.description}
      icon={option.icon}
      checked={selected.includes(sport)}
      onChange={() => onToggle(sport)}
    />
  );
}

export function SportsStep({ sports, onChange, showErrors }: SportsStepProps) {
  const cyclingSelected = sports.sports.includes('cycling');
  const gymCardioSelected = sports.sports.includes('gym_cardio');
  const otherGymCardioSelected = sports.gymCardioDisciplines.includes('other');

  function toggleSport(sport: Sport) {
    const isSelected = sports.sports.includes(sport);
    const nextSports = isSelected ? sports.sports.filter((s) => s !== sport) : [...sports.sports, sport];
    const patch: Partial<OnboardingSportsDraft> = { sports: nextSports };

    if (sport === 'cycling' && isSelected) {
      patch.cyclingDisciplines = [];
    }
    if (sport === 'gym_cardio' && isSelected) {
      patch.gymCardioDisciplines = [];
      patch.customGymCardioLabel = '';
    }

    onChange(patch);
  }

  function handleGymCardioDisciplinesChange(values: string[]) {
    const next = values as GymCardioDiscipline[];
    onChange({
      gymCardioDisciplines: next,
      ...(next.includes('other') ? {} : { customGymCardioLabel: '' }),
    });
  }

  const trimmedCustomLabel = sports.customGymCardioLabel.trim();
  let customLabelError: string | undefined;
  if (showErrors && otherGymCardioSelected && !isCustomGymCardioLabelValid(sports.customGymCardioLabel)) {
    if (trimmedCustomLabel.length === 0) {
      customLabelError = 'Escribe el nombre de la máquina.';
    } else if (trimmedCustomLabel.length > MAX_CUSTOM_GYM_CARDIO_LABEL_LENGTH) {
      customLabelError = `Usa como máximo ${MAX_CUSTOM_GYM_CARDIO_LABEL_LENGTH} caracteres.`;
    } else if (isObviousGymCardioDuplicate(trimmedCustomLabel)) {
      customLabelError = 'Ya está en el catálogo: marca esa opción en su lugar.';
    }
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

      <fieldset className="option-card-group">
        <legend className="option-card-group__legend text-heading">Elige tus áreas</legend>

        <SportToggleCard sport="strength" selected={sports.sports} onToggle={toggleSport} />

        <p className="sports-group-label text-label text-secondary">{CARDIO_GROUP_LABEL}</p>

        <SportToggleCard sport="athletics" selected={sports.sports} onToggle={toggleSport} />
        <SportToggleCard sport="cycling" selected={sports.sports} onToggle={toggleSport} />

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

        <SportToggleCard sport="gym_cardio" selected={sports.sports} onToggle={toggleSport} />

        {gymCardioSelected && (
          <>
            <MultiOptionGroup
              legend="¿Qué máquinas usas?"
              name="gymCardioDisciplines"
              options={GYM_CARDIO_DISCIPLINE_OPTIONS}
              values={sports.gymCardioDisciplines}
              onChange={handleGymCardioDisciplinesChange}
              error={
                showErrors && sports.gymCardioDisciplines.length === 0 ? 'Selecciona al menos una máquina.' : undefined
              }
            />

            {otherGymCardioSelected && (
              <Input
                label="¿Qué máquina utilizas?"
                type="text"
                maxLength={MAX_CUSTOM_GYM_CARDIO_LABEL_LENGTH}
                placeholder="Ej.: remo, air bike, ski erg…"
                value={sports.customGymCardioLabel}
                onChange={(event) => onChange({ customGymCardioLabel: event.target.value })}
                error={customLabelError}
              />
            )}
          </>
        )}

        <SportToggleCard sport="home_training" selected={sports.sports} onToggle={toggleSport} />
        <SportToggleCard sport="swimming" selected={sports.sports} onToggle={toggleSport} />
        <SportToggleCard sport="stretching" selected={sports.sports} onToggle={toggleSport} />

        {showErrors && sports.sports.length === 0 && (
          <p className="option-card-group__error text-small" role="alert" aria-live="polite">
            Selecciona al menos un área.
          </p>
        )}
      </fieldset>
    </div>
  );
}
