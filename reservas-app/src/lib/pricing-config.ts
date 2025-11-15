// src/lib/pricing-config.ts
/**
 * ==========================================
 * CONFIGURACIÓN Y CÁLCULOS DE PRECIOS
 * ==========================================
 * ✅ CORREGIDO: Límites de pasajeros a 12 en frontend
 * ✅ precio13a18 permanece para compatibilidad con Supabase
 */

import type { Route } from '@/types/supabase';

// ========================================
// CONFIGURACIÓN DE PRECIOS
// ========================================

/**
 * Configuración global de pricing
 * IMPORTANTE: Cambiar estos valores afecta toda la aplicación
 */
export const PRICING_CONFIG = {
  // Recargo nocturno (9 PM - 4 AM)
  NIGHT_SURCHARGE: {
    TYPE: 'FIXED' as 'FIXED' | 'PERCENTAGE',
    AMOUNT: 50,                                // $50 fijo
    START_HOUR: 21,                            // 9 PM
    END_HOUR: 4,                               // 4 AM
  },
  
  // Fees (13% service fee)
  FEES_PERCENTAGE: 0.13,
  
  // Add-ons precios
  ADD_ONS: {
    TICO_TIME: 160,           // $160
    FLEX_TIME: 45,            // $45
  },
  
  // ✅ IDs OFICIALES de add-ons (consistentes en toda la app)
  ADD_ON_IDS: {
    TICO_TIME: 'tico_time',
    FLEX_TIME: 'flex_time',
  } as const,
  
  // ✅ Límites de pasajeros - Máximo 12 en frontend
  PASSENGERS: {
    MIN_ADULTS: 1,
    MAX_ADULTS: 12,        // ✅ Máximo 12
    MIN_CHILDREN: 0,
    MAX_CHILDREN: 12,      // ✅ Máximo 12
    MAX_TOTAL: 12,         // ✅ Máximo 12 total
  },
  
  // Rangos de precios por número de pasajeros
  // ✅ precio13a18 se mantiene para compatibilidad con Supabase
  // pero el frontend no permite más de 12 pasajeros
  PRICE_RANGES: [
    { min: 1, max: 6, priceKey: 'precio1a6' as const },
    { min: 7, max: 9, priceKey: 'precio7a9' as const },
    { min: 10, max: 12, priceKey: 'precio10a12' as const },
    { min: 13, max: 18, priceKey: 'precio13a18' as const }, // Solo para backend
  ],
} as const;

// ========================================
// FUNCIONES DE CÁLCULO
// ========================================

/**
 * Calcular precio base según número de pasajeros
 * @param route - Ruta con precios
 * @param totalPassengers - Total de pasajeros
 * @returns Precio base
 */
export function calculateBasePrice(route: Route, totalPassengers: number): number {
  if (!route || totalPassengers < 1) {
    return 0;
  }
  
  // Encontrar el rango de precio apropiado
  const priceRange = PRICING_CONFIG.PRICE_RANGES.find(
    range => totalPassengers >= range.min && totalPassengers <= range.max
  );
  
  if (!priceRange) {
    // Si no hay rango (no debería pasar), usar el precio más alto
    return route.precio13a18 || 0;
  }
  
  const price = route[priceRange.priceKey];
  
  // Si el precio no existe o es 0, buscar el siguiente precio disponible
  if (!price || price === 0) {
    for (let i = PRICING_CONFIG.PRICE_RANGES.length - 1; i >= 0; i--) {
      const fallbackPrice = route[PRICING_CONFIG.PRICE_RANGES[i].priceKey];
      if (fallbackPrice && fallbackPrice > 0) {
        return fallbackPrice;
      }
    }
  }
  
  return price || 0;
}

/**
 * Calcular recargo nocturno (9 PM - 4 AM)
 * @param pickupTime - Hora de recogida en formato HH:mm
 * @param basePrice - Precio base (solo necesario si TYPE es 'PERCENTAGE')
 * @returns Monto del recargo nocturno
 */
export function calculateNightSurcharge(
  pickupTime: string | null | undefined,
  basePrice?: number
): number {
  if (!pickupTime) return 0;
  
  const [hoursStr] = pickupTime.split(':');
  const hours = parseInt(hoursStr, 10);
  
  if (isNaN(hours) || hours < 0 || hours > 23) {
    return 0;
  }
  
  const { START_HOUR, END_HOUR, TYPE, AMOUNT } = PRICING_CONFIG.NIGHT_SURCHARGE;
  
  // Verificar si está en horario nocturno (21:00-03:59)
  const isNightTime = hours >= START_HOUR || hours < END_HOUR;
  
  if (!isNightTime) {
    return 0;
  }
  
  // Calcular recargo según tipo
  if (TYPE === 'FIXED') {
    return AMOUNT;
  } else if (TYPE === 'PERCENTAGE' && basePrice) {
    return basePrice * AMOUNT;
  }
  
  return 0;
}

/**
 * Verificar si una hora está en horario nocturno
 * @param pickupTime - Hora de recogida en formato HH:mm
 * @returns true si está en horario nocturno (9 PM - 4 AM)
 */
export function isNightTime(pickupTime: string | null | undefined): boolean {
  if (!pickupTime) return false;
  
  const [hoursStr] = pickupTime.split(':');
  const hours = parseInt(hoursStr, 10);
  
  if (isNaN(hours) || hours < 0 || hours > 23) {
    return false;
  }
  
  const { START_HOUR, END_HOUR } = PRICING_CONFIG.NIGHT_SURCHARGE;
  return hours >= START_HOUR || hours < END_HOUR;
}

