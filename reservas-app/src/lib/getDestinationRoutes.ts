// lib/getDestinationRoutes.ts
import { createClient } from '@/lib/supabase/client';

export interface Route {
  id: number;
  origen: string;
  destino: string;
  duracion: string;
  kilometros: number;
  preciola6: number;
  precio7a9: number;
  precio10a12: number;
  precio13a18: number;
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
export function formatDuration(duration: string): string {
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
  return route.preciola6;
}