// src/lib/constants.ts
// ✅ CORREGIDO: Solo límites de pasajeros a 12 (líneas 23-28)
/**
 * ==========================================
 * CONSTANTES GLOBALES DE LA APLICACIÓN
 * ==========================================
 * Valores que se usan en múltiples lugares
 */

// ========================================
// VALIDACIÓN
// ========================================

export const VALIDATION_RULES = {
  // Direcciones
  MIN_ADDRESS_LENGTH: 3,
  MAX_ADDRESS_LENGTH: 200,
  
  // Instrucciones
  MAX_INSTRUCTIONS_LENGTH: 500,
  
  // Solicitudes especiales
  MAX_SPECIAL_REQUESTS_LENGTH: 1000,
  
  // Pasajeros - ✅ CORREGIDO: Máximo 12
  MIN_ADULTS: 1,
  MAX_ADULTS: 12,              // ✅ Cambiado de 18 a 12
  MIN_CHILDREN: 0,
  MAX_CHILDREN: 12,            // ✅ Cambiado de 18 a 12
  MAX_TOTAL_PASSENGERS: 12,    // ✅ Cambiado de 18 a 12
  
  // Fechas
  MAX_BOOKING_ADVANCE_DAYS: 365, // 1 año
  
  // Nombres
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  
  // Email
  MAX_EMAIL_LENGTH: 254,
  
  // Teléfono
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
} as const;

// ========================================
// AEROPUERTOS DE COSTA RICA
// ========================================

export const AIRPORTS = [
  'SJO',
  'LIR',
  'AEROPUERTO',
  'AIRPORT',
  'Juan Santamaría',
  'Juan Santamaria',
  'Daniel Oduber',
  'San José Airport',
  'San Jose Airport',
  'Liberia Airport',
] as const;

/**
 * Detectar si una ubicación es un aeropuerto
 * @param location - Nombre de la ubicación
 * @returns true si es un aeropuerto
 */
export function isAirportLocation(location: string): boolean {
  if (!location) return false;
  
  const upperLocation = location.toUpperCase();
  
  return AIRPORTS.some(airport => 
    upperLocation.includes(airport.toUpperCase())
  );
}

// ========================================
// FORMATOS DE FECHA Y HORA
// ========================================

export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',           // 2024-12-25
  US_SHORT: 'MM/dd/yyyy',      // 12/25/2024
  US_LONG: 'MMMM d, yyyy',     // December 25, 2024
  DISPLAY: 'EEEE, MMMM d, yyyy', // Thursday, December 25, 2024
} as const;

export const TIME_FORMATS = {
  TIME_24H: 'HH:mm',           // 14:30
  TIME_12H: 'h:mm a',          // 2:30 PM
} as const;

// ========================================
// PAÍSES (para el selector)
// ========================================

export const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Ireland',
  'New Zealand',
  'Japan',
  'South Korea',
  'Singapore',
  'Mexico',
  'Brazil',
  'Argentina',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Panama',
  'Other',
].sort();

// ========================================
// CONTACTO Y SOPORTE
// ========================================

export const CONTACT_INFO = {
  WHATSAPP: '+506-8596-2438',
  EMAIL: 'contact@cantwaittravelcr.com',
  WEBSITE: 'https://cantwaittravelcr.com',
  ICT_LICENSE: '4121-2025',
} as const;

// ========================================
// SEO Y METADATA
// ========================================

export const SEO_DEFAULTS = {
  SITE_NAME: "Can't Wait Travel",
  SITE_TITLE: "Private Shuttle Costa Rica | Airport Transfers",
  SITE_DESCRIPTION: 'Professional private shuttle service in Costa Rica. Door-to-door transfers from San José (SJO) and Liberia (LIR) airports.',
  SITE_URL: 'https://cantwaittravelcr.com',
  TWITTER_HANDLE: '@cantwaittravelcr',
} as const;

// ========================================
// RUTAS DE NAVEGACIÓN
// ========================================

export const APP_ROUTES = {
  HOME: '/',
  BOOKING_DETAILS: '/booking-details',
  SUMMARY: '/summary',
  PAYMENT: '/payment',
  CONFIRMATION: '/confirmation',
  TRANSFERS: '/transfers',
  PRIVATE_TOURS: '/private-tours',
  TRAVEL_GUIDE: '/travel-guide',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  CANCELLATION: '/cancellation',
} as const;

