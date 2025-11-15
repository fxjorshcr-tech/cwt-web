// src/components/booking/details/DropoffDetailsCard.tsx
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationErrors } from '@/utils/bookingValidation';

interface DropoffDetailsCardProps {
  toLocation: string;
  dropoffAddress: string;
  errors: ValidationErrors;
  onDropoffAddressChange: (value: string) => void;
}

export function DropoffDetailsCard({
  toLocation,
  dropoffAddress,
  errors,
  onDropoffAddressChange,
}: DropoffDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base md:text-lg">Drop-off Details</CardTitle>
        <CardDescription className="text-xs md:text-sm flex items-center gap-2 flex-wrap">
          <span>Where should we drop you off in</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 rounded-md border border-orange-200">
            <MapPin className="h-3 w-3 text-orange-600" />
            <span className="text-xs font-bold text-orange-900">{toLocation}</span>
          </span>
          <span>?</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="dropoff_address" className="text-sm">
            Drop-off Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dropoff_address"
            placeholder="Enter full drop-off address"
            value={dropoffAddress}
            onChange={(e) => onDropoffAddressChange(e.target.value)}
            className={`min-h-[44px] md:min-h-[48px] ${errors.dropoff_address ? 'border-red-500' : ''}`}
          />
          {errors.dropoff_address && (
            <p className="text-xs text-red-600 mt-1">{errors.dropoff_address}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
