import { useCallback, useEffect, useState } from 'react';
import { getFitnessProfile } from '../services/fitnessProfileService';
import type { FitnessProfile } from '../types/fitnessProfile';
import { useAuth } from './useAuth';

type FitnessProfileStatus = 'idle' | 'loading' | 'ready' | 'error';

interface UseFitnessProfileResult {
  fitnessProfile: FitnessProfile | null;
  status: FitnessProfileStatus;
  error: string | null;
  refresh: () => void;
}

/**
 * Carga el perfil deportivo del usuario autenticado. El acceso real está
 * protegido por RLS en PostgreSQL (auth.uid() = user_id); este hook no
 * filtra nada por seguridad, solo refleja lo que la base de datos decide
 * devolver.
 */
export function useFitnessProfile(): UseFitnessProfileResult {
  const { user } = useAuth();
  const [fitnessProfile, setFitnessProfile] = useState<FitnessProfile | null>(null);
  const [status, setStatus] = useState<FitnessProfileStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    if (!user) {
      setFitnessProfile(null);
      setStatus('idle');
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setError(null);

    getFitnessProfile(user.id)
      .then((result) => {
        if (cancelled) return;
        setFitnessProfile(result);
        setStatus('ready');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (import.meta.env.DEV) {
          console.error('[fitness-profile] Error al cargar el perfil deportivo:', err);
        }
        setError('No hemos podido cargar tu perfil deportivo. Inténtalo de nuevo.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [user, refreshToken]);

  const refresh = useCallback(() => setRefreshToken((t) => t + 1), []);

  return { fitnessProfile, status, error, refresh };
}
