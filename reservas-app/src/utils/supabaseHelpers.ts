// src/utils/supabaseHelpers.ts
// ✅ Pure functions for Supabase operations
// NO state management - just data operations with retry logic

import { SupabaseClient } from '@supabase/supabase-js';

export interface TripForSupabase {
  booking_id: string;
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  price: number;
  distance: number;
  duration: string;
  pickup_address: string;
  pickup_instructions: string;
  dropoff_address: string;
  dropoff_instructions: string;
  pickup_time: string;
  arrival_time: string | null;
  flight_number: string | null;
  airline: string | null;
  special_requests: string | null;
  children_ages: number[] | null;
  add_ons: string[] | null;
  add_ons_price: number | null;
  night_surcharge: number | null;
  fees: number | null;
  final_price: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseTripResult {
  id: string;
  [key: string]: any;
}

/**
 * Check if trips already exist in Supabase for a booking
 * @param supabase - Supabase client
 * @param bookingId - The booking ID
 * @returns Array of trip IDs if they exist, empty array otherwise
 */
export async function checkExistingTrips(
  supabase: SupabaseClient,
  bookingId: string
): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('id')
      .eq('booking_id', bookingId);

    if (error) {
      console.error('Error checking existing trips:', error);
      return [];
    }

    return data ? data.map(trip => trip.id) : [];
  } catch (error) {
    console.error('Error in checkExistingTrips:', error);
    return [];
  }
}

/**
 * Load all trips from Supabase for a booking
 * @param supabase - Supabase client
 * @param bookingId - The booking ID
 * @returns Array of trips or null if error
 */
export async function loadTripsFromSupabase(
  supabase: SupabaseClient,
  bookingId: string
): Promise<SupabaseTripResult[] | null> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading trips from Supabase:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error in loadTripsFromSupabase:', error);
    return null;
  }
}

/**
 * Insert trips into Supabase with retry logic
 * @param supabase - Supabase client
 * @param trips - Array of trips to insert
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @returns Array of inserted trips with IDs or null if all retries failed
 */
export async function insertTripsWithRetry(
  supabase: SupabaseClient,
  trips: TripForSupabase[],
  maxRetries: number = 3
): Promise<SupabaseTripResult[] | null> {
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert(trips)
        .select();

      if (!error && data) {
        console.log(`Successfully inserted trips on attempt ${attempt + 1}`);
        return data;
      }

      lastError = error;

      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt + 1) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} - waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt + 1) * 1000;
        console.log(`Exception on attempt ${attempt + 1}, retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error('All retry attempts failed:', lastError);
  return null;
}

/**
 * Prepare trip data for Supabase insertion
 * @param trip - Trip data with all required fields
 * @returns Formatted trip data ready for Supabase
 */
export function prepareTripForSupabase(trip: {
  booking_id: string;
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  price: number;
  duration?: string | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  pickup_time: string;
  flight_number: string | null;
  airline: string | null;
  special_requests: string | null;
  children_ages: number[] | null;
  add_ons: string[] | null;
  add_ons_price: number | null;
  night_surcharge: number | null;
  final_price: number | null;
}): TripForSupabase {
  return {
    booking_id: trip.booking_id,
    from_location: trip.from_location,
    to_location: trip.to_location,
    date: trip.date,
    adults: trip.adults,
    children: trip.children,
    price: trip.price,
    distance: 0, // We don't use kilometers
    duration: trip.duration || '',
    pickup_address: trip.pickup_address || '',
    pickup_instructions: '', // Optional
    dropoff_address: trip.dropoff_address || '',
    dropoff_instructions: '', // Optional
    pickup_time: trip.pickup_time,
    arrival_time: null, // Calculated later if needed
    flight_number: trip.flight_number,
    airline: trip.airline,
    special_requests: trip.special_requests,
    children_ages: trip.children_ages,
    add_ons: trip.add_ons,
    add_ons_price: trip.add_ons_price,
    night_surcharge: trip.night_surcharge,
    fees: null, // Calculated in backend if needed
    final_price: trip.final_price || trip.price,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
