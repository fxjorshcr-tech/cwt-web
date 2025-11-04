// src/components/ScrollToFormButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

export default function ScrollToFormButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (approximately 100vh)
      const scrollPosition = window.scrollY;
      const shouldShow = scrollPosition > window.innerHeight * 0.8;
      
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToForm}
      className="fixed bottom-24 right-6 z-40 group"
      aria-label="Go to booking form"
    >
      <div className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center gap-2">
        <span className="text-sm font-medium whitespace-nowrap">
          Go to Booking Form
        </span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </div>
    </button>
  );
}