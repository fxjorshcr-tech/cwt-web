// src/components/BackToFormButton.tsx
'use client';

import { ArrowUp } from 'lucide-react';

export default function BackToFormButton() {
  const scrollToBookingForm = () => {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="py-12 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <button
          onClick={scrollToBookingForm}
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          <ArrowUp className="h-5 w-5" />
          <span>Back to Booking Form</span>
        </button>
        <p className="text-sm text-gray-600 mt-4">
          Book your private shuttle in just a few clicks
        </p>
      </div>
    </div>
  );
}