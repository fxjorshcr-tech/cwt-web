// src/app/summary/page.tsx
// ✅ SUMMARY PAGE - Review before payment (Step 2)
'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Users, MapPin, Clock, Loader2, Mail, Phone, User, ShoppingCart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';

import { formatDate, formatTime, formatCurrency } from '@/lib/formatters';
import { PRICING_CONFIG } from '@/lib/pricing-config';

// ============================================
// TYPES
// ============================================

interface Trip {
  id: string;
  booking_id: string;
  from_location: string;
  to_location: string;
  date: string;
  pickup_time: string;
  adults: number;
  children: number;
  price: number;
  final_price: number | null;
  night_surcharge: number | null;
  add_ons: string[] | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  flight_number: string | null;
  airline: string | null;
  special_requests: string | null;
  children_ages: number[] | null;
}

const ADD_ON_NAMES: Record<string, string> = {
  tico_time: 'Tico Time Upgrade',
  flex_time: 'Flex Time Protection',
};

// ============================================
// MAIN COMPONENT
// ============================================

function SummaryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const bookingId = searchParams.get('booking_id');

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  if (!bookingId) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Invalid Booking</CardTitle>
              <CardDescription>No booking ID provided</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/')} className="w-full min-h-[48px]">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  useEffect(() => {
    async function loadTrips() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('booking_id', bookingId as string)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) throw new Error('No trips found');

        setTrips(data as Trip[]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading trips:', error);
        alert('Failed to load booking summary');
        router.push('/');
      }
    }

    loadTrips();
  }, [bookingId, supabase, router]);

  const grandTotal = useMemo(
    () => trips.reduce((sum, trip) => sum + (trip.final_price || trip.price), 0),
    [trips]
  );

  const totalPassengers = useMemo(
    () => trips.reduce((sum, trip) => sum + trip.adults + trip.children, 0),
    [trips]
  );

  if (loading) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  if (trips.length === 0) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">No Trips Found</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/')} className="w-full min-h-[48px]">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <BookingNavbar />

      <main className="min-h-screen bg-gray-50">
        {/* Stepper - Step 2: Summary */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <BookingStepper currentStep={2} />
          </div>
        </div>

        <div className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Review Your Booking
              </h1>
              <p className="text-gray-600 text-lg">
                Please review all details before proceeding to payment
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* LEFT - Trip Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Trips */}
                {trips.map((trip, index) => (
                  <Card key={trip.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Trip {index + 1} of {trips.length}
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
                                <span>{ADD_ON_NAMES[addonId] || addonId}</span>
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
                ))}

              </div>

              {/* RIGHT - Price Summary (STICKY) */}
              <div className="lg:col-span-1">
                <div className="sticky top-[140px] space-y-6">
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                      <CardDescription>{trips.length} trip{trips.length !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Passengers</span>
                          <span className="font-semibold">{totalPassengers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Number of Trips</span>
                          <span className="font-semibold">{trips.length}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-gray-900">Total Amount</span>
                          <span className="text-3xl font-bold text-blue-600">
                            {formatCurrency(grandTotal)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          * Includes {(PRICING_CONFIG.FEES_PERCENTAGE * 100).toFixed(0)}% service fee
                        </p>
                      </div>

                      <div className="pt-4 space-y-2">
                        <Button
                          onClick={() => router.push(`/payment?booking_id=${bookingId}`)}
                          className="w-full min-h-[48px]"
                          size="lg"
                        >
                          Proceed to Payment
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>

                        <Button
                          onClick={() => router.push(`/booking-details?booking_id=${bookingId}&trip=0`)}
                          variant="outline"
                          className="w-full min-h-[48px]"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Details
                        </Button>
                      </div>

                    </CardContent>
                  </Card>

                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    }>
      <SummaryPageContent />
    </Suspense>
  );
}