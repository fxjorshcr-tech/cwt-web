// src/app/summary/page.tsx
// Summary page - Shows all trips before payment

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Clock,
  Loader2,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Plane,
  MessageSquare,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import { isAirport, calculateFees } from '@/utils/bookingValidation';
import { AVAILABLE_ADDONS } from '@/components/booking/TripAddOns';

/**
 * ==================== INTERFACES ====================
 */

interface Trip {
  id: string;
  booking_id: string;
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  children_ages: number[] | null;
  price: number;
  distance: number | null;
  duration: string | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  pickup_time: string | null;
  flight_number: string | null;
  airline: string | null;
  arrival_time: string | null;
  special_requests: string | null;
  night_surcharge: number | null;
  fees: number | null;
  final_price: number | null;
  add_ons: string[] | null;
  add_ons_price: number | null;
}

/**
 * Format time from 24h to 12h with AM/PM
 */
function formatTime(time24: string | null): string {
  if (!time24) return 'N/A';
  
  const [h, m] = time24.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return time24;
  
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * ==================== TRIP CARD COMPONENT ====================
 */

function TripCard({ trip, index }: { trip: Trip; index: number }) {
  const showFlightInfo = isAirport(trip.from_location) || isAirport(trip.to_location);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            Trip {index + 1}
          </CardTitle>
          <div className="text-lg font-bold text-blue-600">
            ${(trip.final_price || trip.price).toFixed(2)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Route Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">From</p>
                <p className="font-semibold text-gray-900">{trip.from_location}</p>
                {trip.pickup_address && (
                  <p className="text-sm text-gray-600 mt-1">{trip.pickup_address}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Pickup Time</p>
                <p className="font-semibold text-gray-900">{formatTime(trip.pickup_time)}</p>
                {trip.night_surcharge && trip.night_surcharge > 0 && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                    <AlertCircle className="h-3 w-3" />
                    Night surcharge applied
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">To</p>
                <p className="font-semibold text-gray-900">{trip.to_location}</p>
                {trip.dropoff_address && (
                  <p className="text-sm text-gray-600 mt-1">{trip.dropoff_address}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(trip.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 mx-auto text-gray-600 mb-1" />
            <p className="text-xs text-gray-600">Passengers</p>
            <p className="text-sm font-semibold text-gray-900">
              {trip.adults} adults
              {trip.children > 0 && `, ${trip.children} children`}
            </p>
            {trip.children > 0 && trip.children_ages && trip.children_ages.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Ages: {trip.children_ages.join(', ')}
              </p>
            )}
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 mx-auto text-gray-600 mb-1" />
            <p className="text-xs text-gray-600">Duration</p>
            <p className="text-sm font-semibold text-gray-900">
              {trip.duration || 'N/A'}
            </p>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <MapPin className="h-4 w-4 mx-auto text-gray-600 mb-1" />
            <p className="text-xs text-gray-600">Distance</p>
            <p className="text-sm font-semibold text-gray-900">
              {trip.distance ? `${trip.distance} km` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Flight Information */}
        {showFlightInfo && (trip.airline || trip.flight_number || trip.arrival_time) && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Flight Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-blue-50 rounded-lg p-3">
              {trip.airline && (
                <div>
                  <p className="text-xs text-gray-600">Airline</p>
                  <p className="text-sm font-semibold text-gray-900">{trip.airline}</p>
                </div>
              )}
              {trip.flight_number && (
                <div>
                  <p className="text-xs text-gray-600">Flight Number</p>
                  <p className="text-sm font-semibold text-gray-900">{trip.flight_number}</p>
                </div>
              )}
              {trip.arrival_time && (
                <div>
                  <p className="text-xs text-gray-600">
                    {isAirport(trip.to_location) ? 'Departure Time' : 'Arrival Time'}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatTime(trip.arrival_time)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Special Requests */}
        {trip.special_requests && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Special Requests</h4>
            </div>
            <p className="text-sm text-gray-700 bg-purple-50 rounded-lg p-3">
              {trip.special_requests}
            </p>
          </div>
        )}

        {/* Add-ons */}
        {trip.add_ons && trip.add_ons.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Add-ons Selected</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trip.add_ons.map((addonId) => {
                const addon = AVAILABLE_ADDONS.find(a => a.id === addonId);
                if (!addon) return null;
                const Icon = addon.icon;
                
                return (
                  <div key={addonId} className="flex items-center gap-3 bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{addon.name}</p>
                      <p className="text-xs text-gray-600">${addon.price}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
          <div className="space-y-2 bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Price:</span>
              <span className="font-semibold">${trip.price.toFixed(2)}</span>
            </div>

            {trip.night_surcharge && trip.night_surcharge > 0 && (
              <div className="flex justify-between text-sm text-amber-700">
                <span>Night Surcharge ($50):</span>
                <span className="font-semibold">+${trip.night_surcharge.toFixed(2)}</span>
              </div>
            )}

            {trip.add_ons_price && trip.add_ons_price > 0 && (
              <div className="flex justify-between text-sm text-purple-700">
                <span>Add-ons:</span>
                <span className="font-semibold">+${trip.add_ons_price.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fees (13%):</span>
              <span className="font-semibold">
                +${(trip.fees || calculateFees(trip.price + (trip.night_surcharge || 0) + (trip.add_ons_price || 0))).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-gray-300">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                ${(trip.final_price || trip.price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * ==================== MAIN COMPONENT ====================
 */

function SummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);

  const bookingId = searchParams.get('booking_id');

  const grandTotal = trips.reduce((sum, trip) => sum + (trip.final_price || trip.price), 0);
  const totalPassengers = trips.reduce((sum, trip) => sum + trip.adults + trip.children, 0);

  useEffect(() => {
    if (!bookingId) {
      console.error('❌ No booking_id in URL');
      router.push('/');
      return;
    }
    loadTrips();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [bookingId, router]);

  async function loadTrips() {
    try {
      setLoading(true);
      const supabase = createClient();

      console.log('🔄 Loading trips for summary:', bookingId);

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Supabase Error:', error);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        throw new Error('No trips found for this booking');
      }

      console.log('✅ Trips loaded for summary:', data);
      setTrips(data);
    } catch (error) {
      console.error('💥 Error loading trips:', error);
      alert('Error loading booking summary');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }

  function handleContinueToPayment() {
    console.log('🚀 Proceeding to payment...');
    router.push(`/payment?booking_id=${bookingId}`);
  }

  if (loading) {
    return (
      <>
        <BookingNavbar />
        <BookingStepper currentStep={2} />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your booking summary...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BookingNavbar />
      <BookingStepper currentStep={2} />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Booking Summary
            </h1>
            <p className="text-gray-600 text-sm">
              Review your transfer details before proceeding to payment
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600">Booking ID</p>
                <p className="font-mono text-sm font-bold text-gray-900">
                  ...{bookingId?.slice(-8)}
                </p>
              </div>
              <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600">Total Transfers</p>
                <p className="text-sm font-bold text-gray-900">{trips.length}</p>
              </div>
              <div className="px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600">Total Passengers</p>
                <p className="text-sm font-bold text-gray-900">{totalPassengers}</p>
              </div>
            </div>
          </div>

          {/* Trips List */}
          <div className="space-y-6 mb-8">
            {trips.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} index={index} />
            ))}
          </div>

          {/* Grand Total Card */}
          <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 sticky bottom-4 shadow-xl">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-0.5">
                    Total Amount
                  </h3>
                  <p className="text-xs text-gray-600">
                    {trips.length} transfer{trips.length > 1 ? 's' : ''} • {totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Grand Total</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${grandTotal.toFixed(2)}
                    </p>
                  </div>

                  <Button
                    onClick={handleContinueToPayment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-semibold shadow-lg"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Almost There!
                </p>
                <p className="text-sm text-blue-800">
                  Your booking details are saved. Click "Continue to Payment" to complete your reservation 
                  and receive instant confirmation via email. Our team monitors your flights and will 
                  be ready to welcome you on your travel dates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SummaryPage() {
  return (
    <Suspense
      fallback={
        <>
          <BookingNavbar />
          <BookingStepper currentStep={2} />
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        </>
      }
    >
      <SummaryContent />
    </Suspense>
  );
}