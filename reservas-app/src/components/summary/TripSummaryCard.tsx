// src/components/summary/TripSummaryCard.tsx
import { MapPin, ShoppingCart, Plane, MessageSquare, Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <CardHeader className="pb-3 border-b bg-white">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <MapPin className="h-5 w-5 text-blue-600" />
          Trip {tripNumber} of {totalTrips}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Date, Time & Passengers */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <Calendar className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Date</p>
            <p className="font-semibold text-sm text-gray-900">{formatDate(trip.date)}</p>
          </div>

          <div>
            <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Pickup</p>
            <p className="font-semibold text-sm text-gray-900">{formatTime(trip.pickup_time)}</p>
          </div>

          <div>
            <Users className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-semibold text-sm text-gray-900">
              {trip.adults + trip.children} pax
            </p>
          </div>
        </div>

        {/* Pickup & Dropoff */}
        <div className="relative bg-gray-50 rounded-lg p-3 border border-gray-200">
          {/* Línea conectora */}
          <div className="absolute left-6 top-[42px] bottom-[42px] w-0.5 bg-gradient-to-b from-blue-400 to-orange-400" />
          
          {/* Pickup */}
          <div className="relative flex items-start gap-2 mb-4">
            <div className="bg-blue-600 rounded-full p-1.5 z-10">
              <MapPin className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold text-blue-700">PICKUP</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 rounded border border-blue-200">
                  <span className="text-xs font-semibold text-blue-900">{trip.from_location}</span>
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{trip.pickup_address}</p>
            </div>
          </div>

          {/* Dropoff */}
          <div className="relative flex items-start gap-2">
            <div className="bg-orange-600 rounded-full p-1.5 z-10">
              <MapPin className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold text-orange-700">DROP-OFF</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 rounded border border-orange-200">
                  <span className="text-xs font-semibold text-orange-900">{trip.to_location}</span>
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{trip.dropoff_address}</p>
            </div>
          </div>
        </div>

        {/* Flight Information */}
        {(trip.airline || trip.flight_number) && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-semibold text-gray-900">Flight Info</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {trip.airline && (
                <div>
                  <p className="text-xs text-gray-500">Airline</p>
                  <p className="font-medium text-gray-900">{trip.airline}</p>
                </div>
              )}
              {trip.flight_number && (
                <div>
                  <p className="text-xs text-gray-500">Flight #</p>
                  <p className="font-medium text-gray-900">{trip.flight_number}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {trip.add_ons && trip.add_ons.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-semibold text-gray-900">Add-ons</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {trip.add_ons.map((addon) => (
                <span
                  key={addon}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-medium text-gray-800"
                >
                  {addOnNames[addon] || addon}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Special Requests */}
        {trip.special_requests && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-semibold text-gray-900">Special Requests</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">{trip.special_requests}</p>
          </div>
        )}

        {/* Trip Price */}
        <div className="border-t pt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Trip Price:</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(trip.final_price || trip.price)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}