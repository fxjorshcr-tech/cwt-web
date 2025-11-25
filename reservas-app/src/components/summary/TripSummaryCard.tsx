// src/components/summary/TripSummaryCard.tsx
import { MapPin, ShoppingCart, Plane, MessageSquare, Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatTime, formatCurrency } from '@/lib/formatters';

interface Trip {
  id: string;
  from_location: string;
  to_location: string;
  date: string;
  pickup_time: string;
  adults: number;
  children: number;
  price: number;
  final_price: number | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  flight_number: string | null;
  airline: string | null;
  special_requests: string | null;
  add_ons: string[] | null;
}

interface TripSummaryCardProps {
  trip: Trip;
  tripNumber: number;
  totalTrips: number;
  addOnNames: Record<string, string>;
}

export function TripSummaryCard({ trip, tripNumber, totalTrips, addOnNames }: TripSummaryCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Header with route - Mobile responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
              {tripNumber}
            </div>
            <span className="text-white/80 text-xs">Transfer {tripNumber} of {totalTrips}</span>
          </div>
          <span className="text-white font-bold">{formatCurrency(trip.final_price || trip.price)}</span>
        </div>
        {/* Route - Vertical stack */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-2 w-2 text-white" />
            </div>
            <span className="text-white text-sm font-medium leading-tight">{trip.from_location}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-orange-400/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-2 w-2 text-orange-200" />
            </div>
            <span className="text-white text-sm font-medium leading-tight">{trip.to_location}</span>
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 pt-4">
        {/* Date, Time & Passengers */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <Calendar className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-[10px] text-gray-500 uppercase">Date</p>
            <p className="font-semibold text-xs text-gray-900">{formatDate(trip.date)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-2">
            <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-[10px] text-gray-500 uppercase">Pickup</p>
            <p className="font-semibold text-xs text-gray-900">{formatTime(trip.pickup_time)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-2">
            <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-[10px] text-gray-500 uppercase">Guests</p>
            <p className="font-semibold text-xs text-gray-900">{trip.adults + trip.children} pax</p>
          </div>
        </div>

        {/* Pickup & Dropoff */}
        <div className="relative bg-gray-50 rounded-lg p-3 border border-gray-200">
          {/* Línea conectora */}
          <div className="absolute left-5 top-[36px] bottom-[36px] w-0.5 bg-gradient-to-b from-blue-400 to-orange-400" />

          {/* Pickup */}
          <div className="relative flex items-start gap-3 mb-4">
            <div className="bg-blue-600 rounded-full p-1.5 z-10 flex-shrink-0">
              <MapPin className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Pickup</span>
              <p className="text-sm font-medium text-gray-900 break-words">{trip.pickup_address}</p>
            </div>
          </div>

          {/* Dropoff */}
          <div className="relative flex items-start gap-3">
            <div className="bg-orange-600 rounded-full p-1.5 z-10 flex-shrink-0">
              <MapPin className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-orange-700 uppercase">Drop-off</span>
              <p className="text-sm font-medium text-gray-900 break-words">{trip.dropoff_address}</p>
            </div>
          </div>
        </div>

        {/* Flight Information */}
        {(trip.airline || trip.flight_number) && (
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Plane className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="flex gap-4 text-sm">
              {trip.airline && (
                <div>
                  <span className="text-gray-500 text-xs">Airline:</span>
                  <span className="font-medium text-gray-900 ml-1">{trip.airline}</span>
                </div>
              )}
              {trip.flight_number && (
                <div>
                  <span className="text-gray-500 text-xs">Flight:</span>
                  <span className="font-medium text-gray-900 ml-1">{trip.flight_number}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {trip.add_ons && trip.add_ons.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <ShoppingCart className="h-4 w-4 text-purple-600 flex-shrink-0" />
            {trip.add_ons.map((addon) => (
              <span
                key={addon}
                className="inline-flex items-center px-2.5 py-1 bg-purple-100 border border-purple-200 rounded-full text-xs font-semibold text-purple-800"
              >
                {addOnNames[addon] || addon}
              </span>
            ))}
          </div>
        )}

        {/* Special Requests */}
        {trip.special_requests && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <MessageSquare className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{trip.special_requests}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}