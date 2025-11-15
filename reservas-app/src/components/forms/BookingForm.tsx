// src/components/home/BookingForm.tsx
// ✅ FIXED: Soluciona "TypeError: Load Failed" en handleSubmit
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  Users,
  Search,
  Loader2,
  AlertCircle,
  Clock,
  Route as RouteIcon,
  Plus,
  X,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ModernDatePicker } from './ModernDatePicker';
import { PassengerSelector } from './PassengerSelector';
import { LocationAutocomplete } from './LocationAutocomplete';
import { formatDateToString, parseDateFromString } from '@/utils/timeHelpers';
import type { TripInsert, Route as SupabaseRoute } from '@/types/supabase';

interface Route {
  id: number;
  origen: string;
  destino: string;
  alias: string | null;
  precio1a6: number;
  precio7a9: number;
  precio10a12: number;
  precio13a18: number;
  kilometros: number;
  duracion: string;
}

export interface BookingFormData {
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  routeId?: number;
  price?: number;
  distance?: number;
  duration?: string;
}

interface TripData extends BookingFormData {
  calculatedPrice: number;
  selectedRoute: Route | null;
}

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
      const origin = searchParams.get('origin');
      const destination = searchParams.get('destination');

      if (origin || destination) {
        setTrips((prevTrips) => {
          const newTrips = [...prevTrips];
          
          if (origin) {
            newTrips[0].from_location = origin;
          }
          
          if (destination) {
            newTrips[0].to_location = destination;
          }

          if (newTrips[0].from_location && newTrips[0].to_location) {
            const route = routes.find(
              (r) =>
                r.origen === newTrips[0].from_location && 
                r.destino === newTrips[0].to_location
            );

            if (route) {
              const totalPassengers = newTrips[0].adults + newTrips[0].children;
              const price = calculatePrice(route, totalPassengers);

              newTrips[0].selectedRoute = route;
              newTrips[0].calculatedPrice = price;
              newTrips[0].routeId = route.id;
              newTrips[0].price = price;
              newTrips[0].distance = route.kilometros;
              newTrips[0].duration = route.duracion;
            }
          }

          return newTrips;
        });

        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [routes, searchParams]);

  async function loadRoutes() {
    try {
      setIsLoadingRoutes(true);
      setShowContent(false);
      setError(null);

      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('routes')
        .select('*')
        .order('origen');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!data || data.length === 0) {
        throw new Error('No routes available in database');
      }

      const validRoutes: Route[] = (data as SupabaseRoute[])
        .filter((route): route is SupabaseRoute & {
          origen: string;
          destino: string;
          precio1a6: number;
          precio7a9: number;
          precio10a12: number;
          precio13a18: number;
          kilometros: number;
          duracion: string;
        } => {
          return (
            route.origen !== null &&
            route.destino !== null &&
            route.precio1a6 !== null &&
            route.precio7a9 !== null &&
            route.precio10a12 !== null &&
            route.precio13a18 !== null &&
            route.kilometros !== null &&
            route.duracion !== null
          );
        })
        .map(route => ({
          id: route.id,
          origen: route.origen,
          destino: route.destino,
          alias: route.alias,
          precio1a6: route.precio1a6,
          precio7a9: route.precio7a9,
          precio10a12: route.precio10a12,
          precio13a18: route.precio13a18,
          kilometros: route.kilometros,
          duracion: route.duracion,
        }));

      if (validRoutes.length === 0) {
        throw new Error('No valid routes available');
      }

      setRoutes(validRoutes);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      setShowContent(true);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setShowContent(true);
    } finally {
      setIsLoadingRoutes(false);
    }
  }

  function calculatePrice(route: Route, passengers: number): number {
    if (passengers <= 6) return route.precio1a6;
    if (passengers <= 9) return route.precio7a9;
    if (passengers <= 12) return route.precio10a12;
    return route.precio13a18;
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
        newTrips[index].distance = undefined;
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
            newTrips[index].distance = undefined;
            newTrips[index].duration = undefined;
            newTrips[index].routeId = undefined;
            return newTrips;
          }

          const route = routes.find(
            (r) =>
              r.origen === trip.from_location && r.destino === trip.to_location
          );

          if (route) {
            const price = calculatePrice(route, totalPassengers);

            newTrips[index].selectedRoute = route;
            newTrips[index].calculatedPrice = price;
            newTrips[index].routeId = route.id;
            newTrips[index].price = price;
            newTrips[index].distance = route.kilometros;
            newTrips[index].duration = route.duracion;
          } else {
            newTrips[index].selectedRoute = null;
            newTrips[index].calculatedPrice = 0;
            newTrips[index].price = undefined;
            newTrips[index].distance = undefined;
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

      const totalPassengers = trip.adults + trip.children;

      if (totalPassengers > 12) {
        return `Trip ${i + 1}: For groups larger than 12 passengers, please contact us directly`;
      }

      if (!trip.selectedRoute || !trip.routeId) {
        return `Trip ${i + 1}: No route available for this combination`;
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

  // ✅ FIXED: Función handleSubmit corregida
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
      const supabase = createClient();

      const bookingId = `booking_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // ✅ FIXED: Valores por defecto en lugar de null
      const tripsToInsert: TripInsert[] = trips.map((trip) => ({
        booking_id: bookingId,
        from_location: trip.from_location,
        to_location: trip.to_location,
        date: trip.date,
        adults: trip.adults,
        children: trip.children,
        price: trip.price!,
        distance: trip.distance ?? 0,           // ✅ 0 en lugar de null
        duration: trip.duration ?? '',          // ✅ '' en lugar de null
        pickup_address: '',                     // ✅ '' en lugar de null
        pickup_instructions: '',                // ✅ '' en lugar de null
        dropoff_address: '',                    // ✅ '' en lugar de null
        dropoff_instructions: '',               // ✅ '' en lugar de null
        pickup_time: null,                      // ✅ '' en lugar de null
        arrival_time: null,
        flight_number: null,
        airline: null,
        special_requests: null,
        night_surcharge: null,
        fees: null,
        final_price: trip.price!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      console.log('Inserting trips:', tripsToInsert); // ✅ Para debug

      const { data, error } = await supabase
        .from('trips')
        .insert(tripsToInsert)
        .select();

      if (error) {
        console.error('Supabase error:', error); // ✅ Log completo del error
        throw new Error(`Save error: ${error.message}`);
      }

      console.log('Insert successful:', data); // ✅ Confirmar éxito

      router.push(`/booking-details?booking_id=${bookingId}&trip=0`);
      
    } catch (error) {
      console.error('Full error:', error); // ✅ Log completo
      
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error processing booking';

      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false);
    }
  }

  const hasLargeGroup = trips.some(trip => (trip.adults + trip.children) > 12);

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
              <div key={index} className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  
                  {index === 0 && trips.length === 1 ? (
                    <div className="mb-4">
                      <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 px-5 py-4 rounded-xl border border-blue-200">
                        <h3 className="text-lg font-bold text-gray-900 text-center">
                          Private Shuttle Booking Form
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            Trip {index + 1}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {trip.selectedRoute
                              ? 'Route selected'
                              : 'Configure your trip'}
                          </p>
                        </div>
                      </div>
                      {trips.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTrip(index)}
                          className="h-9 w-9 rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                    <LocationAutocomplete
                      label="Pick-up Location"
                      placeholder="Where are you traveling from?"
                      value={trip.from_location}
                      onChange={(value) => updateTrip(index, 'from_location', value)}
                      routes={routes}
                      filterByDestination={trip.to_location}
                      disabled={!!error}
                      type="origin"
                    />

                    <LocationAutocomplete
                      label="Drop-off Location"
                      placeholder={!trip.from_location ? 'Select origin first' : 'Where are you going?'}
                      value={trip.to_location}
                      onChange={(value) => updateTrip(index, 'to_location', value)}
                      routes={routes}
                      filterByOrigin={trip.from_location}
                      disabled={!trip.from_location || !!error}
                      type="destination"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <ModernDatePicker
                      value={trip.date ? parseDateFromString(trip.date) : null}
                      onChange={(date) =>
                        updateTrip(index, 'date', formatDateToString(date))
                      }
                      label="Travel Date"
                    />

                    <PassengerSelector
                      adults={trip.adults}
                      children={trip.children}
                      onPassengersChange={(adults, children) => {
                        updateTrip(index, 'adults', adults);
                        updateTrip(index, 'children', children);
                      }}
                      label="Passengers"
                    />
                  </div>

                  {trip.selectedRoute && (
                    <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-xl font-bold text-blue-600">
                            ${trip.calculatedPrice}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">Price</p>
                        </div>

                        <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-300">
                          <div className="flex flex-col items-center justify-center gap-0.5">
                            <Clock className="h-3.5 w-3.5 text-orange-500" />
                            <p className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                              {trip.selectedRoute.duracion}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Duration
                          </p>
                        </div>

                        <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex flex-col items-center justify-center gap-0.5">
                            <RouteIcon className="h-3.5 w-3.5 text-gray-600" />
                            <p className="text-sm sm:text-base font-bold text-gray-900">
                              {trip.selectedRoute.kilometros}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">KM</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {index < trips.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
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

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-gray-900">Up to 12 passengers</span> with one large suitcase per person
                </p>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900">Can't find your route?</span>
                  {' '}
                  <a 
                    href="https://wa.me/50685962438" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-semibold hover:underline transition-all"
                  >
                    Contact us on WhatsApp
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            
            {hasLargeGroup && (
              <div className="mb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-5 shadow-lg animate-in fade-in duration-300">
                <div className="flex items-start gap-4">
                  <MessageSquare className="h-7 w-7 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-base font-bold text-blue-900 mb-2">
                      🎉 Large Group? We'd Love to Help!
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      For groups of <strong>13 or more passengers</strong>, please contact us for a custom quote 
                      to ensure the best service and pricing.
                    </p>
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-xl"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Request Custom Quote
                    </a>
                  </div>
                </div>
              </div>
            )}

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