// ========================================
// ICONOS Y ASSETS
// ========================================

export const ASSET_URLS = {
  LOGO: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-cant-wait-travel.webp',
  HERO_IMAGE: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp',
  PUERTO_VIEJO: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp',
} as const;

// ========================================
// TIMEOUTS Y DELAYS
// ========================================

export const TIMEOUTS = {
  DEBOUNCE_SEARCH: 300,        // ms para debounce en búsquedas
  TOAST_DURATION: 3000,        // ms para mostrar toasts
  REDIRECT_DELAY: 2000,        // ms antes de redireccionar
  API_TIMEOUT: 30000,          // ms timeout para llamadas API
} as const;

// ========================================
// MENSAJES DE ERROR COMUNES
// ========================================

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  BOOKING_NOT_FOUND: 'Booking not found. Please check your booking ID.',
  ROUTE_NOT_FOUND: 'No route available for this combination.',
  INVALID_DATE: 'Please select a valid date.',
  INVALID_PASSENGERS: 'Invalid number of passengers.',
} as const;

// ========================================
// MENSAJES DE ÉXITO
// ========================================

export const SUCCESS_MESSAGES = {
  BOOKING_SAVED: 'Booking details saved successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  EMAIL_SENT: 'Confirmation email sent!',
  UPDATE_SUCCESS: 'Information updated successfully!',
} as const;

// ========================================
// LOADING MESSAGES
// ========================================

export const LOADING_MESSAGES = {
  LOADING_ROUTES: 'Loading available routes...',
  LOADING_BOOKING: 'Loading booking data...',
  PROCESSING_PAYMENT: 'Processing your payment...',
  SAVING: 'Saving your information...',
  REDIRECTING: 'Redirecting...',
} as const;

// ========================================
// PLACEHOLDERS
// ========================================

export const PLACEHOLDERS = {
  PICKUP_ADDRESS_AIRPORT: "Denny's, outside terminal, or another meeting point at the airport...",
  PICKUP_ADDRESS_GENERAL: "Hotel name, Airbnb address, house address, or paste Google Maps link...",
  DROPOFF_ADDRESS: "Hotel name, Airbnb address, house address, or paste Google Maps link...",
  SPECIAL_REQUESTS: "Extra luggage, baby seat, surfboard, dietary restrictions, etc.",
  AIRLINE: "e.g., Copa Airlines",
  FLIGHT_NUMBER: "e.g., CM 123",
  PHONE: "+1 234 567 8900",
  EMAIL: "john.doe@example.com",
} as const;

// ========================================
// FEATURES FLAGS (para habilitar/deshabilitar funcionalidades)
// ========================================

export const FEATURES = {
  ENABLE_MULTI_TRIP: true,
  ENABLE_ADD_ONS: true,
  ENABLE_NIGHT_SURCHARGE: true,
  ENABLE_GOOGLE_ANALYTICS: false, // Cambiar a true cuando tengas el ID
  ENABLE_LIVE_CHAT: false,
  ENABLE_REVIEWS: true,
} as const;

// ========================================
// BOOKING STEPS
// ========================================

export const BOOKING_STEPS = [
  { number: 1, name: 'Route Selection', path: '/' },
  { number: 2, name: 'Trip Details', path: '/booking-details' },
  { number: 3, name: 'Summary', path: '/summary' },
  { number: 4, name: 'Payment', path: '/payment' },
] as const;

// ========================================
// ADD-ONS IDS
// ========================================

// ✅ CORREGIDO: Usar underscore para consistencia con la base de datos
export const ADD_ON_IDS = {
  TICO_TIME: 'tico_time',  // ✅ Con underscore
  FLEX_TIME: 'flex_time',  // ✅ Con underscore
} as const;

// ========================================
// REGEX PATTERNS (exportados también desde validators.ts)
// ========================================

export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,5}[-\s.]?[0-9]{1,9}$/,
  TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  FLIGHT_NUMBER: /^[A-Z]{2,3}\s*\d{1,4}[A-Z]?$/i,
} as const;