// src/utils/bookingValidation.ts - CORREGIDO FASE 2
/**
 * ==========================================
 * UTILIDADES DE VALIDACIÓN PARA BOOKINGS
 * ==========================================
 */

import { VALIDATION_RULES } from '@/lib/constants';

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
 * Sanitizar input para búsquedas (prevenir SQL injection)
 */
export function sanitizeSearchInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/[%_]/g, '')
    .replace(/['"]/g, '')
    .replace(/[;]/g, '')
    .trim()
    .slice(0, 100);
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
 * Validar dirección
 */
function validateAddress(address: string, fieldName: string): string | null {
  if (!address || address.trim().length === 0) {
    return `${fieldName} is required`;
  }
  
  if (address.length < VALIDATION_RULES.MIN_ADDRESS_LENGTH) {
    return `${fieldName} must be at least ${VALIDATION_RULES.MIN_ADDRESS_LENGTH} characters`;
  }
  
  if (address.length > VALIDATION_RULES.MAX_ADDRESS_LENGTH) {
    return `${fieldName} is too long (max ${VALIDATION_RULES.MAX_ADDRESS_LENGTH} characters)`;
  }
  
  return null;
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

  // Validar pickup address
  const pickupError = validateAddress(data.pickup_address, 'Pickup address');
  if (pickupError) {
    errors.pickup_address = pickupError;
  }

  // Validar dropoff address
  const dropoffError = validateAddress(data.dropoff_address, 'Drop-off address');
  if (dropoffError) {
    errors.dropoff_address = dropoffError;
  }

  // Validar pickup time
  if (!data.pickup_time || !isValidTime(data.pickup_time)) {
    errors.pickup_time = 'Valid pickup time is required (HH:mm format)';
  }

  // Validar flight number si es necesario
  const isAirportPickup = isAirport(data.from_location);
  const isAirportDropoff = isAirport(data.to_location);

  if ((isAirportPickup || isAirportDropoff) && data.flight_number && data.flight_number.trim().length > 0) {
    if (!isValidFlightNumber(data.flight_number)) {
      errors.flight_number = 'Invalid flight number format (e.g., AA 1234)';
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