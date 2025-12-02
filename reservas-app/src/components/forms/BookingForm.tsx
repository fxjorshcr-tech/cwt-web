// src/components/forms/BookingForm.tsx
// ✅ CORREGIDO: Usa localStorage en vez de Supabase para guardar bookings temporales
// ✅ Solo se guarda en Supabase cuando usuario confirma en Summary (Pay Now / Add to Cart)
// ✅ IMPROVED: Safe localStorage, sonner toast, mobile compatibility
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Loader2, AlertCircle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import {
  TripCard,
  LargeGroupNotice,
  FormInfoBanner,
  FormSkeleton,
} from './booking';
import {
  type Route,
  type TripData,
  loadRoutesFromSupabase,
  applyUrlParamsToTrip,
  updateTripInArray,
  validateTrips,
  generateBookingId,
  createBookingData,
} from '@/utils/bookingFormHelpers';
import { saveBookingToLocalStorage, isLocalStorageAvailable } from '@/utils/localStorageHelpers';

export function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [trips, setTrips] = useState<TripData[]>([
    {
      from_location: '',
      to_location: '',
      date: '',
      adults: 1,
      children: 0,
      calculatedPrice: 0,
      selectedRoute: null,
    },
  ]);

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    if (routes.length > 0) {
      // ✅ Added null safety for searchParams
      const from = searchParams?.get('from');
      const to = searchParams?.get('to');
      const origin = searchParams?.get('origin');
      const destination = searchParams?.get('destination');

      const fromLocation = from || origin;
      const toLocation = to || destination;

      if (fromLocation || toLocation) {
        setTrips((prevTrips) => {
          const newTrips = [...prevTrips];
          newTrips[0] = applyUrlParamsToTrip(newTrips[0], fromLocation, toLocation, routes);
          return newTrips;
        });

        // ✅ FIXED: Safe window access
        if (typeof window !== 'undefined' && window.history && window.location) {
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [routes, searchParams]);

  // ✅ Load routes from Supabase
  async function loadRoutes() {
    setIsLoadingRoutes(true);
    setError(null);

    const supabase = createClient();
    const { routes: loadedRoutes, error: loadError } = await loadRoutesFromSupabase(supabase);

    if (loadError) {
      setError(loadError);
      setShowContent(true);
      setIsLoadingRoutes(false);
      return;
    }

    if (loadedRoutes) {
      setRoutes(loadedRoutes);
      setShowContent(true);
    }

    setIsLoadingRoutes(false);
  }

  function updateTrip(index: number, field: string, value: any) {
    setTrips((prevTrips) => updateTripInArray(prevTrips, index, field, value, routes));
  }

  function addTrip() {
    // ✅ FIXED: Check if trips array has elements before accessing
    if (!trips || trips.length === 0) {
      setTrips([{
        from_location: '',
        to_location: '',
        date: '',
        adults: 1,
        children: 0,
        calculatedPrice: 0,
        selectedRoute: null,
      }]);
      return;
    }

    const lastTrip = trips[trips.length - 1];

    setTrips([
      ...trips,
      {
        from_location: lastTrip?.to_location || '',
        to_location: '',
        date: lastTrip?.date || '',
        adults: lastTrip?.adults || 1,
        children: lastTrip?.children || 0,
        calculatedPrice: 0,
        selectedRoute: null,
      },
    ]);
  }

  function removeTrip(index: number) {
    if (trips.length > 1) {
      setTrips(trips.filter((_, i) => i !== index));
    }
  }

  function validate(): string | null {
    return validateTrips(trips);
  }

  // Ref to track if component is mounted (for safe async operations)
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // ✅ FIXED: Check localStorage availability before proceeding
    if (!isLocalStorageAvailable()) {
      setError('Your browser settings are blocking this feature. Please enable cookies/localStorage or try a different browser.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const bookingId = generateBookingId();
      const bookingData = createBookingData(trips, bookingId);

      // ✅ FIXED: Use safe localStorage helper
      const saved = saveBookingToLocalStorage(bookingId, bookingData);
      if (!saved) {
        throw new Error('Unable to save booking. Please check your browser settings.');
      }

      // ✅ FIXED: Use sonner toast instead of DOM manipulation
      const toastId = toast.loading('Checking Availability...', {
        description: 'Please wait a moment',
      });

      await new Promise(resolve => setTimeout(resolve, 1400));

      // Check if still mounted before continuing
      if (!isMountedRef.current) {
        toast.dismiss(toastId);
        return;
      }

      // Update toast to success
      toast.success('Availability Approved!', {
        id: toastId,
        description: 'Redirecting to booking details...',
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if still mounted before continuing
      if (!isMountedRef.current) return;

      // Redirect to booking-details
      router.push(`/booking-details?booking_id=${bookingId}&trip=0`);

    } catch (error) {
      console.error('Booking error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error processing booking';

      toast.error('Failed to process booking', {
        description: errorMessage,
      });

      if (isMountedRef.current) {
        setError(errorMessage);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setIsSubmitting(false);
      }
    }
  }

  const hasLargeGroup = trips.some((trip) => trip.adults + trip.children > 12);

  if (isLoadingRoutes || !showContent) {
    return <FormSkeleton />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 animate-in fade-in duration-500">
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">Unable to process booking</p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {trips.map((trip, index) => (
              <TripCard
                key={index}
                trip={trip}
                index={index}
                totalTrips={trips.length}
                routes={routes}
                disabled={!!error}
                showRemove={trips.length > 1}
                onUpdate={(field, value) => updateTrip(index, field, value)}
                onRemove={() => removeTrip(index)}
              />
            ))}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={addTrip}
                className="py-3 px-6 min-h-[48px] border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                Add Another Trip
              </button>
            </div>

            <FormInfoBanner />
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            {hasLargeGroup && <LargeGroupNotice />}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !!error ||
                  hasLargeGroup ||
                  trips.some((t) => !t.selectedRoute || !t.date)
                }
                className="px-6 py-3 min-h-[48px] bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Search Transfers
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}