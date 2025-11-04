// src/components/LazyComponents.tsx
// Lazy loading configuration for heavy components
// Import this in your pages to reduce initial bundle size

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);

// ✅ FIX: Lazy load TripAddOns con export nombrado
export const LazyTripAddOns = dynamic(
  () => import('@/components/booking/TripAddOns').then((mod) => mod.TripAddOns),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // No SSR needed for this component
  }
);

// ⚠️ COMENTADO: Descomenta cuando crees estos componentes
/*
// Lazy load Map component (if you have one)
export const LazyMap = dynamic(
  () => import('@/components/Map'),
  {
    loading: () => (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    ),
    ssr: false,
  }
);

// Lazy load Heavy forms or editors
export const LazyRichTextEditor = dynamic(
  () => import('@/components/RichTextEditor'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);
*/

// Example usage in your page:
/*
import { LazyTripAddOns } from '@/components/LazyComponents';

function BookingPage() {
  return (
    <div>
      <h1>Booking Details</h1>
      
      {/* This will only load when rendered *\/}
      <LazyTripAddOns 
        selectedAddOns={addOns}
        onAddOnsChange={setAddOns}
      />
    </div>
  );
}
*/