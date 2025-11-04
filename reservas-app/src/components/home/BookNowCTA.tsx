// src/components/home/BookNowCTA.tsx
'use client';

import { ArrowDown, Calendar } from 'lucide-react';

export default function BookNowCTA() {
  const scrollToBookingForm = () => {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <div className="text-white">
          <Calendar className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book Your Costa Rica Shuttle?
          </h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Get instant confirmation in under 5 minutes. No hidden fees, transparent pricing, 
            and professional service guaranteed.
          </p>
          <button
            onClick={scrollToBookingForm}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl"
          >
            <span>Book Your Shuttle Now</span>
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
          <p className="text-sm text-orange-100 mt-6">
            ✓ Instant confirmation  •  ✓ 24/7 support  •  ✓ Free cancellation up to 48hrs
          </p>
        </div>
      </div>
    </section>
  );
}