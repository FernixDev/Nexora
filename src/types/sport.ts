/**
 * Modelo de deportes de Nexora. Un usuario puede elegir varias áreas a la
 * vez (no existe deporte principal ni deportes secundarios). "Cardio" es
 * puramente una agrupación visual (Atletismo + Ciclismo + Cardio en
 * gimnasio); no existe como valor de `sport` ni se guarda en ningún sitio.
 */

export type Sport =
  | 'strength'
  | 'athletics'
  | 'cycling'
  | 'gym_cardio'
  | 'home_training'
  | 'swimming'
  | 'stretching';

export type CyclingDiscipline = 'road' | 'mtb';

/** 'other' representa una máquina de cardio que no está en el catálogo estándar. */
export type GymCardioDiscipline = 'stationary_bike' | 'treadmill' | 'elliptical' | 'stair_climber' | 'other';

/**
 * Unión discriminada: solo cycling y gym_cardio pueden llevar disciplina, y
 * solo gym_cardio con discipline 'other' lleva un nombre personalizado. El
 * resto de deportes no admite discipline (evita en compilación combinaciones
 * incoherentes como sport: 'strength' con discipline: 'road').
 */
export type UserSportSelection =
  | { sport: 'cycling'; discipline: CyclingDiscipline }
  | { sport: 'gym_cardio'; discipline: Exclude<GymCardioDiscipline, 'other'> }
  | { sport: 'gym_cardio'; discipline: 'other'; customLabel: string }
  | { sport: Exclude<Sport, 'cycling' | 'gym_cardio'>; discipline: null };

export interface UserSport {
  userId: string;
  sport: Sport;
  discipline: CyclingDiscipline | GymCardioDiscipline | null;
  /** Nombre libre de la máquina de cardio cuando discipline es 'other'; null en cualquier otro caso. */
  customLabel: string | null;
  createdAt: string;
}

/**
 * Forma exacta de la fila tal como la devuelve public.user_sports (snake_case).
 * discipline usa '' para "sin disciplina" porque forma parte de la clave
 * primaria compuesta de la tabla, que no admite NULL; esta capa de tipos es
 * la única que conoce ese detalle de almacenamiento.
 */
export interface UserSportRow {
  user_id: string;
  sport: Sport;
  discipline: CyclingDiscipline | GymCardioDiscipline | '';
  custom_discipline_label: string | null;
  created_at: string;
}

export function mapUserSportRow(row: UserSportRow): UserSport {
  return {
    userId: row.user_id,
    sport: row.sport,
    discipline: row.discipline === '' ? null : row.discipline,
    customLabel: row.custom_discipline_label,
    createdAt: row.created_at,
  };
}

/** Forma que se envía a Supabase para insertar una selección deportiva. */
export interface UserSportInsert {
  user_id: string;
  sport: Sport;
  discipline: CyclingDiscipline | GymCardioDiscipline | '';
  custom_discipline_label: string | null;
}

export function toUserSportInsert(userId: string, selection: UserSportSelection): UserSportInsert {
  if (selection.sport === 'gym_cardio' && selection.discipline === 'other') {
    return {
      user_id: userId,
      sport: 'gym_cardio',
      discipline: 'other',
      custom_discipline_label: selection.customLabel,
    };
  }

  return {
    user_id: userId,
    sport: selection.sport,
    discipline: selection.discipline ?? '',
    custom_discipline_label: null,
  };
}
