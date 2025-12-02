'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuickSearchForm } from '@/components/forms/QuickSearchForm';

export default function TransfersBookingSection() {
  const searchParams = useSearchParams();
  const bookingFormRef = useRef<HTMLDivElement>(null);

  // Get initial values from URL params (for indexed routes)
  // ✅ Added null safety for searchParams
  const initialOrigin = searchParams?.get('from') || '';
  const initialDestination = searchParams?.get('to') || '';

  // Handle hash navigation and auto-scroll when coming from indexed routes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasHash = window.location.hash === '#booking-form';
      const hasParams = initialOrigin && initialDestination;

      if (hasHash || hasParams) {
        const timer = setTimeout(() => {
          bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [initialOrigin, initialDestination]);

  return (
    <section
      id="booking-form"
      ref={bookingFormRef}
      className="relative -mt-16 z-20 px-4 sm:px-6 pb-16"
    >
      <div className="max-w-4xl mx-auto">
        <QuickSearchForm
          initialOrigin={initialOrigin}
          initialDestination={initialDestination}
        />
      </div>
    </section>
  );
}
