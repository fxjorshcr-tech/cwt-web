// src/components/booking/details/TripSummaryCard.tsx
import { Calendar, Users, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/formatters';

interface TripSummaryCardProps {
  tripIndex: number;
  totalTrips: number;
  fromLocation: string;
  toLocation: string;
  date: string;
  adults: number;
  children: number;
}

export function TripSummaryCard({
  tripIndex,
  totalTrips,
  fromLocation,
  toLocation,
  date,
  adults,
  children,
}: TripSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <MapPin className="h-5 w-5 text-blue-600" />
          Trip {tripIndex + 1} of {totalTrips}
        </CardTitle>
        <CardDescription className="text-sm">
          {fromLocation} → {toLocation}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-semibold text-sm md:text-base">{formatDate(date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Users className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Passengers</p>
              <p className="font-semibold text-sm md:text-base">
                {adults} Adult{adults !== 1 ? 's' : ''}
                {children > 0 && `, ${children} Child${children !== 1 ? 'ren' : ''}`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
