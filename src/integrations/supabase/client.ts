import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Faltan las variables de entorno de Supabase. Define VITE_SUPABASE_URL y ' +
      'VITE_SUPABASE_PUBLISHABLE_KEY en tu archivo .env.local (ver .env.example).',
  );
}

/**
 * Instancia única y reutilizable del cliente de Supabase para todo el frontend.
 * Usa siempre la publishable key: nunca la service_role ni ninguna clave secreta.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabasePublishableKey);
