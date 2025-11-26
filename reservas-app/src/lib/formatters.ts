// src/lib/formatters.ts
// ✅ FIXED: Usa parseDateFromString de timeHelpers
/**
 * ==========================================
 * FORMATEADORES CENTRALIZADOS
 * ==========================================
 * Funciones para formatear datos de forma consistente
 */

import { parseDateFromString } from '@/utils/timeHelpers';

/**
 * Formatear Booking ID para mejor legibilidad
 * Si el ID es muy largo, muestra solo inicio y final
 * @param id - Booking ID
 * @returns ID formateado
 * @example
 * formatBookingId("booking_1234567890_abcdef") → "BOOK-...-ABCDEF"
 */
export function formatBookingId(id: string | null): string {
  if (!id) return 'N/A';
  
  // Si es corto, mostrar completo en mayúsculas
  if (id.length <= 12) {
    return id.toUpperCase();
  }
  
  // Si es largo, mostrar primeros 4 y últimos 8 caracteres
  return `${id.substring(0, 4).toUpperCase()}-...-${id.slice(-8).toUpperCase()}`;
}

/**
 * Formatear hora de 24h a 12h con AM/PM
 * ✅ IMPROVED: Better error handling for mobile compatibility
 * @param time24 - Hora en formato HH:mm (24 horas)
 * @returns Hora formateada en 12h con AM/PM (siempre string)
 * @example
 * formatTime("14:30") → "2:30 PM"
 * formatTime("09:15") → "9:15 AM"
 */
export function formatTime(time24: string | null | undefined): string {
  // ✅ FIXED: Handle null, undefined, and non-string input
  if (!time24 || typeof time24 !== 'string' || time24.trim() === '') {
    return 'N/A';
  }

  try {
    const parts = time24.split(':');
    if (parts.length < 2) return time24;

    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);

    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      return time24; // Retornar original si el formato es inválido
    }

    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;

    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  } catch {
    // ✅ FIXED: Catch any parsing errors
    console.warn('[formatTime] Failed to parse time:', time24);
    return 'N/A';
  }
}

/**
 * Formatear moneda (USD)
 * ✅ IMPROVED: Better error handling for mobile compatibility
 * @param amount - Cantidad
 * @param showCents - Si debe mostrar centavos (default: true)
 * @returns Cantidad formateada (siempre string)
 * @example
 * formatCurrency(150) → "$150.00"
 * formatCurrency(150.5, false) → "$151"
 */
export function formatCurrency(amount: number | null | undefined, showCents: boolean = true): string {
  // ✅ FIXED: Handle null, undefined, and non-number input
  if (amount === null || amount === undefined || typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }

  try {
    if (showCents) {
      return `$${amount.toFixed(2)}`;
    } else {
      return `$${Math.round(amount)}`;
    }
  } catch {
    // ✅ FIXED: Catch any formatting errors
    console.warn('[formatCurrency] Failed to format amount:', amount);
    return '$0.00';
  }
}

/**
 * ✅ FIXED: Formatear fecha para visualización
 * Usa parseDateFromString para evitar bug de timezone
 * ✅ IMPROVED: Better error handling for mobile compatibility
 *
 * @param dateString - Fecha en formato ISO (YYYY-MM-DD)
 * @param format - Formato deseado: 'short' | 'medium' | 'long'
 * @returns Fecha formateada (siempre string, nunca objeto)
 * @example
 * formatDate("2024-12-25", "short") → "Dec 25"
 * formatDate("2024-12-25", "medium") → "Thu, Dec 25"
 * formatDate("2024-12-25", "long") → "Thursday, December 25, 2024"
 */