/**
 * Calcular fees (13% service fee)
 * @param subtotal - Subtotal antes de fees
 * @returns Monto de fees redondeado a 2 decimales
 */
export function calculateFees(subtotal: number): number {
  if (!subtotal || subtotal <= 0) {
    return 0;
  }
  
  const fees = subtotal * PRICING_CONFIG.FEES_PERCENTAGE;
  return Math.round(fees * 100) / 100; // Redondear a 2 decimales
}

/**
 * ✅ Calcular precio de add-ons con IDs consistentes
 * @param addOnIds - Array de IDs de add-ons seleccionados
 * @returns Total de add-ons
 */
export function calculateAddOnsPrice(addOnIds: string[]): number {
  if (!addOnIds || addOnIds.length === 0) {
    return 0;
  }
  
  let total = 0;
  
  addOnIds.forEach(id => {
    switch (id) {
      case PRICING_CONFIG.ADD_ON_IDS.TICO_TIME:  // 'tico_time'
        total += PRICING_CONFIG.ADD_ONS.TICO_TIME;
        break;
      case PRICING_CONFIG.ADD_ON_IDS.FLEX_TIME:  // 'flex_time'
        total += PRICING_CONFIG.ADD_ONS.FLEX_TIME;
        break;
      default:
        console.warn(`Unknown add-on ID: ${id}`);
    }
  });
  
  return total;
}

/**
 * Calcular precio final total (base + night surcharge + add-ons + fees)
 * @param params - Parámetros para el cálculo
 * @returns Precio final total redondeado a 2 decimales
 */
export function calculateFinalPrice(params: {
  basePrice: number;
  nightSurcharge?: number;
  addOnsPrice?: number;
}): number {
  const { basePrice, nightSurcharge = 0, addOnsPrice = 0 } = params;
  
  const subtotal = basePrice + nightSurcharge + addOnsPrice;
  const fees = calculateFees(subtotal);
  const total = subtotal + fees;
  
  return Math.round(total * 100) / 100; // Redondear a 2 decimales
}

/**
 * Calcular desglose completo de precio
 * Incluye todos los componentes del precio final
 * @param params - Parámetros para el cálculo
 * @returns Objeto con desglose completo del precio
 */
export function calculatePriceBreakdown(params: {
  route: Route;
  totalPassengers: number;
  pickupTime?: string;
  addOnIds?: string[];
}) {
  const { route, totalPassengers, pickupTime, addOnIds = [] } = params;
  
  // Calcular cada componente
  const basePrice = calculateBasePrice(route, totalPassengers);
  const nightSurcharge = pickupTime ? calculateNightSurcharge(pickupTime, basePrice) : 0;
  const addOnsPrice = calculateAddOnsPrice(addOnIds);
  const subtotal = basePrice + nightSurcharge + addOnsPrice;
  const fees = calculateFees(subtotal);
  const finalPrice = calculateFinalPrice({ basePrice, nightSurcharge, addOnsPrice });
  
  return {
    basePrice,
    nightSurcharge,
    addOnsPrice,
    subtotal,
    fees,
    finalPrice,
    isNightTime: pickupTime ? isNightTime(pickupTime) : false,
  };
}

// ========================================
// CLASE PRINCIPAL (OPCIONAL - ESTILO OOP)
// ========================================

/**
 * Calculadora de precios con patrón Builder
 * Permite configurar el cálculo paso a paso
 * 
 * @example
 * const calculator = new PricingCalculator(route, 4)
 *   .setPickupTime('21:30')
 *   .setAddOns(['tico_time']);
 * const breakdown = calculator.getBreakdown();
 */
export class PricingCalculator {
  private route: Route;
  private totalPassengers: number;
  private pickupTime?: string;
  private addOnIds: string[] = [];
  
  constructor(route: Route, totalPassengers: number) {
    this.route = route;
    this.totalPassengers = totalPassengers;
  }
  
  setPickupTime(time: string): this {
    this.pickupTime = time;
    return this;
  }
  
  setAddOns(addOnIds: string[]): this {
    this.addOnIds = addOnIds;
    return this;
  }
  
  getBreakdown() {
    return calculatePriceBreakdown({
      route: this.route,
      totalPassengers: this.totalPassengers,
      pickupTime: this.pickupTime,
      addOnIds: this.addOnIds,
    });
  }
  
  getFinalPrice(): number {
    return this.getBreakdown().finalPrice;
  }
}

// ========================================
// HELPERS
// ========================================

/**
 * Verificar si una ruta tiene precios válidos
 * @param route - Ruta a verificar
 * @returns true si tiene al menos un precio válido
 */
export function hasValidPrices(route: Route): boolean {
  return !!(
    route.precio1a6 ||
    route.precio7a9 ||
    route.precio10a12 ||
    route.precio13a18
  );
}

/**
 * Obtener el precio más bajo de una ruta
 * @param route - Ruta
 * @returns Precio más bajo disponible
 */
export function getLowestPrice(route: Route): number {
  const prices = [
    route.precio1a6,
    route.precio7a9,
    route.precio10a12,
    route.precio13a18,
  ].filter((p): p is number => p !== null && p > 0);
  
  return prices.length > 0 ? Math.min(...prices) : 0;
}