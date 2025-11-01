// src/lib/supabase/client.ts

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * CLIENTE DE SUPABASE PARA EL NAVEGADOR (Singleton Pattern)
 * 
 * ✅ Este cliente:
 * - Se crea UNA SOLA VEZ (patrón singleton)
 * - Se reutiliza en toda la aplicación
 * - Evita el warning de múltiples instancias de GoTrueClient
 * - Solo se usa en Client Components ('use client')
 * 
 * ❌ NO usar este cliente en:
 * - Server Components
 * - Server Actions
 * - API Routes
 * - Middleware
 * 
 * Para esos casos, usar: @/lib/supabase/server
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validación de variables de entorno
if (!supabaseUrl) {
  throw new Error('⚠️ Falta NEXT_PUBLIC_SUPABASE_URL en las variables de entorno');
}

if (!supabaseAnonKey) {
  throw new Error('⚠️ Falta NEXT_PUBLIC_SUPABASE_ANON_KEY en las variables de entorno');
}

// Variable para almacenar la instancia única (Singleton)
let clientInstance: SupabaseClient<Database> | null = null;

/**
 * Crea o retorna el cliente único de Supabase
 * 
 * @returns Cliente de Supabase tipado con tu base de datos
 * 
 * @example
 * ```tsx
 * 'use client'
 * 
 * import { createClient } from '@/lib/supabase/client'
 * 
 * export function MyComponent() {
 *   const supabase = createClient()
 *   
 *   async function fetchData() {
 *     const { data } = await supabase.from('trips').select('*')
 *   }
 * }
 * ```
 */
export function createClient(): SupabaseClient<Database> {
  // Si ya existe una instancia, la reutilizamos (Singleton)
  if (clientInstance) {
    return clientInstance;
  }

  // Si no existe, creamos una nueva instancia
  clientInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,      // Mantiene la sesión en localStorage
      autoRefreshToken: true,    // Refresca el token automáticamente
      detectSessionInUrl: true,  // Detecta sesión en URL (para magic links)
    },
  });

  return clientInstance;
}

/**
 * Resetea el cliente (útil para testing o logout completo)
 * 
 * ⚠️ ADVERTENCIA: Solo usar cuando realmente necesites destruir la instancia
 * Por ejemplo: después de un logout o en tests
 */
export function resetClient() {
  if (clientInstance) {
    // No hay método destroy() en Supabase, simplemente eliminamos la referencia
    clientInstance = null;
  }
}

/**
 * Obtiene el cliente actual sin crear uno nuevo
 * Retorna null si no existe
 */
export function getClientInstance(): SupabaseClient<Database> | null {
  return clientInstance;
}