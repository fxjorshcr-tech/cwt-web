// src/lib/validators.ts
// ✅ FIXED: Usa constantes de VALIDATION_RULES para evitar duplicación
/**
 * ==========================================
 * VALIDADORES CENTRALIZADOS
 * ==========================================
 * Todas las validaciones robustas de la aplicación
 */

import { VALIDATION_RULES } from './constants';

// ========================================
// REGEX PATTERNS
// ========================================

/**
 * Email regex según RFC 5322 (simplificado pero robusto)
 * Valida formato estándar de emails
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Phone regex - Acepta formatos internacionales
 * Ejemplos: +1-234-567-8900, +506 8596 2438, (123) 456-7890
 */
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,5}[-\s.]?[0-9]{1,9}$/;

/**
 * Name regex - Solo letras, espacios, guiones y apóstrofes
 * Acepta caracteres internacionales (À-ÿ para acentos)
 */
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/;

/**
 * Flight number regex - Formato estándar IATA
 * Ejemplos: AA 1234, CM123, BA 456A
 */
export const FLIGHT_NUMBER_REGEX = /^[A-Z]{2,3}\s*\d{1,4}[A-Z]?$/i;

/**
 * Time regex - Formato HH:mm (24 horas)
 */
export const TIME_24H_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

// ========================================
// VALIDATION FUNCTIONS
// ========================================

/**
 * Validar email
 * @param email - Email a validar
 * @returns Error message o null si es válido
 */
export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  
  email = email.trim().toLowerCase();
  
  // Validar longitud máxima según RFC 5321
  if (email.length > VALIDATION_RULES.MAX_EMAIL_LENGTH) {
    return `Email is too long (max ${VALIDATION_RULES.MAX_EMAIL_LENGTH} characters)`;
  }
  
  // Validar formato
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  
  // Validar que no tenga caracteres consecutivos inválidos
  if (email.includes('..') || email.includes('@@')) {
    return 'Invalid email format';
  }
  
  // Validar que tenga al menos un punto después del @
  const [localPart, domain] = email.split('@');
  if (!domain || !domain.includes('.')) {
    return 'Invalid email domain';
  }
  
  return null;
}

/**
 * Validar número de teléfono
 * @param phone - Número a validar
 * @returns Error message o null si es válido
 */
export function validatePhone(phone: string): string | null {
  if (!phone || phone.trim().length === 0) {
    return 'Phone number is required';
  }
  
  // Remover espacios, guiones y paréntesis para validar longitud
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  
  // Validar que solo contenga dígitos y el símbolo +
  if (!/^[+\d]+$/.test(cleanPhone)) {
    return 'Phone number should only contain digits and + symbol';
  }
  
  // Validar longitud mínima
  const digitsOnly = cleanPhone.replace('+', '');
  if (digitsOnly.length < VALIDATION_RULES.MIN_PHONE_LENGTH) {
    return `Phone number is too short (minimum ${VALIDATION_RULES.MIN_PHONE_LENGTH} digits)`;
  }
  
  // Validar longitud máxima
  if (digitsOnly.length > VALIDATION_RULES.MAX_PHONE_LENGTH) {
    return `Phone number is too long (maximum ${VALIDATION_RULES.MAX_PHONE_LENGTH} digits)`;
  }
  
  // Validar formato general
  if (!PHONE_REGEX.test(phone)) {
    return 'Please enter a valid phone number with country code';
  }
  
  return null;
}

/**
 * Validar nombre (first name, last name, etc.)
 * @param name - Nombre a validar
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Error message o null si es válido
 */
export function validateName(name: string, fieldName: string = 'Name'): string | null {
  if (!name || name.trim().length === 0) {
    return `${fieldName} is required`;
  }
  
  const trimmedName = name.trim();
  
  // Validar longitud mínima
  if (trimmedName.length < VALIDATION_RULES.MIN_NAME_LENGTH) {
    return `${fieldName} is too short (minimum ${VALIDATION_RULES.MIN_NAME_LENGTH} characters)`;
  }
  
  // Validar longitud máxima
  if (trimmedName.length > VALIDATION_RULES.MAX_NAME_LENGTH) {
    return `${fieldName} is too long (maximum ${VALIDATION_RULES.MAX_NAME_LENGTH} characters)`;
  }
  
  // Validar caracteres permitidos
  if (!NAME_REGEX.test(trimmedName)) {
    return `${fieldName} can only contain letters, spaces, hyphens and apostrophes`;
  }
  
  // Validar que no empiece o termine con espacios, guiones o apóstrofes
  if (/^[\s'-]|[\s'-]$/.test(trimmedName)) {
    return `${fieldName} cannot start or end with spaces, hyphens or apostrophes`;
  }
  
  return null;
}

/**
 * Validar número de vuelo
 * @param flightNumber - Número de vuelo a validar
 * @returns Error message o null si es válido
 */
