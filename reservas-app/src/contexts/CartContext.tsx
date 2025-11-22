// src/contexts/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // ✅ Load from localStorage on mount with validation
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // ✅ Validate parsed data before setting
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          console.error('Invalid cart data in localStorage');
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // ✅ Clear corrupted localStorage
        localStorage.removeItem('cart');
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Check if item already exists
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const isInCart = (id: string): boolean => {
    return items.some((item) => item.id === id);
  };

  const itemCount = items.length;

  const totalAmount = items.reduce((sum, item) => {
    if (item.type === 'shuttle') {
      return sum + item.finalPrice;
    } else {
      return sum + item.price;
    }
  }, 0);

  const value: CartContextType = {
    items,
    itemCount: isHydrated ? itemCount : 0, // ✅ Return 0 until hydrated to prevent mismatch
    totalAmount: isHydrated ? totalAmount : 0,
    addItem,
    removeItem,
    clearCart,
    isInCart,
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