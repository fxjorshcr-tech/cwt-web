// src/components/forms/QuickSearchForm.tsx
// Lightweight search form for Home/Transfers pages
// Uses existing LocationAutocomplete, ModernDatePicker, PassengerSelector
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, AlertCircle, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { LocationAutocomplete } from './LocationAutocomplete';
import { ModernDatePicker } from './ModernDatePicker';
import { PassengerSelector } from './PassengerSelector';
import { loadRoutesFromSupabase, calculateTripPrice, type Route } from '@/utils/bookingFormHelpers';
import { formatDateToString } from '@/utils/timeHelpers';

interface QuickSearchFormProps {
  className?: string;
}

export function QuickSearchForm({ className = '' }: QuickSearchFormProps) {
  const router = useRouter();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Load routes
  useEffect(() => {
    async function loadRoutes() {
      setIsLoadingRoutes(true);
      const supabase = createClient();
      const { routes: loadedRoutes, error: loadError } = await loadRoutesFromSupabase(supabase);

      if (loadError) {
        setError(loadError);
      } else if (loadedRoutes) {
        setRoutes(loadedRoutes);
      }
      setIsLoadingRoutes(false);
    }
    loadRoutes();
  }, []);

  // Reset destination when origin changes
  useEffect(() => {
    if (origin && destination) {
      const validRoute = routes.find(r => r.origen === origin && r.destino === destination);
      if (!validRoute) {
        setDestination('');
      }
    }
  }, [origin, destination, routes]);

  // Handle passengers change
  const handlePassengersChange = (newAdults: number, newChildren: number) => {
    setAdults(newAdults);
    setChildren(newChildren);
  };

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const totalPassengers = adults + children;

    if (!origin || !destination || !date) {
      setError('Please fill in all fields');
      return;
    }

    if (totalPassengers > 12) {
      setError('For groups larger than 12, please contact us via WhatsApp');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Find the route
      const route = routes.find(r => r.origen === origin && r.destino === destination);
      if (!route) {
        setError('Route not available');
        setIsSubmitting(false);
        return;
      }

      // Generate booking ID
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Calculate price
      const price = calculateTripPrice(route, totalPassengers);

      // Create booking data
      const bookingData = {
        bookingId,
        trips: [{
          from_location: origin,
          to_location: destination,
          date: formatDateToString(date),
          adults,
          children,
          price,
          duration: route.duracion,
          routeId: route.id,
          calculatedPrice: price,
        }],
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));

      // Navigate to preview
      router.push(`/preview?booking_id=${bookingId}`);
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  if (isLoadingRoutes) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-6 ${className}`}>
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading routes...</span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-xl overflow-visible ${className}`}
    >
      {error && (
        <div className="px-5 pt-5">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
            <button type="button" onClick={() => setError(null)}>
              <X className="h-4 w-4 text-red-500 hover:text-red-700" />
            </button>
          </div>
        </div>
      )}

      <div className="p-5 md:p-6">
        {/* Grid layout - responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Origin */}
          <div>
            <LocationAutocomplete
              label="Pick-up Location"
              placeholder="Where from?"
              value={origin}
              onChange={setOrigin}
              routes={routes}
              filterByDestination={destination}
              type="origin"
            />
          </div>

          {/* Destination */}
          <div>
            <LocationAutocomplete
              label="Drop-off Location"
              placeholder={origin ? "Where to?" : "Select origin first"}
              value={destination}
              onChange={setDestination}
              routes={routes}
              filterByOrigin={origin}
              disabled={!origin}
              type="destination"
            />
          </div>

          {/* Date */}
          <div>
            <ModernDatePicker
              label="Travel Date"
              value={date}
              onChange={setDate}
            />
          </div>

          {/* Passengers */}
          <div>
            <PassengerSelector
              label="Passengers"
              adults={adults}
              children={children}
              onPassengersChange={handlePassengersChange}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting || !origin || !destination || !date}
            className="w-full sm:w-auto min-w-[220px] py-3.5 px-10 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Search Transfers
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
