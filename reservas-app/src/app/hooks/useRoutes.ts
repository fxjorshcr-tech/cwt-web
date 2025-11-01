// src/hooks/useRoutes.ts
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * TIPOS DE DATOS ADAPTADOS A TU ESTRUCTURA REAL
 */

export interface Route {
  id: number;
  origen: string;
  destino: string;
  precio1a6: number;
  precio7a9: number;
  precio10a12: number;
  precio13a18: number;
  kilometros: number;
  duracion: string;
  alias?: string;
  created_at?: string;
}

/**
 * HOOK: useRoutes
 * 
 * Carga las rutas desde TU tabla real "routes"
 * Calcula el precio correcto según el número de pasajeros
 */

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  async function loadRoutes() {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      
      const { data, error: fetchError } = await supabase
        .from('routes')
        .select('*')
        .order('origen');

      if (fetchError) {
        console.error('Error fetching routes:', fetchError);
        setError(fetchError.message);
        return;
      }

      setRoutes(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Error al cargar las rutas');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Buscar una ruta específica por origen y destino
   */
  function findRoute(origen: string, destino: string): Route | undefined {
    return routes.find(
      (route) =>
        route.origen === origen &&
        route.destino === destino
    );
  }

  /**
   * Calcular el precio correcto según el número de pasajeros
   */
  function calculatePrice(route: Route, totalPassengers: number): number {
    if (totalPassengers <= 6) {
      return route.precio1a6;
    } else if (totalPassengers <= 9) {
      return route.precio7a9;
    } else if (totalPassengers <= 12) {
      return route.precio10a12;
    } else if (totalPassengers <= 18) {
      return route.precio13a18;
    }
    // Si son más de 18, usar el precio más alto disponible
    return route.precio13a18;
  }

  /**
   * Obtener lista única de orígenes
   */
  function getOrigins(): string[] {
    const origins = routes.map((route) => route.origen);
    return Array.from(new Set(origins)).sort();
  }

  /**
   * Obtener destinos disponibles para un origen específico
   */
  function getDestinations(origen: string): string[] {
    const destinations = routes
      .filter((route) => route.origen === origen)
      .map((route) => route.destino);
    return Array.from(new Set(destinations)).sort();
  }

  return {
    routes,
    loading,
    error,
    findRoute,
    calculatePrice,
    getOrigins,
    getDestinations,
    reload: loadRoutes,
  };
}