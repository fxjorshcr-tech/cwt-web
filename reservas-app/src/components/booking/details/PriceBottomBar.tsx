// src/components/booking/details/PriceBottomBar.tsx
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PriceCalculation {
  basePrice: number;
  nightSurcharge: number;
  addOnsPrice: number;
  finalPrice: number;
}

interface PriceBottomBarProps {
  currentTripIndex: number;
  totalTrips: number;
  priceCalculation: PriceCalculation;
  saving: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function PriceBottomBar({
  currentTripIndex,
  totalTrips,
  priceCalculation,
  saving,
  onBack,
  onNext,
}: PriceBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-blue-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Mobile: Vertical layout */}
        <div className="block md:hidden space-y-3">
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                Trip {currentTripIndex + 1}/{totalTrips}
              </span>
              <span className="font-semibold text-gray-900">
                Base: ${priceCalculation.basePrice}
              </span>
            </div>
            {priceCalculation.nightSurcharge > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-amber-700">Night Surcharge</span>
                <span className="text-amber-700 font-semibold">
                  +${priceCalculation.nightSurcharge}
                </span>
              </div>
            )}
            {priceCalculation.addOnsPrice > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-green-700">Add-ons</span>
                <span className="text-green-700 font-semibold">
                  +${priceCalculation.addOnsPrice}
                </span>
              </div>
            )}
            <div className="pt-1.5 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ${priceCalculation.finalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 min-h-[48px] text-sm"
              disabled={saving}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <Button
              onClick={onNext}
              disabled={saving}
              className="flex-[2] min-h-[48px] bg-blue-600 hover:bg-blue-700 text-sm font-bold"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  {currentTripIndex < totalTrips - 1 ? 'Next Trip' : 'Summary'}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden md:flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Trip {currentTripIndex + 1} of {totalTrips}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${priceCalculation.finalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 border-l border-gray-300 pl-6">
              <div>
                <span className="text-gray-500">Base: </span>
                <span className="font-semibold">${priceCalculation.basePrice}</span>
              </div>
              {priceCalculation.nightSurcharge > 0 && (
                <div>
                  <span className="text-amber-600">Night: </span>
                  <span className="font-semibold text-amber-600">
                    +${priceCalculation.nightSurcharge}
                  </span>
                </div>
              )}
              {priceCalculation.addOnsPrice > 0 && (
                <div>
                  <span className="text-green-600">Add-ons: </span>
                  <span className="font-semibold text-green-600">
                    +${priceCalculation.addOnsPrice}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="min-h-[50px] px-6"
              disabled={saving}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={onNext}
              disabled={saving}
              className="min-h-[50px] px-8 bg-blue-600 hover:bg-blue-700 font-bold"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  {currentTripIndex < totalTrips - 1
                    ? 'Save & Next Trip'
                    : 'Continue to Summary'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
