// src/components/LocalStorageCleanup.tsx
// ✅ CORREGIDO: Client component con cleanup adecuado para evitar memory leaks
'use client';

import { useEffect } from 'react';
import { initLocalStorageCleanup } from '@/utils/localStorage-cleanup';

export default function LocalStorageCleanup() {
  useEffect(() => {
    // ✅ CRÍTICO: Capturar y retornar la función de cleanup
    // Sin esto, el setInterval nunca se limpia y causa memory leak
    const cleanup = initLocalStorageCleanup();

    // ✅ Limpiar el interval cuando el componente se desmonta
    return cleanup;
  }, []);

  return null; // No UI, just runs cleanup
}
