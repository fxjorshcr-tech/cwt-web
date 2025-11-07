// lib/getDestinationRoutes.ts
import { createClient } from '@/lib/supabase/client';

export interface Route {
  id: number;
  created_at?: string;  // ← Agregado (opcional)
  origen: string | null;  // ← Agregado | null
  destino: string | null;  // ← Agregado | null
  duracion: string | null;  // ← Agregado | null
  kilometros: number | null;  // ← Agregado | null
  precio1a6: number | null;  // ← Agregado | null
  precio7a9: number | null;  // ← Agregado | null
  precio10a12: number | null;  // ← Agregado | null
  precio13a18: number | null;  // ← Agregado | null
  alias: string | null;
}

/**
 * Obtiene las rutas desde/hacia un destino específico desde Supabase
 * @param destinationName - Nombre del destino (ej: "La Fortuna", "Puerto Viejo")
 * @returns Array de rutas que conectan con ese destino
 */
export async function getDestinationRoutes(destinationName: string): Promise<Route[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .or(`origen.ilike.%${destinationName}%,destino.ilike.%${destinationName}%`)
      .order('duracion', { ascending: true });

    if (error) {
      console.error('Error fetching routes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDestinationRoutes:', error);
    return [];
  }
}

/**
 * Formatea la duración para mostrar (ej: "3:00" → "3 hours")
 */
export function formatDuration(duration: string | null): string {
  if (!duration) return 'N/A';
  
  const parts = duration.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  return `${hours}h ${minutes}min`;
}

/**
 * Obtiene el precio base para mostrar (precio más común: 1-6 personas)
 */
export function getBasePrice(route: Route): number {
  return route.precio1a6 || 0;  // ← Agregado || 0 por si es null
}