// src/lib/supabase/client.ts
// ✅ CORREGIDO: No lanzar errores a nivel de módulo para evitar crashes críticos

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Creates a Supabase browser client
 * @throws Error if environment variables are not configured (deferred to runtime)
 */
export const createClient = () => {
  // ✅ Validate at runtime instead of module load time
  // This allows Error Boundaries to catch the error
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Missing environment variables');
    throw new Error(
      'Configuration error. Please refresh the page or try again later.'
    );
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
};

/**
 * Check if Supabase is properly configured
 * Use this for graceful degradation
 */
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};