// src/components/LocalStorageCleanup.tsx
// ✅ Client component to initialize localStorage cleanup
'use client';

import { useEffect } from 'react';
import { initLocalStorageCleanup } from '@/utils/localStorage-cleanup';

export default function LocalStorageCleanup() {
  useEffect(() => {
    initLocalStorageCleanup();
  }, []);

  return null; // No UI, just runs cleanup
}
