// src/contexts/CartContext.tsx
// ✅ CORREGIDO: Manejo robusto de localStorage para evitar errores críticos
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trackAddToCart } from '@/lib/analytics';

// ============================================
// TYPES
// ============================================

export interface ShuttleCartItem {
  type: 'shuttle';
  id: string;
  bookingId: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  pickupTime: string;
  adults: number;
  children: number;
  price: number;
  finalPrice: number;
  tripNumber?: number;
  totalTrips?: number;
}

export interface TourCartItem {
  type: 'tour';
  id: string;
  tourSlug: string;
  tourName: string;
  date: string;
  adults: number;
  children: number;
  price: number;
  hotel: string;
}

export type CartItem = ShuttleCartItem | TourCartItem;

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  isStorageAvailable: boolean;
  isHydrated: boolean; // ✅ Exposed for hydration-safe rendering
}

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * ✅ Check if localStorage is available and working
 * Safari private mode and some corporate browsers disable localStorage
 */
function checkStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * ✅ Safe localStorage get with error handling
 */
function safeGetItem(key: string): string | null {
  try {
    if (!checkStorageAvailable()) return null;
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('[Cart] localStorage.getItem failed:', error);
    return null;
  }
}

/**
 * ✅ Safe localStorage set with error handling
 */
function safeSetItem(key: string, value: string): boolean {
  try {
    if (!checkStorageAvailable()) return false;
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    // QuotaExceededError or SecurityError
    console.warn('[Cart] localStorage.setItem failed:', error);
    return false;
  }
}

/**
 * ✅ Safe localStorage remove with error handling
 */
function safeRemoveItem(key: string): void {
  try {
    if (checkStorageAvailable()) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('[Cart] localStorage.removeItem failed:', error);
  }
}

// ============================================
// CONTEXT
// ============================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);

  // ✅ Load from localStorage on mount with robust error handling
  useEffect(() => {
    const storageOk = checkStorageAvailable();
    setIsStorageAvailable(storageOk);

    if (!storageOk) {
      console.warn('[Cart] localStorage not available - cart will not persist');
      setIsHydrated(true);
      return;
    }

    const savedCart = safeGetItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // ✅ Validate parsed data before setting
        if (Array.isArray(parsed)) {
          // ✅ Additional validation: ensure each item has required fields
          const validItems = parsed.filter(item =>
            item && typeof item === 'object' && item.id && item.type
          );
          setItems(validItems);
        } else {
          console.warn('[Cart] Invalid cart data format, clearing');
          safeRemoveItem('cart');
        }
      } catch (error) {
        console.warn('[Cart] Error parsing cart data:', error);
        safeRemoveItem('cart');
      }
    }
    setIsHydrated(true);
  }, []);

  // ✅ Save to localStorage whenever items change (with error handling)
  useEffect(() => {
    if (isHydrated && isStorageAvailable) {
      safeSetItem('cart', JSON.stringify(items));
    }
  }, [items, isHydrated, isStorageAvailable]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Check if item already exists
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev;
      }

      // Track add_to_cart event in GA4
      if (item.type === 'shuttle') {
        const price = item.finalPrice || item.price;
        trackAddToCart({
          item_id: `shuttle_${item.bookingId}`,
          item_name: `${item.fromLocation} → ${item.toLocation}`,
          item_category: 'Shuttle',
          price: price,
          quantity: 1, // One shuttle service
        });
      } else if (item.type === 'tour') {
        trackAddToCart({
          item_id: `tour_${item.id}`,
          item_name: item.tourName,
          item_category: 'Private Tour',
          price: item.price,
          quantity: 1, // One tour service
        });
      }

      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    safeRemoveItem('cart');
  };

  const isInCart = (id: string): boolean => {
    return items.some((item) => item.id === id);
  };

  const itemCount = items.length;

  const totalAmount = items.reduce((sum, item) => {
    if (item.type === 'shuttle') {
      return sum + (item.finalPrice || 0);
    } else {
      return sum + (item.price || 0);
    }
  }, 0);

  const value: CartContextType = {
    items: isHydrated ? items : [], // ✅ Return empty until hydrated
    itemCount: isHydrated ? itemCount : 0, // ✅ Return 0 until hydrated to prevent mismatch
    totalAmount: isHydrated ? totalAmount : 0,
    addItem,
    removeItem,
    clearCart,
    isInCart,
    isStorageAvailable,
    isHydrated, // ✅ Expose hydration state
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ============================================
// HOOK
// ============================================

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}