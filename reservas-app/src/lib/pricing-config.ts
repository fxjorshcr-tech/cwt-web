// src/lib/pricing-config.ts
/**
 * ==========================================
 * CONFIGURACIÓN Y CÁLCULOS DE PRECIOS
 * ==========================================
 * ✅ ACTUALIZADO: Add-ons con IDs y precios correctos
 */

import type { Route } from '@/types/supabase';

// ========================================
// CONFIGURACIÓN DE PRECIOS
// ========================================

export const PRICING_CONFIG = {
  // Recargo nocturno DESHABILITADO (ya no se cobra)
  NIGHT_SURCHARGE: {
    TYPE: 'FIXED' as 'FIXED' | 'PERCENTAGE',
    AMOUNT: 0, // ✅ Disabled - no night surcharge
    START_HOUR: 21,
    END_HOUR: 4,
  },

  // Fees (13% service fee)
  FEES_PERCENTAGE: 0.13,

  // Launch Discount - DISABLED
  LAUNCH_DISCOUNT: {
    ENABLED: false,
    PERCENTAGE: 0, // Discount disabled
    LABEL: '',
  },
  
  // ✅ Add-ons precios actualizados
  ADD_ONS: {
    FLEX_PROTECTION: 59,      // $59
    EXPLORER_UPGRADE: 195,    // $195
  },
  
  // ✅ IDs oficiales de add-ons
  ADD_ON_IDS: {
    FLEX_PROTECTION: 'flex_protection',
    EXPLORER_UPGRADE: 'explorer_upgrade',
  } as const,
  
  // Límites de pasajeros
  PASSENGERS: {
    MIN_ADULTS: 1,
    MAX_ADULTS: 12,
    MIN_CHILDREN: 0,
    MAX_CHILDREN: 12,
    MAX_TOTAL: 12,
  },
  
  // Rangos de precios por número de pasajeros
  PRICE_RANGES: [
    { min: 1, max: 6, priceKey: 'precio1a6' as const },
    { min: 7, max: 9, priceKey: 'precio7a9' as const },
    { min: 10, max: 12, priceKey: 'precio10a12' as const },
    { min: 13, max: 18, priceKey: 'precio13a18' as const },
  ],
} as const;

// ========================================
// FUNCIONES DE CÁLCULO
// ========================================

export function calculateBasePrice(route: Route, totalPassengers: number): number {
  if (!route || totalPassengers < 1) {
    return 0;
  }
  
  const priceRange = PRICING_CONFIG.PRICE_RANGES.find(
    range => totalPassengers >= range.min && totalPassengers <= range.max
  );
  
  if (!priceRange) {
    return route.precio13a18 || 0;
  }
  
  const price = route[priceRange.priceKey];
  
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
  
  const isNightTime = hours >= START_HOUR || hours < END_HOUR;
  
  if (!isNightTime) {
    return 0;
  }
  
  if (TYPE === 'FIXED') {
    return AMOUNT;
  } else if (TYPE === 'PERCENTAGE' && basePrice) {
    return basePrice * AMOUNT;
  }
  
  return 0;
}

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

export function calculateFees(subtotal: number): number {
  if (!subtotal || subtotal <= 0) {
    return 0;
  }

  const fees = subtotal * PRICING_CONFIG.FEES_PERCENTAGE;
  return Math.round(fees * 100) / 100;
}

/**
 * 🎉 Calculate launch discount (20% OFF for early supporters)
 * IMPORTANT: Only applies to base price, NOT to add-ons or fees
 */
export function calculateLaunchDiscount(basePrice: number): number {
  if (!PRICING_CONFIG.LAUNCH_DISCOUNT.ENABLED || basePrice <= 0) {
    return 0;
  }

  const discount = basePrice * PRICING_CONFIG.LAUNCH_DISCOUNT.PERCENTAGE;
  return Math.round(discount * 100) / 100;
}

