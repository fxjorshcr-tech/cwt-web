// src/lib/getDestinationRoutes.ts
/**
 * ==========================================
 * FUNCIONES PARA OBTENER RUTAS POR DESTINO
 * ==========================================
 * VERSIÓN CLIENTE - Para Client Components únicamente
 */

import { createClient } from '@/lib/supabase/client';
import type { Route } from '@/types/supabase';

/**
 * Interface de Route con todos los campos
 */
export interface RouteWithDetails {
  id: number;
  created_at?: string;
  origen: string | null;
  destino: string | null;
  duracion: string | null;
  kilometros: number | null;
  precio1a6: number | null;
  precio7a9: number | null;
  precio10a12: number | null;
  precio13a18: number | null;
  alias: string | null;
}

// Re-export del tipo Route para compatibilidad
export type { Route };

/**
 * Obtiene rutas que conectan con un destino específico
 * SOLO para Client Components ('use client')
 * 
 * @param destinationName - Nombre del destino (ej: "La Fortuna", "Puerto Viejo")
 * @returns Array de rutas que conectan con ese destino
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * const routes = await getDestinationRoutes('La Fortuna');
 * ```
 */
export async function getDestinationRoutes(destinationName: string): Promise<RouteWithDetails[]> {
  try {
    // Sanitizar input para prevenir SQL injection
    const sanitizedDestination = destinationName
      .replace(/[%_]/g, '')      // Remover wildcards de SQL
      .replace(/['"]/g, '')      // Remover comillas
      .trim()
      .slice(0, 100);            // Limitar longitud

    if (!sanitizedDestination) {
      console.warn('⚠️ Empty destination name provided to getDestinationRoutes');
      return [];
    }

    // Usar el cliente de Supabase para el navegador
    const supabase = createClient();

    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .or(`origen.ilike.%${sanitizedDestination}%,destino.ilike.%${sanitizedDestination}%`)
      .order('duracion', { ascending: true });

    if (error) {
      console.error('❌ Error fetching routes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('💥 Error in getDestinationRoutes:', error);
    return [];
  }
}

/**
 * Formatea la duración para mostrar (ej: "3:00" → "3 hours")
 * @param duration - Duración en formato H:mm
 * @returns Duración formateada
 */
export function formatDuration(duration: string | null): string {
  if (!duration) return 'N/A';
  
  const parts = duration.split(':');
  if (parts.length !== 2) return duration;
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  if (isNaN(hours) || isNaN(minutes)) return duration;
  
  if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${minutes}min`;
}

/**
 * Obtiene el precio base para mostrar (precio más común: 1-6 personas)
 * @param route - Ruta
 * @returns Precio base
 */
export function getBasePrice(route: RouteWithDetails): number {
  return route.precio1a6 || 0;
}