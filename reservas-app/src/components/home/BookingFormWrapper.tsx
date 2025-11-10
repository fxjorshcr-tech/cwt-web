// src/components/home/BookingFormWrapper.tsx
// ✅ Wrapper con Suspense para resolver el error de useSearchParams
'use client';

import { Suspense } from 'react';
import { BookingForm } from './BookingForm';

function FormSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 space-y-4">
          <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-xl h-16 w-full" />
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-11 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-11 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingFormWrapper() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <BookingForm />
    </Suspense>
  );
}