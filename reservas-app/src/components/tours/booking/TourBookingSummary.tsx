// src/components/tours/booking/TourBookingSummary.tsx
import Image from 'next/image';
import { Clock, MapPin, Users, CheckCircle, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import { Tour } from '@/lib/supabase-tours';

interface TourBookingSummaryProps {
  tour: Tour;
  selectedDate?: Date;
  totalPassengers: number;
  totalPrice: number;
  isValidPassengerCount: boolean;
  isSubmitting: boolean;
  onPayNow: (e: React.FormEvent) => void;
  onAddToCart: (e: React.FormEvent) => void;
}

function formatDateDisplay(date?: Date) {
  if (!date) return null;
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric' 
  });
}

export function TourBookingSummary({
  tour,
  selectedDate,
  totalPassengers,
  totalPrice,
  isValidPassengerCount,
  isSubmitting,
  onPayNow,
  onAddToCart,
}: TourBookingSummaryProps) {
  return (
    <div className="sticky top-4">
      <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
        <div className="relative h-48">
          <Image
            src={tour.image}
            alt={tour.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-bold text-white text-lg drop-shadow-lg">
              {tour.name}
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>Pickup: {tour.pickup_time}</span>
            </div>
            {selectedDate && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-gray-400">📅</span>
                <span className="font-medium">{formatDateDisplay(selectedDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="font-medium">
                {totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base price (2 people minimum)</span>
              <span className="font-semibold text-gray-900">${tour.base_price * 2}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Extra person price:</span>
              <span className="font-medium">${tour.price_per_extra_person} each</span>
            </div>
            {totalPassengers > 2 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Extra {totalPassengers - 2} passenger{totalPassengers - 2 !== 1 ? 's' : ''}
                </span>
                <span className="font-semibold text-gray-900">
                  +${(totalPassengers - 2) * tour.price_per_extra_person}
                </span>
              </div>
            )}

            <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <div className="text-right">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-blue-600 text-3xl font-bold">${totalPrice}</span>
                </div>
                <p className="text-xs text-gray-500">All inclusive</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
            {/* Proceed to Checkout Button */}
            <button
              type="button"
              onClick={onPayNow}
              disabled={isSubmitting || !isValidPassengerCount}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onAddToCart}
              disabled={isSubmitting || !isValidPassengerCount}
              className="w-full h-14 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart & Explore More
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Included:</p>
            <ul className="space-y-2">
              {tour.included.slice(0, 4).map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
