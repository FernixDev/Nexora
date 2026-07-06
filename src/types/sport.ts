/**
 * Modelo de deportes de Nexora. Un usuario puede elegir varias áreas a la
 * vez (no existe deporte principal ni deportes secundarios). Solo cycling
 * tiene disciplina propia por ahora (road/mtb); el resto no tiene disciplina.
 */

export type Sport = 'strength' | 'athletics' | 'cycling' | 'swimming' | 'stretching';

export type CyclingDiscipline = 'road' | 'mtb';

export interface UserSportSelection {
  sport: Sport;
  discipline: CyclingDiscipline | null;
}

export interface UserSport extends UserSportSelection {
  userId: string;
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
  discipline: CyclingDiscipline | '';
  created_at: string;
}

export function mapUserSportRow(row: UserSportRow): UserSport {
  return {
    userId: row.user_id,
    sport: row.sport,
    discipline: row.discipline === '' ? null : row.discipline,
    createdAt: row.created_at,
  };
}

/** Forma que se envía a Supabase para insertar una selección deportiva. */
export interface UserSportInsert {
  user_id: string;
  sport: Sport;
  discipline: CyclingDiscipline | '';
}

export function toUserSportInsert(userId: string, selection: UserSportSelection): UserSportInsert {
  return { user_id: userId, sport: selection.sport, discipline: selection.discipline ?? '' };
}
