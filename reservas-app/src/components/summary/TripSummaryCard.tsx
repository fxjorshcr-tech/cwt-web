// src/components/summary/TripSummaryCard.tsx
import { Calendar, Users, MapPin, Clock, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Trip {tripNumber} of {totalTrips}
        </CardTitle>
        <CardDescription>
          {trip.from_location} → {trip.to_location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{formatDate(trip.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Pickup Time</p>
              <p className="font-semibold">{formatTime(trip.pickup_time)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Passengers</p>
            <p className="font-semibold">
              {trip.adults} Adult{trip.adults !== 1 ? 's' : ''}
              {trip.children > 0 && `, ${trip.children} Child${trip.children !== 1 ? 'ren' : ''}`}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pickup Address</p>
            <p className="font-medium">{trip.pickup_address || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Drop-off Address</p>
            <p className="font-medium">{trip.dropoff_address || 'N/A'}</p>
          </div>
        </div>

        {(trip.airline || trip.flight_number) && (
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-semibold text-gray-700">Flight Information</p>
            <div className="grid md:grid-cols-2 gap-2">
              {trip.airline && (
                <div>
                  <p className="text-sm text-gray-500">Airline</p>
                  <p className="font-medium">{trip.airline}</p>
                </div>
              )}
              {trip.flight_number && (
                <div>
                  <p className="text-sm text-gray-500">Flight Number</p>
                  <p className="font-medium">{trip.flight_number}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {trip.add_ons && trip.add_ons.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-semibold text-gray-700">Add-ons</p>
            <ul className="space-y-1">
              {trip.add_ons.map((addonId) => (
                <li key={addonId} className="flex items-center gap-2 text-sm">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  <span>{addOnNames[addonId] || addonId}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {trip.special_requests && (
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-semibold text-gray-700">Special Requests</p>
            <p className="text-sm text-gray-600">{trip.special_requests}</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Trip Price:</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(trip.final_price || trip.price)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
