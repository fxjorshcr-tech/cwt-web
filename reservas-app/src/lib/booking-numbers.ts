// src/lib/booking-numbers.ts
// Sistema de generación de Booking Numbers y Vouchers
// Formato: CWT-2025-000100 (Booking) / CWT-2025-000100-S01 (Shuttle) / CWT-2025-000100-T01 (Tour)

import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Genera un nuevo booking number usando la secuencia de Supabase
 * Formato: CWT-2025-000100
 */
export async function generateBookingNumber(): Promise<string> {
  const { data, error } = await supabase.rpc('generate_booking_number');

  if (error) {
    console.error('[BookingNumbers] Error generating booking number:', error);
    // Fallback to timestamp-based ID if function fails
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `CWT-${year}-${timestamp}`;
  }

  return data as string;
}

/**
 * Genera un voucher para shuttle
 * Formato: CWT-2025-000100-S01
 */
export function generateShuttleVoucher(bookingNumber: string, index: number): string {
  return `${bookingNumber}-S${String(index).padStart(2, '0')}`;
}

/**
 * Genera un voucher para tour
 * Formato: CWT-2025-000100-T01
 */
export function generateTourVoucher(bookingNumber: string, index: number): string {
  return `${bookingNumber}-T${String(index).padStart(2, '0')}`;
}

/**
 * Asigna booking number y vouchers a los shuttles de un carrito
 */
export async function assignBookingToShuttles(
  bookingNumber: string,
  shuttleBookingIds: string[]
): Promise<void> {
  for (let i = 0; i < shuttleBookingIds.length; i++) {
    const voucherNumber = generateShuttleVoucher(bookingNumber, i + 1);

    const { error } = await supabase
      .from('trips')
      .update({
        booking_number: bookingNumber,
        voucher_number: voucherNumber,
      })
      .eq('booking_id', shuttleBookingIds[i]);

    if (error) {
      console.error(`[BookingNumbers] Error assigning voucher to shuttle ${shuttleBookingIds[i]}:`, error);
    }
  }
}

/**
 * Asigna booking number y vouchers a los tours de un carrito
 */
export async function assignBookingToTours(
  bookingNumber: string,
  tourIds: number[]
): Promise<void> {
  for (let i = 0; i < tourIds.length; i++) {
    const voucherNumber = generateTourVoucher(bookingNumber, i + 1);

    const { error } = await supabase
      .from('tour_bookings')
      .update({
        booking_number: bookingNumber,
        voucher_number: voucherNumber,
      })
      .eq('id', tourIds[i]);

    if (error) {
      console.error(`[BookingNumbers] Error assigning voucher to tour ${tourIds[i]}:`, error);
    }
  }
}

/**
 * Proceso completo: genera booking number y asigna vouchers a todos los items
 */
export async function assignBookingNumbersToCart(
  shuttleBookingIds: string[],
  tourIds: number[]
): Promise<string> {
  // Generar el booking number principal
  const bookingNumber = await generateBookingNumber();

  console.log('[BookingNumbers] Generated booking number:', bookingNumber);

  // Asignar a shuttles
  if (shuttleBookingIds.length > 0) {
    await assignBookingToShuttles(bookingNumber, shuttleBookingIds);
    console.log('[BookingNumbers] Assigned vouchers to', shuttleBookingIds.length, 'shuttles');
  }

  // Asignar a tours
  if (tourIds.length > 0) {
    await assignBookingToTours(bookingNumber, tourIds);
    console.log('[BookingNumbers] Assigned vouchers to', tourIds.length, 'tours');
  }

  return bookingNumber;
}
