// src/app/summary/page.tsx
// ✅ FINAL - Un solo botón: Add to Cart & Continue

'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar, Users, MapPin, Clock, Loader2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

import { formatDate, formatTime, formatCurrency } from '@/lib/formatters';
import { PRICING_CONFIG } from '@/lib/pricing-config';

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

function SummaryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { addItem } = useCart();

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
        toast.error('Failed to load booking summary');
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

  const handleAddToCartAndContinue = () => {
    trips.forEach((trip, index) => {
      addItem({
        type: 'shuttle',
        id: trip.id,
        bookingId: trip.booking_id,
        fromLocation: trip.from_location,
        toLocation: trip.to_location,
        date: formatDate(trip.date),
        pickupTime: formatTime(trip.pickup_time),
        adults: trip.adults,
        children: trip.children,
        price: trip.price,
        finalPrice: trip.final_price || trip.price,
        tripNumber: trips.length > 1 ? index + 1 : undefined,
        totalTrips: trips.length > 1 ? trips.length : undefined,
      });
    });
    
    toast.success(`${trips.length} shuttle${trips.length > 1 ? 's' : ''} added to cart!`);
    router.push('/transfers');
  };

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

      <section className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image
          src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
          alt="Costa Rica Beach"
          fill
          className="object-cover"
          style={{ objectPosition: '50% 65%' }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
              Review Your Booking
            </h1>
            <p className="text-lg md:text-xl drop-shadow-md">
              Please review all details before proceeding to payment
            </p>
          </div>
        </div>
      </section>

      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <BookingStepper currentStep={2} />
          </div>
        </div>

        <div className="py-12">
          <div className="max-w-5xl mx-auto px-4">

            <div className="grid lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 space-y-6">
                
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

                      <div className="pt-4 border-t space-y-2">
                        {trips.map((trip, index) => {
                          const basePrice = trip.price;
                          const nightSurcharge = trip.night_surcharge || 0;
                          const addOnsTotal = trip.add_ons && trip.add_ons.length > 0
                            ? trip.add_ons.reduce((sum, addonId) => {
                                const prices: Record<string, number> = {
                                  tico_time: 160,
                                  flex_time: 45,
                                };
                                return sum + (prices[addonId] || 0);
                              }, 0)
                            : 0;

                          return (
                            <div key={trip.id} className="space-y-1.5">
                              {trips.length > 1 && (
                                <p className="text-xs font-semibold text-gray-700 mb-1">
                                  Trip {index + 1}
                                </p>
                              )}
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Base Price</span>
                                <span className="font-semibold">{formatCurrency(basePrice)}</span>
                              </div>
                              {nightSurcharge > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-amber-600">Night Surcharge</span>
                                  <span className="font-semibold text-amber-600">+{formatCurrency(nightSurcharge)}</span>
                                </div>
                              )}
                              {addOnsTotal > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-green-600">Add-ons</span>
                                  <span className="font-semibold text-green-600">+{formatCurrency(addOnsTotal)}</span>
                                </div>
                              )}
                              {trips.length > 1 && (
                                <div className="flex justify-between text-sm pt-1 border-t border-gray-100">
                                  <span className="text-gray-700 font-medium">Trip Subtotal</span>
                                  <span className="font-semibold">{formatCurrency(trip.final_price || trip.price)}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
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

                      <div className="pt-4 space-y-3">
                        <Button
                          onClick={() => {
                            toast.info('WeTravel payment integration - Coming soon!');
                          }}
                          className="w-full min-h-[48px] bg-green-600 hover:bg-green-700"
                          size="lg"
                        >
                          💳 Pay Now
                        </Button>

                        <Button
                          onClick={handleAddToCartAndContinue}
                          variant="outline"
                          className="w-full min-h-[48px] border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add & Book Another Ride
                        </Button>

                        <Button
                          onClick={() => router.push(`/booking-details?booking_id=${bookingId}&trip=0&from=summary`)}
                          variant="ghost"
                          className="w-full min-h-[48px] text-gray-600"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Details
                        </Button>
                      </div>

                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-cyan-900">What's Included?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-600 mt-0.5">🚐</span>
                        <span className="text-gray-700">Spacious Van with Full A/C</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-600 mt-0.5">👥</span>
                        <span className="text-gray-700">Personalized Meet & Greet at airport</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-600 mt-0.5">🚪</span>
                        <span className="text-gray-700">Door-to-Door Private Service</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-600 mt-0.5">📶</span>
                        <span className="text-gray-700">Free Onboard Wi-Fi & Bottled Water</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-600 mt-0.5">👨‍✈️</span>
                        <span className="text-gray-700">Professional, Bilingual Driver</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-cyan-600 mt-0.5">💎</span>
                        <span className="text-gray-700">All-Inclusive Rates, No Hidden Fees</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-gray-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-gray-900">Important Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600 mt-0.5">🧳</span>
                        <span className="text-gray-700">1 large bag + 1 carry-on per person.</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-orange-600 mt-0.5">⏱️</span>
                        <span className="text-gray-700">One complimentary 1-hour stop included.</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 mt-0.5">👶</span>
                        <span className="text-gray-700">Baby car seats & boosters included free of charge.</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-red-600 mt-0.5">🚫</span>
                        <span className="text-gray-700">No refund for cancellations within 48 hours of pickup.</span>
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