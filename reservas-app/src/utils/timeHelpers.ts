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