// src/utils/timeHelpers.ts
/**
 * ==========================================
 * UTILIDADES PARA MANEJO DE TIEMPOS Y FECHAS
 * ==========================================
 * ✅ NUEVO - Normalización y formateo consistente
 */

// ==========================================
// FUNCIONES DE FECHAS
// ==========================================

/**
 * ✅ CRÍTICO: Convertir Date a string YYYY-MM-DD sin conversión UTC
 * Evita bug de timezone que causaba pérdida de 1 día
 * ✅ IMPROVED: Better error handling for mobile compatibility (React Error 310)
 *
 * @param date - Fecha a convertir
 * @returns String en formato YYYY-MM-DD en timezone local, or empty string if invalid
 *
 * @example
 * formatDateToString(new Date(2025, 10, 27)) → "2025-11-27"
 */
export function formatDateToString(date: Date | null | undefined): string {
  // ✅ FIXED: Handle null, undefined, and invalid Date input
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('[formatDateToString] Invalid date provided:', date);
    return '';
  }

  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    // ✅ FIXED: Catch any formatting errors
    console.warn('[formatDateToString] Failed to format date:', date);
    return '';
  }
}

/**
 * ✅ CRÍTICO: Parsear string YYYY-MM-DD a Date en timezone LOCAL
 * Evita bug de timezone al cargar fechas desde la base de datos
 * ✅ IMPROVED: Better error handling for mobile compatibility (React Error 310)
 *
 * NUNCA usar: new Date("2025-11-27") ❌ (interpreta como UTC)
 * SIEMPRE usar: parseDateFromString("2025-11-27") ✅ (interpreta como local)
 *
 * @param dateString - String en formato YYYY-MM-DD
 * @returns Date en timezone local (medianoche) o Invalid Date if parsing fails
 *
 * @example
 * parseDateFromString("2025-11-27") → Date(2025, 10, 27, 0, 0, 0, 0) en timezone local
 */
export function parseDateFromString(dateString: string | null | undefined): Date {
  // ✅ FIXED: Handle null, undefined, and non-string input
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    return new Date(NaN); // Returns Invalid Date
  }

  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      return new Date(NaN);
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // Validate parsed values
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return new Date(NaN);
    }

    // Validate reasonable date ranges
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
      return new Date(NaN);
    }

    return new Date(year, month - 1, day, 0, 0, 0, 0); // Local timezone
  } catch {
    // ✅ FIXED: Catch any parsing errors
    console.warn('[parseDateFromString] Failed to parse date:', dateString);
    return new Date(NaN);
  }
}

/**
 * Validar si un string es una fecha válida en formato YYYY-MM-DD
 * 
 * @param dateString - String a validar
 * @returns true si es una fecha válida
 */
