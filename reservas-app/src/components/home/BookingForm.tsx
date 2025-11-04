// src/components/home/BookingForm.tsx
// OPTIMIZED: Shows form immediately, loads routes in background

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
  Route as RouteIcon,
  Plus,
  X,
  ChevronDown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ModernDatePicker } from './ModernDatePicker';
import { PassengerSelector } from './PassengerSelector';
import { format } from 'date-fns';
import type { TripInsert, Route as SupabaseRoute } from '@/types/supabase';

interface Route {
  id: number;
  origen: string;
  destino: string;
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

export function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ========== Estados principales ==========
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========== Estados del formulario ==========
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

  /**
   * ==========================================
   * EFECTO: CARGAR RUTAS AL MONTAR
   * ==========================================
   */
  useEffect(() => {
    loadRoutes();
  }, []);

  /**
   * ==========================================
   * EFECTO: PRE-CARGAR DESDE URL PARAMETERS
   * ==========================================
   */
  useEffect(() => {
    if (routes.length > 0) {
      const origin = searchParams.get('origin');
      const destination = searchParams.get('destination');

      if (origin || destination) {
        console.log('🎯 Preloading from URL:', { origin, destination });
        
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

              console.log('✅ Route preloaded successfully');
            }
          }

          return newTrips;
        });

        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [routes, searchParams]);

  async function loadRoutes() {
    console.log('🔄 Loading routes from Supabase...');

    try {
      setIsLoadingRoutes(true);
      setError(null);

      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('routes')
        .select('*')
        .order('origen');

      if (fetchError) {
        console.error('❌ Supabase Error:', fetchError);
        throw new Error(fetchError.message);
      }

      if (!data || data.length === 0) {
        throw new Error('No routes available in database');
      }

      // ✅ FIX: Filtrar y mapear correctamente
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

      const invalidCount = data.length - validRoutes.length;
      if (invalidCount > 0) {
        console.warn(
          `⚠️ Found ${invalidCount} routes with incomplete data (ignored)`
        );
      }

      console.log(
        `✅ Valid routes loaded: ${validRoutes.length} of ${data.length}`
      );
      setRoutes(validRoutes);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('💥 Error loading routes:', message);
      setError(message);
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

  function getOrigins(): string[] {
    const origins = routes.map((r) => r.origen);
    return Array.from(new Set(origins)).sort();
  }

  function getDestinations(origin?: string): string[] {
    if (!origin) {
      const destinations = routes.map((r) => r.destino);
      return Array.from(new Set(destinations)).sort();
    }

    const destinations = routes
      .filter((r) => r.origen === origin)
      .map((r) => r.destino);

    return Array.from(new Set(destinations)).sort();
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
      }

      if (
        field === 'from_location' ||
        field === 'to_location' ||
        field === 'adults' ||
        field === 'children'
      ) {
        const trip = newTrips[index];

        if (trip.from_location && trip.to_location) {
          const route = routes.find(
            (r) =>
              r.origen === trip.from_location && r.destino === trip.to_location
          );

          if (route) {
            const totalPassengers = trip.adults + trip.children;
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

      if (!trip.selectedRoute) {
        return `Trip ${i + 1}: No route available for this combination`;
      }

      const totalPassengers = trip.adults + trip.children;

      if (totalPassengers < 1) {
        return `Trip ${i + 1}: At least 1 passenger required`;
      }

      if (totalPassengers > 18) {
        return `Trip ${i + 1}: Maximum 18 passengers per trip`;
      }
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const bookingId = `booking_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      console.log('💾 Saving trips to Supabase with booking_id:', bookingId);

      const tripsToInsert: TripInsert[] = trips.map((trip) => ({
        booking_id: bookingId,
        from_location: trip.from_location,
        to_location: trip.to_location,
        date: trip.date,
        adults: trip.adults,
        children: trip.children,
        price: trip.price!,
        distance: trip.distance ?? null,
        duration: trip.duration ?? null,
        pickup_address: null,
        pickup_instructions: null,
        dropoff_address: null,
        dropoff_instructions: null,
        pickup_time: null,
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

      console.log('📦 Data to insert:', tripsToInsert);

      const { data, error } = await supabase
        .from('trips')
        .insert(tripsToInsert)
        .select();

      if (error) {
        console.error('❌ Error saving to Supabase:', error);
        throw new Error(`Save error: ${error.message}`);
      }

      console.log('✅ Trips saved successfully:', data);
      console.log('🚀 Navigating to booking-details...');
      router.push(`/booking-details?booking_id=${bookingId}&trip=0`);
    } catch (error) {
      console.error('💥 Complete error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error processing booking';

      alert(
        `❌ ${errorMessage}\n\nPlease check your data and try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalPrice = trips.reduce(
    (sum, trip) => sum + trip.calculatedPrice,
    0
  );

  /**
   * ==========================================
   * RENDER: MAIN FORM (ALWAYS VISIBLE)
   * ==========================================
   */
  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              PRIVATE SHUTTLES
            </h2>
            <p className="text-gray-600 text-center text-sm mt-1">
              Powered by Costarican expertise
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-4">
            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">Unable to load routes</p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={loadRoutes}
                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </button>
              </div>
            )}

            {/* Trips List */}
            {trips.map((trip, index) => (
              <div key={index} className="space-y-3">
                {/* Trip Card */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  {/* Trip Header */}
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
                        className="h-7 w-7 rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center"
                        aria-label={`Remove trip ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Location Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                    {/* Origin */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                        Pick-up Location
                      </label>
                      <select
                        value={trip.from_location}
                        onChange={(e) =>
                          updateTrip(index, 'from_location', e.target.value)
                        }
                        disabled={isLoadingRoutes || !!error}
                        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="">
                          {isLoadingRoutes
                            ? 'Loading routes...'
                            : error
                            ? 'Error loading routes'
                            : 'Where are you traveling from?'}
                        </option>
                        {!isLoadingRoutes && !error && getOrigins().map((origin) => (
                          <option key={origin} value={origin}>
                            {origin}
                          </option>
                        ))}
                      </select>
                      {isLoadingRoutes && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Loading available locations...</span>
                        </div>
                      )}
                    </div>

                    {/* Destination */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                        <MapPin className="h-3.5 w-3.5 text-orange-600" />
                        Drop-off Location
                      </label>
                      <select
                        value={trip.to_location}
                        onChange={(e) =>
                          updateTrip(index, 'to_location', e.target.value)
                        }
                        disabled={!trip.from_location || isLoadingRoutes || !!error}
                        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="">
                          {isLoadingRoutes
                            ? 'Loading routes...'
                            : error
                            ? 'Error loading routes'
                            : !trip.from_location
                            ? 'Select origin first'
                            : 'Where are you going?'}
                        </option>
                        {!isLoadingRoutes && !error && getDestinations(trip.from_location).map(
                          (destination) => (
                            <option key={destination} value={destination}>
                              {destination}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Date and Passengers */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <ModernDatePicker
                      value={trip.date ? new Date(trip.date) : null}
                      onChange={(date) =>
                        updateTrip(index, 'date', format(date, 'yyyy-MM-dd'))
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

                  {/* Route Details */}
                  {trip.selectedRoute && (
                    <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
                      <div className="grid grid-cols-3 gap-2">
                        {/* Price */}
                        <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-xl font-bold text-blue-600">
                            ${trip.calculatedPrice}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">Price</p>
                        </div>

                        {/* Duration */}
                        <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-300">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-orange-500" />
                            <p className="text-base font-bold text-gray-900">
                              {trip.selectedRoute.duracion}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Duration
                          </p>
                        </div>

                        {/* Distance */}
                        <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center gap-1">
                            <RouteIcon className="h-3.5 w-3.5 text-gray-600" />
                            <p className="text-base font-bold text-gray-900">
                              {trip.selectedRoute.kilometros}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">KM</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Separator between trips */}
                {index < trips.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Add Another Trip Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addTrip}
                disabled={isLoadingRoutes}
                className="py-2 px-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add Another Trip
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Total */}
              {totalPrice > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${totalPrice}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  isSubmitting || 
                  isLoadingRoutes || 
                  !!error ||
                  trips.some((t) => !t.selectedRoute || !t.date)
                }
                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
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