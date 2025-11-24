// src/hooks/usePrefetch.ts
// ✅ Hook para prefetch programático de rutas
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function usePrefetch(routes: string[]) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch todas las rutas después de que la página cargue
    const timer = setTimeout(() => {
      routes.forEach(route => {
        router.prefetch(route);
      });
    }, 1000); // Espera 1 segundo para no interferir con la carga inicial

    return () => clearTimeout(timer);
  }, [routes, router]);
}

// Hook específico para el flujo de booking
export function usePrefetchBookingFlow() {
  usePrefetch([
    '/booking-details',
    '/summary',
    '/confirmation',
  ]);
}

// Hook para prefetch de tours
export function usePrefetchTours() {
  usePrefetch([
    '/private-tours',
  ]);
}
