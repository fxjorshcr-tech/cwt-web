// src/utils/bookingFormHelpers.ts
// ✅ Pure helper functions for BookingForm component

import { SupabaseClient } from '@supabase/supabase-js';

export interface Route {
  id: number;
  origen: string;
  destino: string;
  precio1a6: number;
  precio7a9: number;
  precio10a12: number;
  duracion: string;
}

export interface TripData {
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

/**
 * Calculate price based on route and passenger count
 * ✅ FIXED: Handle null route and undefined prices
 */
export function calculateTripPrice(route: Route | null | undefined, passengers: number): number {
  // ✅ FIXED: Handle null/undefined route
  if (!route) return 0;
  if (passengers > 12 || passengers < 1) return 0;

  // ✅ FIXED: Use nullish coalescing to handle undefined prices
  if (passengers <= 6) return route.precio1a6 ?? 0;
  if (passengers <= 9) return route.precio7a9 ?? 0;
  if (passengers <= 12) return route.precio10a12 ?? 0;
  return 0;
}

/**
 * Update a trip in the trips array
 */
export function updateTripInArray(
  trips: TripData[],
  index: number,
  field: string,
  value: any,
  routes: Route[]
): TripData[] {
  const newTrips = [...trips];
  newTrips[index] = { ...newTrips[index], [field]: value };

  // Reset dependent fields when origin changes
  if (field === 'from_location') {
    newTrips[index].to_location = '';
    newTrips[index].selectedRoute = null;
    newTrips[index].calculatedPrice = 0;
    newTrips[index].price = undefined;
    newTrips[index].duration = undefined;
    newTrips[index].routeId = undefined;
  }

  // Recalculate route and price when relevant fields change
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

      const route = routes.find(
        (r) => r.origen === trip.from_location && r.destino === trip.to_location
      );

      if (route) {
        const price = calculateTripPrice(route, totalPassengers);

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
}

/**
 * Validate all trips before submission
 */
export function validateTrips(trips: TripData[]): string | null {
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

    // Validate future date
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

/**
 * Create booking data object for localStorage
 */
export function createBookingData(trips: TripData[], bookingId: string) {
  return {
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
}

/**
 * Generate unique booking ID
 */
export function generateBookingId(): string {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load routes from Supabase with pagination to get ALL routes
 */
export async function loadRoutesFromSupabase(
  supabase: SupabaseClient,
  maxRetries: number = 3,
  timeout: number = 15000
): Promise<{ routes: Route[] | null; error: string | null }> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const allRoutes: Route[] = [];
      const pageSize = 1000;
      let page = 0;
      let hasMore = true;

      // Load routes in batches of 1000 until we get all of them
      while (hasMore) {
        const from = page * pageSize;
        const to = from + pageSize - 1;

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout - please refresh the page')), timeout)
        );

        const fetchPromise = supabase
          .from('routes')
          .select('id, origen, destino, precio1a6, precio7a9, precio10a12, duracion')
          .order('origen')
          .range(from, to);

        const result = (await Promise.race([fetchPromise, timeoutPromise])) as any;
        const { data, error: fetchError } = result;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (!data || data.length === 0) {
          hasMore = false;
        } else {
          // Filter and map valid routes
          const validBatch = (data as any[])
            .filter((route) => route.origen !== null && route.destino !== null)
            .map((route) => ({
              id: route.id,
              origen: route.origen,
              destino: route.destino,
              precio1a6: route.precio1a6 ?? 0,
              precio7a9: route.precio7a9 ?? 0,
              precio10a12: route.precio10a12 ?? 0,
              duracion: route.duracion ?? '',
            }));

          allRoutes.push(...validBatch);

          // If we got less than pageSize, we've reached the end
          if (data.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }

      if (allRoutes.length === 0) {
        throw new Error('No routes available in database');
      }

      console.log(`Loaded ${allRoutes.length} routes from Supabase`);
      return { routes: allRoutes, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';

      if (attempt === maxRetries) {
        return { routes: null, error: `${message}. Please refresh the page to try again.` };
      }

      // Wait before retry (exponential backoff: 2s, 4s, 8s)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt + 1) * 1000));
    }
  }

  return { routes: null, error: 'Failed to load routes after retries' };
}

/**
 * Apply URL params to first trip
 */
export function applyUrlParamsToTrip(
  trip: TripData,
  fromLocation: string | null,
  toLocation: string | null,
  routes: Route[]
): TripData {
  const updatedTrip = { ...trip };

  if (fromLocation) {
    updatedTrip.from_location = fromLocation;
  }

  if (toLocation) {
    updatedTrip.to_location = toLocation;
  }

  if (updatedTrip.from_location && updatedTrip.to_location) {
    const route = routes.find(
      (r) => r.origen === updatedTrip.from_location && r.destino === updatedTrip.to_location
    );

    if (route) {
      const totalPassengers = updatedTrip.adults + updatedTrip.children;
      const price = calculateTripPrice(route, totalPassengers);

      updatedTrip.selectedRoute = route;
      updatedTrip.calculatedPrice = price;
      updatedTrip.routeId = route.id;
      updatedTrip.price = price;
      updatedTrip.duration = route.duracion;
    }
  }

  return updatedTrip;
}
