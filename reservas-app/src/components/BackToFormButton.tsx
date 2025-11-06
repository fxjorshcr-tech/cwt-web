// src/components/BackToFormButton.tsx
// UPDATED: Arrow pointing UP to booking form

'use client';

import { ArrowUp } from 'lucide-react';

export default function BackToFormButton() {
  const scrollToBookingForm = () => {
    const bookingForm = document.getElementById('booking');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback: scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 text-center">
        <button
          onClick={scrollToBookingForm}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          aria-label="Go back to booking form"
        >
          <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
          <span>Go to Booking Form</span>
        </button>
        <p className="text-sm text-gray-600 mt-4">
          Book your private shuttle in just a few clicks
        </p>
      </div>
    </div>
  );
}