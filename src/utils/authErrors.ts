function normalizeErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return message.toLowerCase();
}

/** Distingue el caso "email sin confirmar" para poder ofrecer reenviar el correo. */
export function isEmailNotConfirmedError(error: unknown): boolean {
  const normalized = normalizeErrorMessage(error);
  return normalized.includes('email not confirmed') || normalized.includes('email_not_confirmed');
}

/**
 * Traduce errores técnicos de Supabase Auth a mensajes en español que un
 * usuario pueda entender. Nunca debe mostrarse un mensaje técnico crudo
 * (código HTTP, texto de AuthApiError, etc.) en la interfaz.
 */
export function mapAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials') || normalized.includes('invalid_credentials')) {
    return 'El correo o la contraseña no son correctos.';
  }
  if (normalized.includes('email not confirmed') || normalized.includes('email_not_confirmed')) {
    return 'Debes confirmar tu correo antes de iniciar sesión.';
  }
  if (normalized.includes('already registered') || normalized.includes('user_already_exists')) {
    return 'Ya existe una cuenta con este correo.';
  }
  if (normalized.includes('password should be at least') || normalized.includes('weak_password')) {
    return 'La contraseña es demasiado corta o débil.';
  }
  if (
    normalized.includes('email rate limit') ||
    normalized.includes('over_email_send_rate_limit') ||
    normalized.includes('rate limit')
  ) {
    return 'Has solicitado demasiados correos. Espera unos minutos e inténtalo de nuevo.';
  }
  if (
    normalized.includes('token has expired') ||
    normalized.includes('invalid or expired') ||
    normalized.includes('otp_expired')
  ) {
    return 'El enlace ha caducado. Solicita uno nuevo.';
  }
  if (normalized.includes('failed to fetch') || normalized.includes('network') || normalized.includes('load failed')) {
    return 'No hemos podido conectar. Inténtalo de nuevo.';
  }

  if (import.meta.env.DEV) {
    // Solo en desarrollo, y solo el mensaje de error: nunca tokens, claves ni contraseñas.
    console.error('[auth] Error no mapeado:', message);
  }

  return 'Ha ocurrido un error. Inténtalo de nuevo.';
}
