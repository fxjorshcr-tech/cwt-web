// src/app/confirmation/page.tsx
// ✅ CONFIRMATION PAGE - Final landing page (Step 4)
'use client';

import { useEffect, useState, Suspense, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Calendar, Users, MapPin, Mail, Phone, User, Loader2, Home, Download, PartyPopper, PawPrint, Heart, Dog } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import { useCart } from '@/contexts/CartContext';

import { formatDate, formatTime, formatCurrency, formatBookingId } from '@/lib/formatters';

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
  pickup_address: string | null;
  dropoff_address: string | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
}

function ConfirmationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  // Create supabase client once with useMemo to avoid recreation on every render
  const supabase = useMemo(() => createClient(), []);

  const bookingId = searchParams.get('booking_id');

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Clear cart when confirmation page loads successfully
  useEffect(() => {
    if (bookingId && trips.length > 0) {
      clearCart();
    }
  }, [bookingId, trips.length, clearCart]);

  // Memoize the loadTrips function
  const loadTrips = useCallback(async () => {
    if (!bookingId) {
      router.push('/');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('No trips found');

      setTrips(data as Trip[]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trips:', error);
      router.push('/');
    }
  }, [bookingId, supabase, router]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

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

  // ✅ CORREGIDO: Mostrar loading ANTES de acceder a trips
  if (loading) {
    return (
      <>
        <BookingNavbar />
        {/* Hero Skeleton - Same height as real hero (h-48 sm:h-56 md:h-64) with z-index */}
        <section className="relative z-10 h-48 sm:h-56 md:h-64 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-600 via-green-500 to-green-700 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="h-8 w-48 bg-white/30 rounded-lg mx-auto mb-2 animate-pulse" />
              <div className="h-5 w-56 bg-white/20 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </section>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  // ✅ CORREGIDO: Validar que trips tenga elementos antes de acceder
  if (trips.length === 0) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Booking Not Found</CardTitle>
              <CardDescription>We couldn&apos;t find your booking details</CardDescription>
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

  // ✅ Ahora es seguro acceder a trips porque ya verificamos que no está vacío
  const grandTotal = trips.reduce((sum, trip) => sum + (trip.final_price || trip.price), 0);
  const customerInfo = trips[0];

  return (
    <>
      <BookingNavbar />

      {/* Hero Section - Confirmation - FORCED VISIBILITY with z-index */}
      <section className="relative z-10 h-48 sm:h-56 md:h-64 w-full overflow-hidden">
        <Image
          src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
          alt="Booking Confirmed"
          fill
          className="object-cover"
          style={{ objectPosition: '50% 65%' }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PartyPopper className="h-5 w-5 sm:h-6 sm:w-6" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">
                Booking Confirmed!
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg drop-shadow-md">
              Your Costa Rica adventure awaits
            </p>
          </div>
        </div>
      </section>

      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">

        {/* Stepper - Step 5: Confirmation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <BookingStepper currentStep={5} />
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            
            {/* Success Header with Animation */}
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-in zoom-in duration-500 delay-150">
                <CheckCircle className="h-16 w-16 text-green-600 animate-in zoom-in duration-700 delay-300" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                ¡Congratulations!
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-2 animate-in fade-in duration-700 delay-300">
                Your booking has been confirmed
              </p>
              
              <p className="text-lg text-gray-500 animate-in fade-in duration-700 delay-400">
                Get ready for an amazing Costa Rica adventure!
              </p>
            </div>

            {/* Booking ID Card */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Your Booking Reference</p>
                  <p className="text-3xl md:text-4xl font-mono font-bold text-blue-900 mb-3">
                    {formatBookingId(bookingId)}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Please save this reference number for your records
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            {customerInfo && (
              <Card className="mb-8 animate-in fade-in slide-in-from-left duration-700 delay-600">
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
                        <p className="font-semibold">
                          {customerInfo.customer_first_name} {customerInfo.customer_last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold break-all">{customerInfo.customer_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold">{customerInfo.customer_phone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trips Summary */}
            <Card className="mb-8 animate-in fade-in slide-in-from-right duration-700 delay-700">
              <CardHeader>
                <CardTitle>Your Trip Details</CardTitle>
                <CardDescription>{trips.length} confirmed trip{trips.length !== 1 ? 's' : ''}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {trips.map((trip, index) => (
                  <div key={trip.id} className={`${index > 0 ? 'pt-6 border-t' : ''}`}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {trip.from_location} → {trip.to_location}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3 mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(trip.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{trip.adults} Adult{trip.adults !== 1 ? 's' : ''}{trip.children > 0 && `, ${trip.children} Child${trip.children !== 1 ? 'ren' : ''}`}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>Pickup: {formatTime(trip.pickup_time)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(trip.final_price || trip.price)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Pickup & Dropoff Addresses */}
                    {(trip.pickup_address || trip.dropoff_address) && (
                      <div className="mt-3 grid md:grid-cols-2 gap-3">
                        {trip.pickup_address && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-xs text-green-600 font-medium mb-1">Pickup Address</p>
                            <p className="text-sm font-medium text-gray-800">{trip.pickup_address}</p>
                          </div>
                        )}
                        {trip.dropoff_address && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-600 font-medium mb-1">Dropoff Address</p>
                            <p className="text-sm font-medium text-gray-800">{trip.dropoff_address}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Paid</span>
                    <span className="text-3xl font-bold text-green-600">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-800">
              <CardHeader>
                <CardTitle className="text-green-900">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Confirmation Email Sent</h4>
                    <p className="text-sm text-green-700">
                      Check your inbox at <strong>{customerInfo?.customer_email}</strong> for your booking details and receipt.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Need Assistance?</h4>
                    <p className="text-sm text-green-700">
                      Contact us anytime at <a href="mailto:mybooking@cantwaittravelcr.com" className="font-semibold underline">mybooking@cantwaittravelcr.com</a> or via <a href="https://wa.me/50685962438" className="font-semibold underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Day of Travel</h4>
                    <p className="text-sm text-green-700">
                      Be ready at your pickup location 10 minutes before scheduled time. Have a great trip!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="text-center space-y-4 animate-in fade-in duration-700 delay-900">
              <Button
                onClick={() => router.push('/')}
                size="lg"
                className="min-h-[52px] px-8"
              >
                <Home className="h-5 w-5 mr-2" />
                Return to Home
              </Button>

              <p className="text-sm text-gray-500">
                Need help? Contact us on <a href="https://wa.me/50685962438" className="text-green-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </p>
            </div>

            {/* Animal Love Badge with Dog */}
            <div className="mt-16 flex justify-center animate-in fade-in duration-700 delay-1000">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-full border border-amber-200/50 shadow-md hover:shadow-lg transition-shadow">
                <Dog className="h-6 w-6 text-amber-700" />
                <div className="flex items-center gap-2">
                  <PawPrint className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-800">We respect & love animals</span>
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  <PawPrint className="h-4 w-4 text-amber-500" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <>
        <BookingNavbar />
        {/* Hero Skeleton - Same height as real hero (h-48 sm:h-56 md:h-64) with z-index */}
        <section className="relative z-10 h-48 sm:h-56 md:h-64 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-600 via-green-500 to-green-700 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="h-8 w-48 bg-white/30 rounded-lg mx-auto mb-2 animate-pulse" />
              <div className="h-5 w-56 bg-white/20 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </section>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    }>
      <ConfirmationPageContent />
    </Suspense>
  );
}