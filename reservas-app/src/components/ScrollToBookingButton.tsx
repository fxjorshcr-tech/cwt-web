// src/components/ScrollToBookingButton.tsx
// ✅ Botón flotante para volver al top - Aparece al hacer scroll
'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToBookingButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Throttle: solo ejecutar después de 100ms de inactividad
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Mostrar el botón cuando el usuario ha scrolleado más de 400px
        setIsVisible(window.scrollY > 400);
      }, 100);
    };

    // Escuchar scroll con passive para mejor performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check inicial
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // No renderizar nada si no está visible
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-45 px-5 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300"
      aria-label="Back to top"
    >
      <span className="hidden sm:inline">Back to Top</span>
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}