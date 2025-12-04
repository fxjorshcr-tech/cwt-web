// src/components/forms/QuickSearchForm.tsx
// ✅ CORREGIDO: Manejo robusto de localStorage y errores
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, AlertCircle, X, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { LocationAutocomplete } from './LocationAutocomplete';
import { ModernDatePicker } from './ModernDatePicker';
import { PassengerSelector } from './PassengerSelector';
import { loadRoutesFromSupabase, calculateTripPrice, type Route } from '@/utils/bookingFormHelpers';
import { formatDateToString } from '@/utils/timeHelpers';
import { isLocalStorageAvailable, saveBookingToLocalStorage } from '@/utils/localStorageHelpers';

interface QuickSearchFormProps {
  className?: string;
  initialOrigin?: string;
  initialDestination?: string;
}

export function QuickSearchForm({
  className = '',
  initialOrigin = '',
  initialDestination = '',
}: QuickSearchFormProps) {
  const router = useRouter();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'approved'>('idle');

  // Form state - use initial values if provided
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Update origin/destination when initial values change (from URL params)
  useEffect(() => {
    if (initialOrigin) setOrigin(initialOrigin);
    if (initialDestination) setDestination(initialDestination);
  }, [initialOrigin, initialDestination]);

  // Load routes with error handling
  useEffect(() => {
    async function loadRoutes() {
      setIsLoadingRoutes(true);
      setError(null);

      try {
        const supabase = createClient();
        const { routes: loadedRoutes, error: loadError } = await loadRoutesFromSupabase(supabase);

        if (loadError) {
          setError(loadError);
        } else if (loadedRoutes) {
          setRoutes(loadedRoutes);
        }
      } catch (err) {
        // ✅ Catch any unexpected errors during Supabase client creation or query
        console.error('Error loading routes:', err);
        setError('Unable to connect to our servers. Please check your internet connection and try again.');
      }

      setIsLoadingRoutes(false);
    }
    loadRoutes();
  }, []);

  // Reset destination when origin changes (but NOT when values come from URL params)
  useEffect(() => {
    // Skip validation if origin/destination came from URL params (initialOrigin/initialDestination)
    // This prevents resetting the destination when routes are loaded
    if (initialOrigin && initialDestination) {
      return; // Don't reset - values came from indexed route page
    }

    if (origin && destination) {
      const validRoute = routes.find(r => r.origen === origin && r.destino === destination);
      if (!validRoute) {
        setDestination('');
      }
    }
  }, [origin, destination, routes, initialOrigin, initialDestination]);

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

    // ✅ Check localStorage availability before proceeding
    if (!isLocalStorageAvailable()) {
      setError('Your browser settings are blocking this feature. Please enable cookies/localStorage or try a different browser.');
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

      // Show "Preparing your quote..." for 300ms
      setAvailabilityStatus('checking');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Show "Quote ready!" for 300ms
      setAvailabilityStatus('approved');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Generate booking ID
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Calculate price
      const price = calculateTripPrice(route, totalPassengers);

      // Create booking data
      const bookingData = {
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

      // ✅ Save to localStorage using safe function
      const saved = saveBookingToLocalStorage(bookingId, bookingData);

      if (!saved) {
        throw new Error('Failed to save booking data. Please check your browser settings.');
      }

      // Navigate to preview - keep isSubmitting true to prevent double clicks
      router.push(`/preview?booking_id=${bookingId}`);
    } catch (err) {
      console.error('Search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
      setIsSubmitting(false);
      setAvailabilityStatus('idle');
    }
  }

  // Retry loading routes
  const retryLoadRoutes = async () => {
    setError(null);
    setIsLoadingRoutes(true);
    const supabase = createClient();
    const { routes: loadedRoutes, error: loadError } = await loadRoutesFromSupabase(supabase);

    if (loadError) {
      setError(loadError);
    } else if (loadedRoutes) {
      setRoutes(loadedRoutes);
    }
    setIsLoadingRoutes(false);
  };

  if (isLoadingRoutes) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl overflow-visible notranslate ${className}`} translate="no">
        {/* Same header as the form */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 rounded-t-2xl">
          <h2 className="text-white font-bold text-lg text-center">Get an Instant Quote</h2>
        </div>
        {/* Same height as the form content */}
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skeleton placeholders matching form fields */}
            <div className="h-[72px] bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-[72px] bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-[72px] bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-[72px] bg-gray-100 rounded-lg animate-pulse" />
          </div>
          <div className="mt-6 flex justify-center">
            <div className="w-full sm:w-auto min-w-[220px] h-[52px] bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <div className="h-6 w-32 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-6 w-36 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-6 w-40 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state if routes failed to load
  if (routes.length === 0 && error) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-6 notranslate ${className}`} translate="no">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={retryLoadRoutes}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-xl overflow-visible notranslate ${className}`}
      translate="no"
    >
      {/* Title */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 rounded-t-2xl">
        <h2 className="text-white font-bold text-lg text-center">Get an Instant Quote</h2>
      </div>

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
              enforceMinimumAdvance={true}
            />
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              <span className="text-amber-600">*</span>
              Last-minute booking? <a href="https://wa.me/50685962438" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Contact us via WhatsApp</a>
            </p>
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
            className={`w-full sm:w-auto min-w-[220px] py-3.5 px-10 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg text-base ${
              availabilityStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-xl'
            }`}
          >
            {availabilityStatus === 'checking' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Preparing your quote...
              </>
            ) : availabilityStatus === 'approved' ? (
              <>
                <CheckCircle className="h-5 w-5" />
                Quote ready!
              </>
            ) : isSubmitting ? (
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

        {/* Info Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-gray-800 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Max 12 per van with luggage
          </span>
          <span className="text-xs text-gray-800 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Custom routes available
          </span>
          <span className="text-xs text-gray-800 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Multidestination booking
          </span>
        </div>
      </div>
    </form>
  );
}
