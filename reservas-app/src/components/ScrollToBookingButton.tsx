// src/components/ScrollToBookingButton.tsx
// ✅ Botón flotante SOLO para Home - Aparece cuando el form está fuera de vista
'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToBookingButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el botón solo cuando el usuario scrollea PASANDO el form
      const bookingForm = document.getElementById('booking-form');
      if (bookingForm) {
        const formRect = bookingForm.getBoundingClientRect();
        const formTop = formRect.top;
        const formBottom = formRect.bottom;
        
        // Mostrar si el form está completamente arriba (fuera de vista hacia arriba)
        setIsVisible(formBottom < 0);
      }
    };

    // Escuchar scroll
    window.addEventListener('scroll', handleScroll);
    
    // Check inicial
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBookingForm = () => {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // No renderizar nada si no está visible
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToBookingForm}
      className="fixed bottom-24 right-6 z-40 px-5 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300"
      aria-label="Go to booking form"
    >
      <span className="hidden sm:inline">Go to Booking Form</span>
      <span className="sm:hidden">Book Now</span>
      <ArrowUp className="h-5 w-5 animate-bounce" />
    </button>
  );
}