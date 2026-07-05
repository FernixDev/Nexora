import type { AuthError, AuthResponse, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

export interface SignUpParams {
  email: string;
  password: string;
  displayName: string;
}

export async function signUpWithPassword({ email, password, displayName }: SignUpParams): Promise<AuthResponse> {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });
}

export interface SignInParams {
  email: string;
  password: string;
}

export async function signInWithPassword({ email, password }: SignInParams) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  return supabase.auth.signOut();
}

export async function resendConfirmationEmail(email: string) {
  return supabase.auth.resend({ type: 'signup', email });
}

export async function sendPasswordResetEmail(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/nueva-contrasena`,
  });
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({ password });
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
