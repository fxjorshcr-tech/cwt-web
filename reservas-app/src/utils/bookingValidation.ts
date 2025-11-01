// src/utils/bookingValidation.ts

/**
 * ==========================================
 * UTILIDADES DE VALIDACIÓN PARA BOOKINGS
 * ==========================================
 */

/**
 * Interface para errores de validación
 */
export interface ValidationErrors {
  pickup_address?: string;
  dropoff_address?: string;
  pickup_time?: string;
  flight_number?: string;
  [key: string]: string | undefined;
}

/**
 * Sanitizar input para prevenir XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validar formato de hora (HH:mm)
 */
export function isValidTime(time: string): boolean {
  if (!time) return false;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Validar número de vuelo
 */
export function isValidFlightNumber(flightNumber: string): boolean {
  if (!flightNumber) return false;
  const flightRegex = /^[A-Z]{2,3}\s*\d{1,4}[A-Z]?$/i;
  return flightRegex.test(flightNumber);
}

/**
 * Detectar si una ubicación es un aeropuerto
 */
export function isAirport(location: string): boolean {
  if (!location) return false;
  
  const upperLocation = location.toUpperCase();
  
  return (
    upperLocation.includes('SJO') ||
    upperLocation.includes('LIR') ||
    upperLocation.includes('AEROPUERTO') ||
    upperLocation.includes('AIRPORT')
  );
}

/**
 * Validar campos del formulario de booking details
 */
export function validateBookingDetails(data: {
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  flight_number?: string;
  from_location: string;
  to_location: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.pickup_address || data.pickup_address.trim().length === 0) {
    errors.pickup_address = 'La dirección de recogida es requerida';
  } else if (data.pickup_address.length < 10) {
    errors.pickup_address = 'Proporciona una dirección más detallada (mínimo 10 caracteres)';
  }

  if (!data.dropoff_address || data.dropoff_address.trim().length === 0) {
    errors.dropoff_address = 'La dirección de entrega es requerida';
  } else if (data.dropoff_address.length < 10) {
    errors.dropoff_address = 'Proporciona una dirección más detallada (mínimo 10 caracteres)';
  }

  if (!data.pickup_time || data.pickup_time.trim().length === 0) {
    errors.pickup_time = 'La hora de recogida es requerida';
  } else if (!isValidTime(data.pickup_time)) {
    errors.pickup_time = 'Formato de hora inválido (HH:mm)';
  }

  const isAirportPickup = isAirport(data.from_location);
  const isAirportDropoff = isAirport(data.to_location);

  if ((isAirportPickup || isAirportDropoff) && data.flight_number && data.flight_number.trim().length > 0) {
    if (!isValidFlightNumber(data.flight_number)) {
      errors.flight_number = 'Formato de vuelo inválido (ej: AA 1234)';
    }
  }

  return errors;
}

/**
 * Calcular fees (13%)
 */
export function calculateFees(subtotal: number): number {
  if (!subtotal || subtotal <= 0) return 0;
  return Math.round(subtotal * 0.13 * 100) / 100;
}

/**
 * Calcular precio final
 */
export function calculateFinalPrice(basePrice: number, nightSurcharge: number): number {
  if (!basePrice || basePrice <= 0) return 0;
  const subtotal = basePrice + (nightSurcharge || 0);
  const fees = calculateFees(subtotal);
  return Math.round((subtotal + fees) * 100) / 100;
}