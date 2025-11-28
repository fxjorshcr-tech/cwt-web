// src/components/booking/details/PickupDetailsCard.tsx
import { MapPin, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimePicker } from '@/components/forms/TimePicker';
import { ValidationErrors } from '@/utils/bookingValidation';

interface PickupDetailsCardProps {
  fromLocation: string;
  isPickupFromAirport: boolean;
  isDropoffToAirport: boolean;
  pickupAddress: string;
  pickupTime: string;
  duration?: string | null;
  errors: ValidationErrors;
  nightSurcharge: number;
  onPickupAddressChange: (value: string) => void;
  onPickupTimeChange: (value: string) => void;
}

const parseDuration = (duration: string | null | undefined): string => {
  if (!duration) return '2-3';
  const match = duration.match(/(\d+\.?\d*)/);
  return match ? match[1] : '2-3';
};

export function PickupDetailsCard({
  fromLocation,
  isPickupFromAirport,
  isDropoffToAirport,
  pickupAddress,
  pickupTime,
  duration,
  errors,
  nightSurcharge,
  onPickupAddressChange,
  onPickupTimeChange,
}: PickupDetailsCardProps) {
  return (
    <Card className="notranslate" translate="no">
      <CardHeader className="pb-4">
        <CardTitle className="text-base md:text-lg">Pickup Details</CardTitle>
        <CardDescription className="text-xs md:text-sm flex items-center gap-2 flex-wrap">
          <span>Where should we pick you up in</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 rounded-md border border-blue-200">
            <MapPin className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-bold text-blue-900">{fromLocation}</span>
          </span>
          <span>?</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        <div>
          <Label htmlFor="pickup_address" className="text-sm">
            {isPickupFromAirport ? 'Meeting Point at Airport' : 'Pickup Address'}{' '}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="pickup_address"
            placeholder={
              isPickupFromAirport
                ? "e.g., Main Gate, or specific meeting point near the airport"
                : "Enter full pickup address"
            }
            value={pickupAddress}
            onChange={(e) => onPickupAddressChange(e.target.value)}
            className={`min-h-[44px] md:min-h-[48px] ${errors.pickup_address ? 'border-red-500' : ''}`}
          />
          {errors.pickup_address && (
            <p className="text-xs text-red-600 mt-1">{errors.pickup_address}</p>
          )}
        </div>

        <div>
          <Label htmlFor="pickup_time" className="text-sm">
            Pickup Time <span className="text-red-500">*</span>
          </Label>
          <TimePicker value={pickupTime} onChange={onPickupTimeChange} />
          {errors.pickup_time && (
            <p className="text-xs text-red-600 mt-1">{errors.pickup_time}</p>
          )}

          {nightSurcharge > 0 && (
            <div className="flex items-start gap-2 mt-2 p-2 md:p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm">
                <p className="font-semibold text-amber-900">Night Surcharge Applied</p>
                <p className="text-amber-700">
                  Pickups 9 PM - 4 AM: +${nightSurcharge.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {isDropoffToAirport && (
            <div className="flex items-start gap-2 mt-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg">
              <Info className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-orange-900">
                <p className="font-semibold">Airport Drop-off Reminder</p>
                <p>
                  Trip duration: ~{parseDuration(duration)} hrs. Plan to arrive 3+ hours before
                  your flight.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
