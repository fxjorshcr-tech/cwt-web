// src/components/cart/CartDropdown.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, X, Trash2, ArrowRight } from 'lucide-react';
import { useCart, ShuttleCartItem, TourCartItem } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/formatters';

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, itemCount, totalAmount, removeItem } = useCart();

  const shuttles = items.filter((item) => item.type === 'shuttle') as ShuttleCartItem[];
  const tours = items.filter((item) => item.type === 'tour') as TourCartItem[];

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10 relative ml-2"
        aria-label={`Shopping cart with ${itemCount} items`}
        suppressHydrationWarning
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            suppressHydrationWarning
          >
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[80vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 flex items-center gap-2" suppressHydrationWarning>
                <ShoppingCart className="h-5 w-5" />
                Cart ({itemCount})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Empty State */}
            {itemCount === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <Link
                  href="/transfers"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Browse Shuttles
                </Link>
              </div>
            ) : (
              <>
                {/* Items List - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
                  
                  {/* Shuttles */}
                  {shuttles.map((shuttle) => (
                    <div
                      key={shuttle.id}
                      className="bg-gray-50 rounded-lg p-3 flex gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                          {shuttle.fromLocation} → {shuttle.toLocation}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {shuttle.date} • {shuttle.adults + shuttle.children} pax
                        </p>
                        <p className="text-sm font-bold text-blue-600 mt-1">
                          {formatCurrency(shuttle.finalPrice)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(shuttle.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-red-600"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Tours */}
                  {tours.map((tour) => (
                    <div
                      key={tour.id}
                      className="bg-gray-50 rounded-lg p-3 flex gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                          {tour.tourName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {tour.date} • {tour.adults + tour.children} pax
                        </p>
                        <p className="text-sm font-bold text-blue-600 mt-1">
                          {formatCurrency(tour.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(tour.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-red-600"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>

                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    View Cart
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}