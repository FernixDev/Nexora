import { useCallback, useEffect, useState } from 'react';
import { getProfile } from '../services/profileService';
import type { Profile } from '../types/profile';
import { useAuth } from './useAuth';

type ProfileStatus = 'idle' | 'loading' | 'ready' | 'error';

interface UseProfileResult {
  profile: Profile | null;
  status: ProfileStatus;
  error: string | null;
  refresh: () => void;
}

/**
 * Carga el perfil del usuario autenticado. El acceso real está protegido por
 * RLS en PostgreSQL (auth.uid() = id); este hook no filtra nada por seguridad,
 * solo refleja lo que la base de datos decide devolver.
 */
export function useProfile(): UseProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<ProfileStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setStatus('idle');
      setError(null);
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setError(null);

    getProfile(user.id)
      .then((result) => {
        if (cancelled) return;
        setProfile(result);
        setStatus('ready');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (import.meta.env.DEV) {
          console.error('[profile] Error al cargar el perfil:', err);
        }
        setError('No hemos podido cargar tu perfil. Inténtalo de nuevo.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [user, refreshToken]);

  const refresh = useCallback(() => setRefreshToken((t) => t + 1), []);

  return { profile, status, error, refresh };
}
