// src/components/summary/OrderSummaryCard.tsx
// Botón "Proceed to Checkout" para ir a la página de pago
// ✅ UPDATED: Added Early Bird discount support
import { ArrowLeft, ShoppingCart, Moon, Sparkles, ArrowRight, Info, Loader2, Bird, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';

interface Trip {
  id: string;
  price: number;
  final_price: number | null;
  night_surcharge: number | null;
  add_ons: string[] | null;
  date?: string; // Added for Early Bird calculation
}

interface OrderSummaryCardProps {
  trips: Trip[];
  totalPassengers: number;
  grandTotal: number;
  feesPercentage: number;
  isSaving?: boolean;
  onProceedToCheckout: () => void;
  onAddToCart: () => void;
  onBackToDetails: () => void;
}

const ADD_ON_PRICES: Record<string, number> = {
  flex_protection: 59,
  explorer_upgrade: 195,
};

const ADD_ON_NAMES: Record<string, string> = {
  flex_protection: 'Flex Protection',
  explorer_upgrade: 'Explorer Upgrade',
};

// Early Bird discount: 10% off for bookings 30+ days in advance
const EARLY_BIRD_DISCOUNT = 0.10;
const EARLY_BIRD_DAYS = 30;

// Check if any trip qualifies for Early Bird discount
function getEarlyBirdInfo(trips: Trip[]): { qualifies: boolean; daysAhead: number } {
  if (!trips.length) return { qualifies: false, daysAhead: 0 };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check each trip's date
  for (const trip of trips) {
    if (!trip.date) continue;

    const [year, month, day] = trip.date.split('-').map(Number);
    const tripDate = new Date(year, month - 1, day);
    const diffMs = tripDate.getTime() - todayStart.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= EARLY_BIRD_DAYS) {
      return { qualifies: true, daysAhead: diffDays };
    }
  }

  return { qualifies: false, daysAhead: 0 };
}

export function OrderSummaryCard({
  trips,
  totalPassengers,
  grandTotal,
  feesPercentage,
  isSaving = false,
  onProceedToCheckout,
  onAddToCart,
  onBackToDetails,
}: OrderSummaryCardProps) {
  const calculateTripSubtotal = (trip: Trip) => {
    const basePrice = trip.price;
    const nightSurcharge = trip.night_surcharge || 0;

    let addOnsTotal = 0;
    if (trip.add_ons && trip.add_ons.length > 0) {
      if (trip.add_ons.includes('explorer_upgrade')) {
        addOnsTotal = ADD_ON_PRICES['explorer_upgrade'];
      } else if (trip.add_ons.includes('flex_protection')) {
        addOnsTotal = ADD_ON_PRICES['flex_protection'];
      }
    }

    return basePrice + nightSurcharge + addOnsTotal;
  };

  const allTripsSubtotal = trips.reduce((sum, trip) => sum + calculateTripSubtotal(trip), 0);

  // Check for Early Bird discount
  const earlyBirdInfo = getEarlyBirdInfo(trips);
  const earlyBirdDiscount = earlyBirdInfo.qualifies ? allTripsSubtotal * EARLY_BIRD_DISCOUNT : 0;
  const subtotalAfterDiscount = allTripsSubtotal - earlyBirdDiscount;

  const totalFees = subtotalAfterDiscount * feesPercentage;
  const calculatedGrandTotal = subtotalAfterDiscount + totalFees;

  return (
    <Card className="shadow-lg">
      {/* Header - Título y trips en la misma línea */}
      <CardHeader className="border-b border-gray-200 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Order Summary</CardTitle>
          <span className="text-base font-bold text-blue-600">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Trip Info + Passengers */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Total Passengers</span>
            <span className="font-semibold text-gray-900">{totalPassengers}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Number of Trips</span>
            <span className="font-semibold text-gray-900">{trips.length}</span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200" />

        {/* Price Breakdown */}
        <div className="space-y-2.5">
          {trips.map((trip, index) => {
            const basePrice = trip.price;
            const nightSurcharge = trip.night_surcharge || 0;

            let addOnsTotal = 0;
            let addOnName = '';
            if (trip.add_ons && trip.add_ons.length > 0) {
              if (trip.add_ons.includes('explorer_upgrade')) {
                addOnsTotal = ADD_ON_PRICES['explorer_upgrade'];
                addOnName = ADD_ON_NAMES['explorer_upgrade'];
              } else if (trip.add_ons.includes('flex_protection')) {
                addOnsTotal = ADD_ON_PRICES['flex_protection'];
                addOnName = ADD_ON_NAMES['flex_protection'];
              }
            }

            return (
              <div key={trip.id}>
                {trips.length > 1 && (
                  <p className="text-xs font-bold text-gray-900 mb-2">Trip {index + 1}</p>
                )}

                {/* Base Price */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-700">Base Price</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(basePrice)}</span>
                </div>

                {/* Night Surcharge */}
                {nightSurcharge > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                      <Moon className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-xs text-gray-700">Night Surcharge</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      +{formatCurrency(nightSurcharge)}
                    </span>
                  </div>
                )}

                {/* Add-ons */}
                {addOnsTotal > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-xs text-gray-700">{addOnName}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      +{formatCurrency(addOnsTotal)}
                    </span>
                  </div>
                )}

                {/* Separator between trips */}
                {trips.length > 1 && index < trips.length - 1 && (
                  <div className="border-t border-gray-100 my-3" />
                )}
              </div>
            );
          })}
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200" />

        {/* Subtotal & Fees */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">Subtotal</span>
            <span className={`text-base font-bold ${earlyBirdInfo.qualifies ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {formatCurrency(allTripsSubtotal)}
            </span>
          </div>

          {/* Early Bird Discount */}
          {earlyBirdInfo.qualifies && (
            <div className="flex justify-between items-center bg-green-50 -mx-4 px-4 py-2 border-y border-green-200">
              <div className="flex items-center gap-1.5">
                <Bird className="h-4 w-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">
                  Early Bird Discount (10% off)
                </span>
              </div>
              <span className="text-sm font-bold text-green-600">
                -{formatCurrency(earlyBirdDiscount)}
              </span>
            </div>
          )}

          {/* Subtotal after discount (only show if discount applied) */}
          {earlyBirdInfo.qualifies && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Discounted Subtotal</span>
              <span className="text-base font-bold text-green-600">{formatCurrency(subtotalAfterDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600">Service Fee ({(feesPercentage * 100).toFixed(0)}%)</span>
              <div className="relative group">
                <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-2.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
                  <p>Includes payment processing, booking management, and dedicated customer support.</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600">
              +{formatCurrency(totalFees)}
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200" />

        {/* Total Amount */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(calculatedGrandTotal)}
            </span>
          </div>
        </div>

        {/* Actions - Sin checkbox de términos */}
        <div className="space-y-2.5">
          <Button
            onClick={onProceedToCheckout}
            disabled={isSaving}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          <Button
            onClick={onAddToCart}
            disabled={isSaving}
            variant="outline"
            className="w-full h-11 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add & Book Another Ride
              </>
            )}
          </Button>

          <Button
            onClick={onBackToDetails}
            disabled={isSaving}
            variant="ghost"
            className="w-full h-11 text-gray-600 hover:text-gray-900 text-sm font-medium transition-all disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
