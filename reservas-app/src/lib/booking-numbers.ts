// src/lib/booking-numbers.ts
// Sistema de generación de Booking Numbers y Vouchers
// Formato: CWT-2025-100 (Booking) / CWT-2025-100-S1 (Shuttle) / CWT-2025-100-T1 (Tour)

import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Formatea un booking number al formato corto (sin ceros a la izquierda)
 * CWT-2025-000100 -> CWT-2025-100
 */
export function formatBookingNumberShort(bookingNumber: string): string {
  // Si ya tiene formato corto, retornarlo
  if (!bookingNumber.includes('-')) return bookingNumber;

  const parts = bookingNumber.split('-');
  if (parts.length !== 3) return bookingNumber;

  // Remover ceros a la izquierda del número secuencial
  const sequentialNumber = parseInt(parts[2], 10);
  if (isNaN(sequentialNumber)) return bookingNumber;

  return `${parts[0]}-${parts[1]}-${sequentialNumber}`;
}

/**
 * Genera un nuevo booking number usando la secuencia de Supabase
 * Formato: CWT-2025-100 (sin ceros a la izquierda)
 */
export async function generateBookingNumber(): Promise<string> {
  const { data, error } = await supabase.rpc('generate_booking_number');

  if (error) {
    console.error('[BookingNumbers] Error generating booking number:', error);
    // Fallback to timestamp-based ID if function fails
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-3); // Solo últimos 3 dígitos
    const sequentialNumber = 100 + parseInt(timestamp, 10) % 900; // Entre 100 y 999
    return `CWT-${year}-${sequentialNumber}`;
  }

  // Formatear al formato corto
  return formatBookingNumberShort(data as string);
}

/**
 * Genera un voucher para shuttle
 * Formato: CWT-2025-100-S1
 */
export function generateShuttleVoucher(bookingNumber: string, index: number): string {
  return `${bookingNumber}-S${index}`;
}

/**
 * Genera un voucher para tour
 * Formato: CWT-2025-100-T1
 */
export function generateTourVoucher(bookingNumber: string, index: number): string {
  return `${bookingNumber}-T${index}`;
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
