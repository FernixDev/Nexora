import { useCallback, useEffect, useState } from 'react';
import { getUserSports } from '../services/userSportsService';
import type { UserSport } from '../types/sport';
import { useAuth } from './useAuth';

type UserSportsStatus = 'idle' | 'loading' | 'ready' | 'error';

interface UseUserSportsResult {
  userSports: UserSport[];
  status: UserSportsStatus;
  error: string | null;
  refresh: () => void;
}

/**
 * Carga los deportes elegidos por el usuario autenticado. El acceso real
 * está protegido por RLS en PostgreSQL (auth.uid() = user_id); este hook no
 * filtra nada por seguridad, solo refleja lo que la base de datos decide
 * devolver. Una lista vacía es un resultado válido (usuario que aún no ha
 * elegido deportes), no un error.
 */
export function useUserSports(): UseUserSportsResult {
  const { user } = useAuth();
  const [userSports, setUserSports] = useState<UserSport[]>([]);
  const [status, setStatus] = useState<UserSportsStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    if (!user) {
      setUserSports([]);
      setStatus('idle');
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setError(null);

    getUserSports(user.id)
      .then((result) => {
        if (cancelled) return;
        setUserSports(result);
        setStatus('ready');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (import.meta.env.DEV) {
          console.error('[user-sports] Error al cargar tus deportes:', err);
        }
        setError('No hemos podido cargar tus deportes. Inténtalo de nuevo.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [user, refreshToken]);

  const refresh = useCallback(() => setRefreshToken((t) => t + 1), []);

  return { userSports, status, error, refresh };
}
