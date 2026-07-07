import {
  CARDIO_GROUP_LABEL,
  CARDIO_GROUP_SPORTS,
  SPORT_LABELS,
  formatDisciplineLabel,
  sortByDisciplineOrder,
  type DisplayableUserSport,
} from '../../utils/sportsCatalog';
import type { Sport } from '../../types/sport';
import './UserSportsSummary.css';

interface UserSportsSummaryProps {
  entries: readonly DisplayableUserSport[];
}

/**
 * Muestra las áreas deportivas elegidas de forma jerárquica (módulo → disciplinas),
 * nunca como una lista plana de badges. "Cardio" es solo un encabezado visual:
 * agrupa Atletismo, Ciclismo y Cardio en gimnasio, pero no es un dato guardado.
 * Se usa tanto en el resumen del onboarding como en la pantalla privada.
 */
export function UserSportsSummary({ entries }: UserSportsSummaryProps) {
  const bySport = new Map<Sport, DisplayableUserSport[]>();
  for (const entry of entries) {
    const list = bySport.get(entry.sport) ?? [];
    list.push(entry);
    bySport.set(entry.sport, list);
  }

  const hasCardioGroup = CARDIO_GROUP_SPORTS.some((sport) => bySport.has(sport));

  function disciplinesLine(sport: Sport): string {
    return sortByDisciplineOrder(bySport.get(sport)!)
      .map(formatDisciplineLabel)
      .join(', ');
  }

  return (
    <div className="user-sports-summary">
      {bySport.has('strength') && <p className="user-sports-summary__item text-body">{SPORT_LABELS.strength}</p>}

      {hasCardioGroup && (
        <div className="user-sports-summary__group">
          <p className="user-sports-summary__group-label text-label text-secondary">{CARDIO_GROUP_LABEL}</p>

          {bySport.has('athletics') && (
            <p className="user-sports-summary__item text-body">{SPORT_LABELS.athletics}</p>
          )}
          {bySport.has('cycling') && (
            <p className="user-sports-summary__item text-body">
              {SPORT_LABELS.cycling} — {disciplinesLine('cycling')}
            </p>
          )}
          {bySport.has('gym_cardio') && (
            <p className="user-sports-summary__item text-body">
              {SPORT_LABELS.gym_cardio} — {disciplinesLine('gym_cardio')}
            </p>
          )}
        </div>
      )}

      {bySport.has('home_training') && (
        <p className="user-sports-summary__item text-body">{SPORT_LABELS.home_training}</p>
      )}
      {bySport.has('swimming') && <p className="user-sports-summary__item text-body">{SPORT_LABELS.swimming}</p>}
      {bySport.has('stretching') && (
        <p className="user-sports-summary__item text-body">{SPORT_LABELS.stretching}</p>
      )}
    </div>
  );
}
