// src/app/summary/page.tsx
// ✅ CORRECTED VERSION - Phase 1 fixes applied
'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, Users, MapPin, Clock, Loader2, CheckCircle, Mail, Phone, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';

// ✅ IMPORTS CORREGIDOS - Formatters centralizados
import { formatDate, formatTime, formatCurrency, formatBookingId } from '@/lib/formatters';
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
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_country: string | null;
  children_ages: number[] | null;
}

// ============================================
// ADD-ONS CONFIGURATION
// ============================================

const ADD_ON_NAMES: Record<string, string> = {
  extra_stop: 'Extra Stop',
  airport_assistance: 'Airport Assistance',
  wifi_hotspot: 'WiFi Hotspot',
  cooler_drinks: 'Cooler with Drinks',
};

// ============================================
// MAIN COMPONENT
// ============================================

function SummaryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // ✅ FIX CRÍTICO: Validar bookingId ANTES del render
  const bookingId = searchParams.get('booking_id');

  // ============================================
  // STATE
  // ============================================

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ VALIDACIÓN TEMPRANA
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
              <p className="text-sm text-gray-600 mb-4">
                Please return to the home page and start a new booking.
              </p>
              <Button onClick={() => router.push('/')} className="w-full">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // ============================================
  // LOAD TRIPS
  // ============================================

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

        if (!data || data.length === 0) {
          throw new Error('No trips found for this booking');
        }

        setTrips(data as Trip[]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading trips:', error);
        alert('Failed to load booking summary. Please try again.');
        router.push('/');
      }
    }

    loadTrips();
  }, [bookingId, supabase, router]);

  // ============================================
  // MEMOIZED CALCULATIONS - Performance optimization
  // ============================================

  // ✅ FIX: Usar useMemo para evitar cálculos redundantes
  const grandTotal = useMemo(
    () => trips.reduce((sum, trip) => sum + (trip.final_price || trip.price), 0),
    [trips]
  );

  const totalPassengers = useMemo(
    () => trips.reduce((sum, trip) => sum + trip.adults + trip.children, 0),
    [trips]
  );

  const customerInfo = useMemo(() => {
    const firstTrip = trips[0];
    if (!firstTrip) return null;

    return {
      name: [firstTrip.customer_first_name, firstTrip.customer_last_name].filter(Boolean).join(' ') || 'N/A',
      email: firstTrip.customer_email || 'N/A',
      phone: firstTrip.customer_phone || 'N/A',
      country: firstTrip.customer_country || 'N/A',
    };
  }, [trips]);

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your booking summary...</p>
          </div>
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
              <CardDescription>Unable to load your booking</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/')} className="w-full">
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <BookingNavbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 text-lg">
              Your reservation has been successfully created
            </p>
          </div>

          {/* Booking ID */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-blue-800 mb-2">Your Booking ID</p>
                <p className="text-2xl md:text-3xl font-mono font-bold text-blue-900">
                  {formatBookingId(bookingId)}
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Save this ID for your records
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LEFT - Trip Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Customer Information */}
              {customerInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-semibold">{customerInfo.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-semibold break-all">{customerInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-semibold">{customerInfo.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Country</p>
                          <p className="font-semibold">{customerInfo.country}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                    
                    {/* Date & Time */}
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

                    {/* Passengers */}
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

                    {/* Addresses */}
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

                    {/* Flight Info */}
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

                    {/* Add-ons */}
                    {trip.add_ons && trip.add_ons.length > 0 && (
                      <div className="space-y-2 pt-4 border-t">
                        <p className="text-sm font-semibold text-gray-700">Add-ons</p>
                        <ul className="space-y-1">
                          {trip.add_ons.map((addonId) => (
                            <li key={addonId} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>{ADD_ON_NAMES[addonId] || addonId}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Special Requests */}
                    {trip.special_requests && (
                      <div className="space-y-2 pt-4 border-t">
                        <p className="text-sm font-semibold text-gray-700">Special Requests</p>
                        <p className="text-sm text-gray-600">{trip.special_requests}</p>
                      </div>
                    )}

                  </CardContent>
                </Card>
              ))}

            </div>

            {/* RIGHT - Price Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                
                {/* Total Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                    <CardDescription>{trips.length} trip{trips.length !== 1 ? 's' : ''}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Stats */}
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

                    {/* Total Price */}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(grandTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        * Service fee ({(PRICING_CONFIG.FEES_PERCENTAGE * 100).toFixed(0)}%) included
                      </p>
                    </div>

                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900">What's Next?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Check Your Email</p>
                        <p className="text-xs text-green-700">
                          Confirmation sent to your email
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Payment Link</p>
                        <p className="text-xs text-green-700">
                          You'll receive a payment link via email or WhatsApp
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Save Your Booking ID</p>
                        <p className="text-xs text-green-700">
                          Keep your booking ID for reference
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Home
                </Button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ============================================
// SUSPENSE WRAPPER
// ============================================

export default function SummaryPage() {
  return (
    <Suspense fallback={
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    }>
      <SummaryPageContent />
    </Suspense>
  );
}