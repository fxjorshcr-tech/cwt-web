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
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {tripIndex + 1}
            </div>
            <div>
              <CardTitle className="text-lg md:text-xl text-gray-900">
                Trip {tripIndex + 1}
                {totalTrips > 1 && <span className="text-gray-500 font-normal"> of {totalTrips}</span>}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</p>
          </div>
          <p className="text-sm md:text-base font-medium text-gray-900 leading-snug">
            {fromLocation}
          </p>
          <div className="flex items-center gap-2 my-2">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-gray-400 text-xs">→</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <p className="text-sm md:text-base font-medium text-gray-900 leading-snug">
            {toLocation}
          </p>
        </div>

        {/* Date and Passengers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</p>
            </div>
            <p className="font-semibold text-sm md:text-base text-gray-900" suppressHydrationWarning>{formatDate(date)}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Passengers</p>
            </div>
            <p className="font-semibold text-sm md:text-base text-gray-900">
              {adults} Adult{adults !== 1 ? 's' : ''}
              {children > 0 && `, ${children} Child${children !== 1 ? 'ren' : ''}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