export function formatDate(
  dateString: string | null | undefined,
  format: 'short' | 'medium' | 'long' = 'long'
): string {
  // ✅ FIXED: Handle null, undefined, empty, and non-string input
  if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
    return 'N/A';
  }

  try {
    // ✅ FIXED: Usar parseDateFromString en lugar de new Date()
    const date = parseDateFromString(dateString);

    // ✅ FIXED: Better invalid date detection
    if (!date || isNaN(date.getTime())) {
      return 'N/A';
    }

    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

      case 'medium':
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

      case 'long':
      default:
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
    }
  } catch {
    // ✅ FIXED: Catch any parsing errors (especially on mobile)
    console.warn('[formatDate] Failed to parse date:', dateString);
    return 'N/A';
  }
}

/**
 * Formatear duración (ej: "3:30" → "3 hours 30 minutes")
 * @param duration - Duración en formato H:mm o HH:mm
 * @returns Duración formateada
 * @example
 * formatDuration("3:30") → "3 hours 30 minutes"
 * formatDuration("2:00") → "2 hours"
 */
export function formatDuration(duration: string | null): string {
  if (!duration) return 'N/A';
  
  const parts = duration.split(':');
  
  if (parts.length !== 2) {
    return duration; // Retornar original si formato inválido
  }
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return duration;
  }
  
  if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${minutes}min`;
}

/**
 * Formatear distancia en kilómetros
 * @param km - Distancia en kilómetros
 * @returns Distancia formateada
 * @example
 * formatDistance(250) → "250 km"
 */
export function formatDistance(km: number | null): string {
  if (!km || isNaN(km)) return 'N/A';
  return `${km} km`;
}

/**
 * Formatear número de pasajeros
 * @param adults - Número de adultos
 * @param children - Número de niños
 * @returns Texto formateado
 * @example
 * formatPassengers(2, 1) → "2 adults, 1 child"
 * formatPassengers(1, 0) → "1 adult"
 */
export function formatPassengers(adults: number, children: number): string {
  const parts: string[] = [];
  
  if (adults > 0) {
    parts.push(`${adults} adult${adults !== 1 ? 's' : ''}`);
  }
  
  if (children > 0) {
    parts.push(`${children} child${children !== 1 ? 'ren' : ''}`);
  }
  
  if (parts.length === 0) {
    return '0 passengers';
  }
  
  return parts.join(', ');
}

/**
 * Formatear número de teléfono para visualización
 * Agrega espacios para mejor legibilidad
 * @param phone - Número de teléfono
 * @returns Teléfono formateado
 * @example
 * formatPhone("+15551234567") → "+1 555 123 4567"
 */
export function formatPhone(phone: string | null): string {
  if (!phone) return 'N/A';
  
  // Remover espacios y caracteres especiales
  const cleaned = phone.replace(/[\s()-]/g, '');
  
  // Si tiene código de país (+), formatear apropiadamente
  if (cleaned.startsWith('+')) {
    const countryCode = cleaned.substring(0, cleaned.length - 10);
    const areaCode = cleaned.substring(cleaned.length - 10, cleaned.length - 7);
    const firstPart = cleaned.substring(cleaned.length - 7, cleaned.length - 4);
    const secondPart = cleaned.substring(cleaned.length - 4);
    
    return `${countryCode} ${areaCode} ${firstPart} ${secondPart}`;
  }
  
  // Si no tiene código de país, asumir formato local
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  // Retornar original si no coincide con ningún formato
  return phone;
}

/**
 * Formatear porcentaje
 * @param value - Valor decimal (ej: 0.13 para 13%)
 * @returns Porcentaje formateado
 * @example
 * formatPercentage(0.13) → "13%"
 */
export function formatPercentage(value: number): string {
  if (isNaN(value)) return '0%';
  return `${(value * 100).toFixed(0)}%`;
}

/**
 * Truncar texto largo con ellipsis
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado
 * @example
 * truncateText("This is a very long text", 10) → "This is a..."
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formatear nombre para capitalización correcta
 * @param name - Nombre a formatear
 * @returns Nombre con capitalización correcta
 * @example
 * formatName("john doe") → "John Doe"
 * formatName("MARY SMITH") → "Mary Smith"
 */
export function formatName(name: string): string {
  if (!name) return '';
  
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}