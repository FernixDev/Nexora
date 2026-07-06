import type { ReactNode } from 'react';
import { AthleticsIcon, CyclingIcon, StrengthIcon, StretchingIcon, SwimmingIcon } from '../components/icons';
import type { CyclingDiscipline, Sport, UserSport } from '../types/sport';

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
  swimming: 'Natación',
  stretching: 'Estiramientos',
};

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

/** Etiqueta pública de una fila de user_sports, ej. "Ciclismo · Montaña / MTB". */
export function formatUserSportLabel(userSport: Pick<UserSport, 'sport' | 'discipline'>): string {
  if (userSport.sport === 'cycling' && userSport.discipline) {
    return `${SPORT_LABELS.cycling} · ${CYCLING_DISCIPLINE_LABELS[userSport.discipline]}`;
  }
  return SPORT_LABELS[userSport.sport];
}
