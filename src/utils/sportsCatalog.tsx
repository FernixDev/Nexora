import type { ReactNode } from 'react';
import { AthleticsIcon, CardioIcon, CyclingIcon, HomeTrainingIcon, StrengthIcon, StretchingIcon, SwimmingIcon } from '../components/icons';
import type { CyclingDiscipline, GymCardioDiscipline, Sport, UserSportSelection } from '../types/sport';

/**
 * Catálogo único de deportes: identificadores internos, etiquetas públicas e
 * iconografía. Cualquier pantalla que necesite mostrar u ofrecer deportes
 * debe leer de aquí en lugar de repetir strings sueltos.
 */

interface SportOption {
  value: Sport;
  label: string;
  description: string;
  icon: ReactNode;
}

export const SPORT_OPTIONS: readonly SportOption[] = [
  {
    value: 'strength',
    label: 'Fuerza',
    description: 'Entrenamiento con pesas y trabajo de fuerza.',
    icon: <StrengthIcon />,
  },
  {
    value: 'athletics',
    label: 'Atletismo',
    description: 'Caminar, combinar caminata y carrera, o correr.',
    icon: <AthleticsIcon />,
  },
  {
    value: 'cycling',
    label: 'Ciclismo',
    description: 'Carretera o montaña.',
    icon: <CyclingIcon />,
  },
  {
    value: 'gym_cardio',
    label: 'Cardio en gimnasio',
    description: 'Bicicleta estática, cinta, elíptica y más.',
    icon: <CardioIcon />,
  },
  {
    value: 'home_training',
    label: 'Entreno en casa',
    description: 'Entrena donde estés, sin necesidad de gimnasio.',
    icon: <HomeTrainingIcon />,
  },
  {
    value: 'swimming',
    label: 'Natación',
    description: 'Entrenamiento en el agua.',
    icon: <SwimmingIcon />,
  },
  {
    value: 'stretching',
    label: 'Estiramientos',
    description: 'Movilidad y flexibilidad.',
    icon: <StretchingIcon />,
  },
];

export const SPORT_LABELS: Record<Sport, string> = {
  strength: 'Fuerza',
  athletics: 'Atletismo',
  cycling: 'Ciclismo',
  gym_cardio: 'Cardio en gimnasio',
  home_training: 'Entreno en casa',
  swimming: 'Natación',
  stretching: 'Estiramientos',
};

/**
 * "Cardio" es puramente una agrupación visual (no se guarda en ningún
 * sitio): agrupa Atletismo, Ciclismo y Cardio en gimnasio en la interfaz.
 */
export const CARDIO_GROUP_LABEL = 'Cardio';
export const CARDIO_GROUP_SPORTS: readonly Sport[] = ['athletics', 'cycling', 'gym_cardio'];

interface CyclingDisciplineOption {
  value: CyclingDiscipline;
  label: string;
}

export const CYCLING_DISCIPLINE_OPTIONS: readonly CyclingDisciplineOption[] = [
  { value: 'road', label: 'Carretera' },
  { value: 'mtb', label: 'Montaña / MTB' },
];

export const CYCLING_DISCIPLINE_LABELS: Record<CyclingDiscipline, string> = {
  road: 'Carretera',
  mtb: 'Montaña / MTB',
};

interface GymCardioDisciplineOption {
  value: GymCardioDiscipline;
  label: string;
}

export const GYM_CARDIO_DISCIPLINE_OPTIONS: readonly GymCardioDisciplineOption[] = [
  { value: 'stationary_bike', label: 'Bicicleta estática' },
  { value: 'treadmill', label: 'Cinta de correr' },
  { value: 'elliptical', label: 'Elíptica' },
  { value: 'stair_climber', label: 'Máquina de escaleras' },
  { value: 'other', label: 'Otra máquina de cardio' },
];

export const GYM_CARDIO_DISCIPLINE_LABELS: Record<GymCardioDiscipline, string> = {
  stationary_bike: 'Bicicleta estática',
  treadmill: 'Cinta de correr',
  elliptical: 'Elíptica',
  stair_climber: 'Máquina de escaleras',
  other: 'Otra máquina de cardio',
};

/** Debe coincidir con el límite exigido por la base de datos (ver la migración de user_sports). */
export const MAX_CUSTOM_GYM_CARDIO_LABEL_LENGTH = 40;

function normalizeLabel(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

const STANDARD_GYM_CARDIO_LABELS = GYM_CARDIO_DISCIPLINE_OPTIONS.filter((option) => option.value !== 'other').map(
  (option) => normalizeLabel(option.label),
);

/** Comparación textual simple y normalizada (minúsculas, sin acentos), no una coincidencia difusa. */
export function isObviousGymCardioDuplicate(label: string): boolean {
  return STANDARD_GYM_CARDIO_LABELS.includes(normalizeLabel(label));
}

export function isCustomGymCardioLabelValid(label: string): boolean {
  const trimmed = label.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_CUSTOM_GYM_CARDIO_LABEL_LENGTH) return false;
  return !isObviousGymCardioDuplicate(trimmed);
}

/** Forma mínima común para mostrar una selección deportiva, ya sea del borrador o ya guardada. */
export interface DisplayableUserSport {
  sport: Sport;
  discipline: string | null;
  customLabel: string | null;
}

/** Convierte una selección del borrador (unión discriminada) a la forma mínima de visualización. */
export function toDisplayableUserSport(selection: UserSportSelection): DisplayableUserSport {
  return {
    sport: selection.sport,
    discipline: selection.discipline,
    customLabel: 'customLabel' in selection ? selection.customLabel : null,
  };
}

/** Etiqueta pública de una única fila/selección, sin el nombre del deporte por delante (ej. "Montaña / MTB"). */
export function formatDisciplineLabel(entry: DisplayableUserSport): string {
  if (entry.sport === 'cycling' && entry.discipline) {
    return CYCLING_DISCIPLINE_LABELS[entry.discipline as CyclingDiscipline];
  }
  if (entry.sport === 'gym_cardio' && entry.discipline) {
    if (entry.discipline === 'other') {
      return entry.customLabel
        ? `${GYM_CARDIO_DISCIPLINE_LABELS.other}: ${entry.customLabel}`
        : GYM_CARDIO_DISCIPLINE_LABELS.other;
    }
    return GYM_CARDIO_DISCIPLINE_LABELS[entry.discipline as GymCardioDiscipline];
  }
  return SPORT_LABELS[entry.sport];
}

const CYCLING_DISCIPLINE_ORDER = CYCLING_DISCIPLINE_OPTIONS.map((option) => option.value);
const GYM_CARDIO_DISCIPLINE_ORDER = GYM_CARDIO_DISCIPLINE_OPTIONS.map((option) => option.value);

/**
 * Postgres no garantiza el orden de las filas sin ORDER BY: ordena las
 * disciplinas de una misma fila de forma determinista según el orden del
 * catálogo, para que la lista no cambie de orden entre recargas.
 */
export function sortByDisciplineOrder(entries: readonly DisplayableUserSport[]): DisplayableUserSport[] {
  const order = entries[0]?.sport === 'gym_cardio' ? GYM_CARDIO_DISCIPLINE_ORDER : CYCLING_DISCIPLINE_ORDER;
  return [...entries].sort((a, b) => order.indexOf(a.discipline as never) - order.indexOf(b.discipline as never));
}
