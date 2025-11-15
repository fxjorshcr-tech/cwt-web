// src/components/summary/OrderSummaryCard.tsx
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TermsCheckbox from '@/components/booking/TermsCheckbox';
import { formatCurrency } from '@/lib/formatters';

interface Trip {
  id: string;
  price: number;
  final_price: number | null;
  night_surcharge: number | null;
  add_ons: string[] | null;
}

interface OrderSummaryCardProps {
  trips: Trip[];
  totalPassengers: number;
  grandTotal: number;
  termsAccepted: boolean;
  feesPercentage: number;
  onTermsChange: (checked: boolean) => void;
  onPayNow: () => void;
  onAddToCart: () => void;
  onBackToDetails: () => void;
}

const ADD_ON_PRICES: Record<string, number> = {
  tico_time: 160,
  flex_time: 45,
};

export function OrderSummaryCard({
  trips,
  totalPassengers,
  grandTotal,
  termsAccepted,
  feesPercentage,
  onTermsChange,
  onPayNow,
  onAddToCart,
  onBackToDetails,
}: OrderSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          {trips.length} trip{trips.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Passengers</span>
            <span className="font-semibold">{totalPassengers}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Number of Trips</span>
            <span className="font-semibold">{trips.length}</span>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          {trips.map((trip, index) => {
            const basePrice = trip.price;
            const nightSurcharge = trip.night_surcharge || 0;
            const addOnsTotal =
              trip.add_ons && trip.add_ons.length > 0
                ? trip.add_ons.reduce((sum, addonId) => sum + (ADD_ON_PRICES[addonId] || 0), 0)
                : 0;

            return (
              <div key={trip.id} className="space-y-1.5">
                {trips.length > 1 && (
                  <p className="text-xs font-semibold text-gray-700 mb-1">Trip {index + 1}</p>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-semibold">{formatCurrency(basePrice)}</span>
                </div>
                {nightSurcharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600">Night Surcharge</span>
                    <span className="font-semibold text-amber-600">
                      +{formatCurrency(nightSurcharge)}
                    </span>
                  </div>
                )}
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Add-ons</span>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(addOnsTotal)}
                    </span>
                  </div>
                )}
                {trips.length > 1 && (
                  <div className="flex justify-between text-sm pt-1 border-t border-gray-100">
                    <span className="text-gray-700 font-medium">Trip Subtotal</span>
                    <span className="font-semibold">
                      {formatCurrency(trip.final_price || trip.price)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-gray-900">Total Amount</span>
            <span className="text-3xl font-bold text-blue-600">{formatCurrency(grandTotal)}</span>
          </div>
          <p className="text-xs text-gray-500">
            * Includes {(feesPercentage * 100).toFixed(0)}% service fee
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <TermsCheckbox checked={termsAccepted} onChange={onTermsChange} error={false} />

          <Button
            onClick={onPayNow}
            disabled={!termsAccepted}
            className="w-full min-h-[48px] bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            💳 Pay Now
          </Button>

          <Button
            onClick={onAddToCart}
            variant="outline"
            className="w-full min-h-[48px] border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add & Book Another Ride
          </Button>

          <Button
            onClick={onBackToDetails}
            variant="ghost"
            className="w-full min-h-[48px] text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