export function validateFlightNumber(flightNumber: string): string | null {
  if (!flightNumber || flightNumber.trim().length === 0) {
    return null; // Es opcional en muchos casos
  }
  
  const trimmed = flightNumber.trim();
  
  if (!FLIGHT_NUMBER_REGEX.test(trimmed)) {
    return 'Invalid flight number format (e.g., AA 1234 or CM123)';
  }
  
  return null;
}

/**
 * Validar hora en formato 24h
 * @param time - Hora en formato HH:mm
 * @returns Error message o null si es válido
 */
export function validateTime(time: string): string | null {
  if (!time || time.trim().length === 0) {
    return 'Time is required';
  }
  
  if (!TIME_24H_REGEX.test(time)) {
    return 'Invalid time format (HH:mm)';
  }
  
  return null;
}

/**
 * Validar fecha de reserva
 * @param dateString - Fecha en formato ISO (YYYY-MM-DD)
 * @returns Error message o null si es válido
 */
export function validateBookingDate(dateString: string): string | null {
  if (!dateString || dateString.trim().length === 0) {
    return 'Date is required';
  }
  
  const selectedDate = new Date(dateString);
  
  // Validar que sea una fecha válida
  if (isNaN(selectedDate.getTime())) {
    return 'Invalid date';
  }
  
  // Obtener fecha actual sin hora
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Validar que no sea una fecha pasada
  if (selectedDate < today) {
    return 'Cannot book dates in the past';
  }
  
  // Validar límite máximo
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + VALIDATION_RULES.MAX_BOOKING_ADVANCE_DAYS);
  
  if (selectedDate > maxDate) {
    return `Can only book up to ${VALIDATION_RULES.MAX_BOOKING_ADVANCE_DAYS} days in advance`;
  }
  
  return null;
}

/**
 * ✅ FIXED: Validar número de pasajeros usando constantes
 * @param adults - Número de adultos
 * @param children - Número de niños
 * @returns Error message o null si es válido
 */
export function validatePassengers(adults: number, children: number): string | null {
  // Validar que sean números
  if (isNaN(adults) || isNaN(children)) {
    return 'Invalid passenger count';
  }
  
  // Validar mínimos
  if (adults < VALIDATION_RULES.MIN_ADULTS) {
    return `At least ${VALIDATION_RULES.MIN_ADULTS} adult is required`;
  }
  
  if (children < VALIDATION_RULES.MIN_CHILDREN) {
    return 'Number of children cannot be negative';
  }
  
  // ✅ FIXED: Validar máximos individuales usando constantes
  if (adults > VALIDATION_RULES.MAX_ADULTS) {
    return `Maximum ${VALIDATION_RULES.MAX_ADULTS} adults allowed`;
  }
  
  if (children > VALIDATION_RULES.MAX_CHILDREN) {
    return `Maximum ${VALIDATION_RULES.MAX_CHILDREN} children allowed`;
  }
  
  // ✅ FIXED: Validar total usando constantes
  const total = adults + children;
  if (total < 1) {
    return 'At least 1 passenger is required';
  }
  
  if (total > VALIDATION_RULES.MAX_TOTAL_PASSENGERS) {
    return `Maximum ${VALIDATION_RULES.MAX_TOTAL_PASSENGERS} passengers total`;
  }
  
  return null;
}

/**
 * Validar dirección (pickup o dropoff)
 * @param address - Dirección a validar
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Error message o null si es válido
 */
export function validateAddress(address: string, fieldName: string = 'Address'): string | null {
  if (!address || address.trim().length === 0) {
    return `${fieldName} is required`;
  }
  
  const trimmed = address.trim();
  
  // Validar longitud mínima
  if (trimmed.length < VALIDATION_RULES.MIN_ADDRESS_LENGTH) {
    return `${fieldName} is too short (minimum ${VALIDATION_RULES.MIN_ADDRESS_LENGTH} characters)`;
  }
  
  // Validar longitud máxima
  if (trimmed.length > VALIDATION_RULES.MAX_ADDRESS_LENGTH) {
    return `${fieldName} is too long (maximum ${VALIDATION_RULES.MAX_ADDRESS_LENGTH} characters)`;
  }
  
  return null;
}

/**
 * Validar país seleccionado
 * @param country - País a validar
 * @returns Error message o null si es válido
 */
export function validateCountry(country: string): string | null {
  if (!country || country.trim().length === 0) {
    return 'Country is required';
  }
  
  return null;
}

/**
 * Limpiar y normalizar número de teléfono
 * Remueve espacios y caracteres especiales excepto +
 * @param phone - Número de teléfono
 * @returns Número limpio
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/[\s()-]/g, '');
}

/**
 * Limpiar y normalizar email
 * Convierte a minúsculas y remueve espacios
 * @param email - Email
 * @returns Email limpio
 */
export function cleanEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Limpiar y normalizar nombre
 * Remueve espacios extra y normaliza capitalización
 * @param name - Nombre
 * @returns Nombre limpio
 */
export function cleanName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}