// src/components/booking/details/FlightInfoCard.tsx
import { Plane } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ValidationErrors } from '@/utils/bookingValidation';

interface FlightInfoCardProps {
  isPickupFromAirport: boolean;
  airline: string;
  flightNumber: string;
  errors: ValidationErrors;
  onAirlineChange: (value: string) => void;
  onFlightNumberChange: (value: string) => void;
}

export function FlightInfoCard({
  isPickupFromAirport,
  airline,
  flightNumber,
  errors,
  onAirlineChange,
  onFlightNumberChange,
}: FlightInfoCardProps) {
  return (
    <Card className="notranslate" translate="no">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Plane className="h-5 w-5 text-blue-600" />
          Flight Information
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Optional but helps us track your arrival
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {isPickupFromAirport && (
          <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
            <Plane className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900">
              We monitor your flight in real-time and adjust for any delays
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="airline" className="text-sm">
            Airline
          </Label>
          <Input
            id="airline"
            placeholder="e.g., United Airlines"
            value={airline}
            onChange={(e) => onAirlineChange(e.target.value)}
            className="min-h-[44px] md:min-h-[48px]"
          />
        </div>

        <div>
          <Label htmlFor="flight_number" className="text-sm">
            Flight Number
          </Label>
          <Input
            id="flight_number"
            placeholder="e.g., UA 1234"
            value={flightNumber}
            onChange={(e) => onFlightNumberChange(e.target.value)}
            className={`min-h-[44px] md:min-h-[48px] ${errors.flight_number ? 'border-red-500' : ''}`}
          />
          {errors.flight_number && (
            <p className="text-xs text-red-600 mt-1">{errors.flight_number}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