export function isValidDateString(dateString: string | null | undefined): boolean {
  if (!dateString || typeof dateString !== 'string') return false;
  
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// ==========================================
// FUNCIONES DE TIEMPOS
// ==========================================

/**
 * Normalizar tiempo de cualquier formato a HH:mm
 * Maneja: "HH:mm:ss", "HH:mm", "H:mm", etc.
 * 
 * @param time - Tiempo en cualquier formato
 * @returns Tiempo normalizado en formato HH:mm o string vacío
 * 
 * @example
 * normalizeTime("14:30:00") → "14:30"
 * normalizeTime("9:15") → "09:15"
 * normalizeTime("23:45:12") → "23:45"
 */
export function normalizeTime(time: string | null | undefined): string {
  if (!time || typeof time !== 'string') return '';
  
  // Limpiar espacios
  const cleaned = time.trim();
  if (!cleaned) return '';
  
  // Separar por ":"
  const parts = cleaned.split(':');
  
  // Necesitamos al menos hora y minutos
  if (parts.length < 2) return '';
  
  // Parsear hora y minutos
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  // Validar rangos
  if (isNaN(hours) || isNaN(minutes)) return '';
  if (hours < 0 || hours > 23) return '';
  if (minutes < 0 || minutes > 59) return '';
  
  // Retornar en formato HH:mm con padding
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Convertir tiempo de 24h a 12h con AM/PM
 * 
 * @param time24 - Tiempo en formato 24h (HH:mm)
 * @returns Tiempo en formato 12h (h:mm AM/PM)
 * 
 * @example
 * formatTime12h("14:30") → "2:30 PM"
 * formatTime12h("09:15") → "9:15 AM"
 * formatTime12h("00:00") → "12:00 AM"
 */
export function formatTime12h(time24: string | null | undefined): string {
  const normalized = normalizeTime(time24);
  if (!normalized) return 'N/A';
  
  const [hoursStr, minutesStr] = normalized.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  if (isNaN(hours) || isNaN(minutes)) return normalized;
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Validar si un string es un tiempo válido
 * 
 * @param time - String a validar
 * @returns true si es un tiempo válido
 */
export function isValidTime(time: string | null | undefined): boolean {
  if (!time) return false;
  
  const normalized = normalizeTime(time);
  return normalized.length > 0;
}

/**
 * Obtener la hora actual en formato HH:mm
 * 
 * @returns Hora actual normalizada
 */
export function getCurrentTime(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Verificar si un tiempo está en horario nocturno
 * (21:00 - 03:59)
 * 
 * @param time - Tiempo a verificar
 * @returns true si está en horario nocturno
 */
export function isNightTimeHour(time: string | null | undefined): boolean {
  const normalized = normalizeTime(time);
  if (!normalized) return false;
  
  const [hoursStr] = normalized.split(':');
  const hours = parseInt(hoursStr, 10);
  
  if (isNaN(hours)) return false;
  
  // 21:00 - 23:59 o 00:00 - 03:59
  return hours >= 21 || hours < 4;
}

/**
 * Comparar dos tiempos
 * 
 * @param time1 - Primer tiempo
 * @param time2 - Segundo tiempo
 * @returns -1 si time1 < time2, 0 si son iguales, 1 si time1 > time2
 */
export function compareTime(
  time1: string | null | undefined,
  time2: string | null | undefined
): number {
  const t1 = normalizeTime(time1);
  const t2 = normalizeTime(time2);
  
  if (!t1 || !t2) return 0;
  
  const [h1, m1] = t1.split(':').map(Number);
  const [h2, m2] = t2.split(':').map(Number);
  
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  
  if (minutes1 < minutes2) return -1;
  if (minutes1 > minutes2) return 1;
  return 0;
}

/**
 * Agregar minutos a un tiempo
 * 
 * @param time - Tiempo base
 * @param minutesToAdd - Minutos a agregar
 * @returns Nuevo tiempo
 * 
 * @example
 * addMinutes("14:30", 45) → "15:15"
 * addMinutes("23:45", 30) → "00:15"
 */
export function addMinutes(
  time: string | null | undefined,
  minutesToAdd: number
): string {
  const normalized = normalizeTime(time);
  if (!normalized) return '';
  
  const [hoursStr, minutesStr] = normalized.split(':');
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10);
  
  minutes += minutesToAdd;
  
  // Manejar overflow de minutos
  while (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }
  
  while (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  
  // Manejar overflow de horas (ciclo de 24h)
  hours = ((hours % 24) + 24) % 24;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calcular diferencia en minutos entre dos tiempos
 * 
 * @param time1 - Tiempo inicial
 * @param time2 - Tiempo final
 * @returns Diferencia en minutos
 */
export function getTimeDifferenceInMinutes(
  time1: string | null | undefined,
  time2: string | null | undefined
): number {
  const t1 = normalizeTime(time1);
  const t2 = normalizeTime(time2);
  
  if (!t1 || !t2) return 0;
  
  const [h1, m1] = t1.split(':').map(Number);
  const [h2, m2] = t2.split(':').map(Number);
  
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  
  return minutes2 - minutes1;
}

/**
 * Generar array de horarios para selector
 * 
 * @param startHour - Hora inicial (default: 0)
 * @param endHour - Hora final (default: 23)
 * @param interval - Intervalo en minutos (default: 30)
 * @returns Array de tiempos en formato HH:mm
 * 
 * @example
 * generateTimeSlots(9, 17, 30) → ["09:00", "09:30", "10:00", ...]
 */
export function generateTimeSlots(
  startHour: number = 0,
  endHour: number = 23,
  interval: number = 30
): string[] {
  const slots: string[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  
  return slots;
}

// ==========================================
// COSTA RICA TIMEZONE HELPERS
// ==========================================

/**
 * Costa Rica timezone offset: UTC-6 (no daylight saving time)
 */
const COSTA_RICA_OFFSET = -6;

/**
 * Get current date/time in Costa Rica timezone
 *
 * @returns Date object representing current time in Costa Rica
 */
export function getNowInCostaRica(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (COSTA_RICA_OFFSET * 3600000));
}

/**
 * Check if a booking date/time is at least X hours from now (in Costa Rica time)
 *
 * @param bookingDate - The date of the booking (YYYY-MM-DD)
 * @param bookingTime - The time of the booking (HH:mm) - optional for date-only check
 * @param minimumHours - Minimum hours required (default: 12)
 * @returns true if booking is at least minimumHours away
 */
export function isBookingTimeValid(
  bookingDate: string,
  bookingTime?: string,
  minimumHours: number = 12
): boolean {
  const crNow = getNowInCostaRica();

  // Parse booking date
  const parsedDate = parseDateFromString(bookingDate);
  if (isNaN(parsedDate.getTime())) return false;

  // If no time provided, assume midnight
  const time = bookingTime || '00:00';
  const [hours, minutes] = time.split(':').map(Number);

  // Create booking datetime in Costa Rica time
  const bookingDateTime = new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
    hours,
    minutes,
    0,
    0
  );

  // Calculate difference in hours
  const diffMs = bookingDateTime.getTime() - crNow.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours >= minimumHours;
}

/**
 * Get minimum bookable date considering 12-hour cutoff
 *
 * @returns Date object for minimum bookable date
 */
export function getMinimumBookableDate(): Date {
  const crNow = getNowInCostaRica();

  // If it's after 12:00 (noon) in Costa Rica, tomorrow is minimum for noon pickups
  // But we need to allow booking for today if there are still 12+ hours
  // So we just return today's date - validation will handle the time
  return new Date(crNow.getFullYear(), crNow.getMonth(), crNow.getDate());
}

/**
 * Get minimum bookable time for a specific date considering 12-hour cutoff
 *
 * @param bookingDate - The selected booking date
 * @returns Minimum time in HH:mm format, or null if all times are available
 */
export function getMinimumBookableTime(bookingDate: string): string | null {
  const crNow = getNowInCostaRica();
  const parsedDate = parseDateFromString(bookingDate);

  if (isNaN(parsedDate.getTime())) return null;

  const today = new Date(crNow.getFullYear(), crNow.getMonth(), crNow.getDate());
  const bookingDay = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());

  // If booking is for a future day (not today or tomorrow), no minimum
  const diffDays = (bookingDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays > 1) {
    return null; // No restriction for bookings 2+ days out
  }

  // For today or tomorrow, calculate minimum time based on 12-hour window
  const minBookingTime = new Date(crNow.getTime() + (12 * 60 * 60 * 1000));

  // If min time is on the same day as booking date, return that time
  const minBookingDay = new Date(minBookingTime.getFullYear(), minBookingTime.getMonth(), minBookingTime.getDate());

  if (minBookingDay.getTime() === bookingDay.getTime()) {
    const h = minBookingTime.getHours();
    const m = minBookingTime.getMinutes();
    // Round up to next 30-minute slot
    const roundedMinutes = m < 30 ? 30 : 0;
    const roundedHours = m < 30 ? h : h + 1;

    if (roundedHours >= 24) {
      return null; // No times available today
    }

    return `${roundedHours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
  }

  // If booking is before the minimum day, no times available
  if (bookingDay.getTime() < minBookingDay.getTime()) {
    return '24:00'; // Special value meaning "no times available"
  }

  return null;
}

/**
 * Check if a specific date has any valid booking times (12-hour rule)
 *
 * @param bookingDate - The date to check
 * @returns true if at least one time slot is available
 */
export function hasAvailableTimesForDate(bookingDate: string): boolean {
  const minTime = getMinimumBookableTime(bookingDate);
  return minTime !== '24:00';
}

// ==========================================
// URGENCY / AVAILABILITY HELPERS
// ==========================================

/**
 * Generate a consistent "availability" number (1-4) based on route and date
 * Uses a simple hash to ensure the same route+date always returns the same number
 *
 * ✅ UPDATED: For bookings within 7 days, shows only 1-2 vans (more urgency)
 *
 * @param origin - Origin location
 * @param destination - Destination location
 * @param date - Date string (YYYY-MM-DD)
 * @returns Number between 1-4 (or 1-2 for bookings within 7 days)
 */
export function getAvailabilityCount(origin: string, destination: string, date: string): number {
  // Create a string to hash
  const key = `${origin}-${destination}-${date}`;

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Calculate days until booking
  const bookingDate = parseDateFromString(date);
  const today = getNowInCostaRica();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let daysUntilBooking = 999; // Default to large number if date parsing fails
  if (!isNaN(bookingDate.getTime())) {
    const diffMs = bookingDate.getTime() - todayStart.getTime();
    daysUntilBooking = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  // For bookings within 7 days: only show 1-2 vans (more urgency)
  if (daysUntilBooking <= 7) {
    return Math.abs(hash % 2) + 1; // Returns 1 or 2
  }

  // For bookings more than 7 days out: show 1-4 vans
  return Math.abs(hash % 4) + 1;
}