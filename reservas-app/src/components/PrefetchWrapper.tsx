// src/components/PrefetchWrapper.tsx
// ✅ Componente cliente que hace prefetch del flujo de booking
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function PrefetchWrapper() {
  const router = useRouter();

  useEffect(() => {
    // Espera 2 segundos después de que la página carga
    // para no interferir con la carga inicial
    const timer = setTimeout(() => {
      // Prefetch de las rutas críticas del flujo de booking
      router.prefetch('/booking-details');
      router.prefetch('/summary');
      router.prefetch('/confirmation');
      
      // Prefetch de tours (menos crítico)
      router.prefetch('/private-tours');
      router.prefetch('/transfers');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return null; // No renderiza nada
}
