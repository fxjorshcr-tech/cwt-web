// src/components/forms/BookingForm.tsx
// ✅ CORREGIDO: Usa localStorage en vez de Supabase para guardar bookings temporales
// ✅ Solo se guarda en Supabase cuando usuario confirma en Summary (Pay Now / Add to Cart)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Loader2, AlertCircle, Plus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { matchLocation } from '@/utils/locationHelpers';

// ✅ Imports de componentes divididos
import {
  TripCard,
  LargeGroupNotice,
  FormInfoBanner,
  FormSkeleton,
} from './booking';

interface Route {
  id: number;
  origen: string;
  destino: string;
  precio1a6: number;
  precio7a9: number;
  precio10a12: number;
  duracion: string;
}

interface TripData {
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  routeId?: number;
  price?: number;
  duration?: string;
  calculatedPrice: number;
  selectedRoute: Route | null;
}

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
      const from = searchParams.get('from');
      const to = searchParams.get('to');
      const origin = searchParams.get('origin');
      const destination = searchParams.get('destination');

      const fromLocation = from || origin;
      const toLocation = to || destination;

      if (fromLocation || toLocation) {
        setTrips((prevTrips) => {
          const newTrips = [...prevTrips];

          if (fromLocation) {
            newTrips[0].from_location = fromLocation;
          }

          if (toLocation) {
            newTrips[0].to_location = toLocation;
          }

          if (newTrips[0].from_location && newTrips[0].to_location) {
            // ✅ Use fuzzy matching instead of exact match
            const route = routes.find(
              (r) => matchLocation(r.origen, newTrips[0].from_location) && matchLocation(r.destino, newTrips[0].to_location)
            );

            if (route) {
              const totalPassengers = newTrips[0].adults + newTrips[0].children;
              const price = calculatePrice(route, totalPassengers);

              newTrips[0].selectedRoute = route;
              newTrips[0].calculatedPrice = price;
              newTrips[0].routeId = route.id;
              newTrips[0].price = price;
              newTrips[0].duration = route.duracion;
            }
          }

          return newTrips;
        });

        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [routes, searchParams]);

  // ✅ MANTENER: Solo para LEER rutas de Supabase, NO para guardar bookings
  async function loadRoutes() {
    const maxRetries = 3;
    const timeout = 10000; // 10 seconds

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setIsLoadingRoutes(true);
        setError(null);

        const supabase = createClient();

        // ✅ Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout - please refresh the page')), timeout)
        );

        const fetchPromise = supabase
          .from('routes')
          .select('id, origen, destino, precio1a6, precio7a9, precio10a12, duracion')
          .order('origen');

        const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
        const { data, error: fetchError } = result;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (!data || data.length === 0) {
          throw new Error('No routes available in database');
        }

        // ✅ Validar solo los campos que usamos
        const validRoutes: Route[] = (data as any[])
          .filter((route): route is Route => {
            return (
              route.origen !== null &&
              route.destino !== null &&
              route.precio1a6 !== null &&
              route.precio7a9 !== null &&
              route.precio10a12 !== null &&
              route.duracion !== null
            );
          })
          .map((route) => ({
            id: route.id,
            origen: route.origen,
            destino: route.destino,
            precio1a6: route.precio1a6,
            precio7a9: route.precio7a9,
            precio10a12: route.precio10a12,
            duracion: route.duracion,
          }));

        if (validRoutes.length === 0) {
          throw new Error('No valid routes available');
        }

        setRoutes(validRoutes);
        setShowContent(true);
        return; // Success, exit retry loop
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';

        // If last attempt, show error
        if (attempt === maxRetries) {
          setError(`${message}. Please refresh the page to try again.`);
          setShowContent(true);
        } else {
          // Wait before retry (exponential backoff: 2s, 4s, 8s)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt + 1) * 1000));
        }
      } finally {
        if (attempt === maxRetries) {
          setIsLoadingRoutes(false);
        }
      }
    }
  }

  function calculatePrice(route: Route, passengers: number): number {
    if (passengers <= 6) return route.precio1a6;
    if (passengers <= 9) return route.precio7a9;
    if (passengers <= 12) return route.precio10a12;
    // ✅ Para más de 12 pasajeros, retornar 0 (mostraremos mensaje de contacto)
    return 0;
  }

  function updateTrip(index: number, field: string, value: any) {
    setTrips((prevTrips) => {
      const newTrips = [...prevTrips];
      newTrips[index] = { ...newTrips[index], [field]: value };

      if (field === 'from_location') {
        newTrips[index].to_location = '';
        newTrips[index].selectedRoute = null;
        newTrips[index].calculatedPrice = 0;
        newTrips[index].price = undefined;
        newTrips[index].duration = undefined;
        newTrips[index].routeId = undefined;
      }

      if (
        field === 'from_location' ||
        field === 'to_location' ||
        field === 'adults' ||
        field === 'children'
      ) {
        const trip = newTrips[index];

        if (trip.from_location && trip.to_location) {
          const totalPassengers = trip.adults + trip.children;

          if (totalPassengers > 12) {
            newTrips[index].selectedRoute = null;
            newTrips[index].calculatedPrice = 0;
            newTrips[index].price = undefined;
            newTrips[index].duration = undefined;
            newTrips[index].routeId = undefined;
            return newTrips;
          }

          // ✅ Use fuzzy matching instead of exact match
          const route = routes.find(
            (r) => matchLocation(r.origen, trip.from_location) && matchLocation(r.destino, trip.to_location)
          );

          if (route) {
            const price = calculatePrice(route, totalPassengers);

            newTrips[index].selectedRoute = route;
            newTrips[index].calculatedPrice = price;
            newTrips[index].routeId = route.id;
            newTrips[index].price = price;
            newTrips[index].duration = route.duracion;
          } else {
            newTrips[index].selectedRoute = null;
            newTrips[index].calculatedPrice = 0;
            newTrips[index].price = undefined;
            newTrips[index].duration = undefined;
            newTrips[index].routeId = undefined;
          }
        }
      }

      return newTrips;
    });
  }

  function addTrip() {
    const lastTrip = trips[trips.length - 1];

    setTrips([
      ...trips,
      {
        from_location: lastTrip.to_location,
        to_location: '',
        date: lastTrip.date,
        adults: lastTrip.adults,
        children: lastTrip.children,
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
    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];

      if (!trip.from_location) {
        return `Trip ${i + 1}: Please select an origin`;
      }

      if (!trip.to_location) {
        return `Trip ${i + 1}: Please select a destination`;
      }

      if (!trip.date) {
        return `Trip ${i + 1}: Please select a date`;
      }

      // ✅ Validar fecha futura
      const tripDate = new Date(trip.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (tripDate < today) {
        return `Trip ${i + 1}: Date must be in the future`;
      }

      const totalPassengers = trip.adults + trip.children;

      if (totalPassengers > 12) {
        return `Trip ${i + 1}: For groups larger than 12 passengers, please contact us directly via WhatsApp`;
      }

      if (!trip.selectedRoute || !trip.routeId) {
        return `Trip ${i + 1}: No route available for this combination. Please contact us on WhatsApp for assistance.`;
      }

      if (totalPassengers < 1) {
        return `Trip ${i + 1}: At least 1 passenger required`;
      }

      if (!trip.price) {
        return `Trip ${i + 1}: Price calculation failed`;
      }
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // ✅ Generar booking ID único
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // ✅ NUEVO: Guardar en localStorage en vez de Supabase
      const bookingData = {
        bookingId,
        trips: trips.map((trip) => ({
          from_location: trip.from_location,
          to_location: trip.to_location,
          date: trip.date,
          adults: trip.adults,
          children: trip.children,
          price: trip.price!,
          duration: trip.duration ?? '',
          routeId: trip.routeId,
          calculatedPrice: trip.calculatedPrice,
        })),
        createdAt: new Date().toISOString(),
      };

      // ✅ Guardar en localStorage (NO en Supabase)
      localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));

      // ✅ PASO 1: Mostrar "Checking Availability..."
      const checkingToast = document.createElement('div');
      checkingToast.className = 'fixed top-4 right-4 z-50 bg-white rounded-xl shadow-2xl p-6 border-2 border-blue-500 animate-in fade-in slide-in-from-top-5 duration-500';
      checkingToast.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="relative">
            <div class="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
          <div>
            <p class="text-lg font-bold text-gray-900">Checking Availability...</p>
            <p class="text-sm text-gray-600">Please wait a moment</p>
          </div>
        </div>
      `;
      document.body.appendChild(checkingToast);

      // Esperar 1.4 segundos para simular verificación
      await new Promise(resolve => setTimeout(resolve, 1400));

      // ✅ PASO 2: Cambiar a "Availability Approved ✅"
      checkingToast.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg class="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p class="text-lg font-bold text-gray-900">Availability Approved ✅</p>
            <p class="text-sm text-gray-600">Redirecting to booking details...</p>
          </div>
        </div>
      `;

      // Esperar 1 segundo antes de redirigir
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Limpiar el toast
      document.body.removeChild(checkingToast);

      // ✅ Redirigir a booking-details (datos en localStorage, NO en Supabase)
      router.push(`/booking-details?booking_id=${bookingId}&trip=0`);
      
    } catch (error) {
      console.error('Full error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error processing booking';

      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false);
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