// src/lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

/**
 * CLIENTE DE SUPABASE PARA EL SERVIDOR
 * 
 * Este cliente se usa SOLO en:
 * - Server Components (sin 'use client')
 * - Server Actions
 * - Route Handlers (API routes)
 * - Middleware
 * 
 * ✅ Ventajas:
 * - Maneja cookies de forma segura
 * - Perfecto para SSR (mejor SEO)
 * - Protege datos sensibles del cliente
 */

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Error silencioso en Server Components
            // Las cookies solo se pueden establecer en Server Actions
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Error silencioso en Server Components
          }
        },
      },
    }
  );
}