export function isLaunchDiscountEnabled(): boolean {
  return PRICING_CONFIG.LAUNCH_DISCOUNT.ENABLED;
}

/**
 * ✅ Calcular precio de add-ons con IDs actualizados
 */
export function calculateAddOnsPrice(addOnIds: string[]): number {
  if (!addOnIds || addOnIds.length === 0) {
    return 0;
  }
  
  let total = 0;
  
  addOnIds.forEach(id => {
    switch (id) {
      case PRICING_CONFIG.ADD_ON_IDS.FLEX_PROTECTION:  // 'flex_protection'
        total += PRICING_CONFIG.ADD_ONS.FLEX_PROTECTION; // $59
        break;
      case PRICING_CONFIG.ADD_ON_IDS.EXPLORER_UPGRADE:  // 'explorer_upgrade'
        total += PRICING_CONFIG.ADD_ONS.EXPLORER_UPGRADE; // $195
        break;
      default:
        console.warn(`Unknown add-on ID: ${id}`);
    }
  });
  
  return total;
}

export function calculateFinalPrice(params: {
  basePrice: number;
  nightSurcharge?: number;
  addOnsPrice?: number;
  applyLaunchDiscount?: boolean;
}): number {
  const { basePrice, nightSurcharge = 0, addOnsPrice = 0, applyLaunchDiscount = true } = params;

  // Apply launch discount ONLY to base price (not addons)
  const discount = applyLaunchDiscount ? calculateLaunchDiscount(basePrice + nightSurcharge) : 0;
  const discountedBasePrice = (basePrice + nightSurcharge) - discount;

  // Add-ons are NOT discounted
  const subtotalAfterDiscount = discountedBasePrice + addOnsPrice;

  // Fees apply to the total after discount
  const fees = calculateFees(subtotalAfterDiscount);
  const total = subtotalAfterDiscount + fees;

  return Math.round(total * 100) / 100;
}

export function calculatePriceBreakdown(params: {
  route: Route;
  totalPassengers: number;
  pickupTime?: string;
  addOnIds?: string[];
  applyLaunchDiscount?: boolean;
}) {
  const { route, totalPassengers, pickupTime, addOnIds = [], applyLaunchDiscount = true } = params;

  const basePrice = calculateBasePrice(route, totalPassengers);
  const nightSurcharge = pickupTime ? calculateNightSurcharge(pickupTime, basePrice) : 0;
  const addOnsPrice = calculateAddOnsPrice(addOnIds);

  // Subtotal before discount (base + surcharge + addons)
  const subtotal = basePrice + nightSurcharge + addOnsPrice;

  // Apply launch discount ONLY to base price (not addons)
  const basePriceForDiscount = basePrice + nightSurcharge;
  const discount = applyLaunchDiscount ? calculateLaunchDiscount(basePriceForDiscount) : 0;

  // Discounted subtotal = (base - discount) + addons
  const discountedSubtotal = (basePriceForDiscount - discount) + addOnsPrice;

  const fees = calculateFees(discountedSubtotal);
  const finalPrice = calculateFinalPrice({ basePrice, nightSurcharge, addOnsPrice, applyLaunchDiscount });

  return {
    basePrice,
    nightSurcharge,
    addOnsPrice,
    subtotal,
    discount,
    discountedSubtotal,
    fees,
    finalPrice,
    isNightTime: pickupTime ? isNightTime(pickupTime) : false,
    hasLaunchDiscount: applyLaunchDiscount && discount > 0,
  };
}

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

export function hasValidPrices(route: Route): boolean {
  return !!(
    route.precio1a6 ||
    route.precio7a9 ||
    route.precio10a12 ||
    route.precio13a18
  );
}

export function getLowestPrice(route: Route): number {
  const prices = [
    route.precio1a6,
    route.precio7a9,
    route.precio10a12,
    route.precio13a18,
  ].filter((p): p is number => p !== null && p > 0);
  
  return prices.length > 0 ? Math.min(...prices) : 0;
}