// src/app/checkout/page.tsx
// Página de checkout - billing info y redirige a Tilopay para pagar
'use client';

import { useEffect, useState, useMemo, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Loader2,
  CreditCard,
  Shield,
  ArrowLeft,
  Lock,
  Clock,
  Users,
  MapPin,
  Plane
} from 'lucide-react';
import { trackBeginCheckout } from '@/lib/analytics';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import TermsCheckbox from '@/components/booking/TermsCheckbox';
import { toast } from 'sonner';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { PRICING_CONFIG } from '@/lib/pricing-config';
import {
  checkExistingTrips,
  loadTripsFromSupabase,
  insertTripsWithRetry,
  type TripForSupabase,
} from '@/utils/supabaseHelpers';
import { loadBookingFromLocalStorage } from '@/utils/localStorageHelpers';

// Country codes with phone prefixes
const COUNTRIES = [
  { code: 'CR', name: 'Costa Rica', phonePrefix: '+506' },
  { code: 'US', name: 'United States', phonePrefix: '+1' },
  { code: 'CA', name: 'Canada', phonePrefix: '+1' },
  { code: 'MX', name: 'Mexico', phonePrefix: '+52' },
  { code: 'GT', name: 'Guatemala', phonePrefix: '+502' },
  { code: 'PA', name: 'Panama', phonePrefix: '+507' },
  { code: 'CO', name: 'Colombia', phonePrefix: '+57' },
  { code: 'ES', name: 'Spain', phonePrefix: '+34' },
  { code: 'UK', name: 'United Kingdom', phonePrefix: '+44' },
  { code: 'DE', name: 'Germany', phonePrefix: '+49' },
  { code: 'FR', name: 'France', phonePrefix: '+33' },
  { code: 'BR', name: 'Brazil', phonePrefix: '+55' },
  { code: 'AR', name: 'Argentina', phonePrefix: '+54' },
  { code: 'CL', name: 'Chile', phonePrefix: '+56' },
  { code: 'PE', name: 'Peru', phonePrefix: '+51' },
  { code: 'OTHER', name: 'Other', phonePrefix: '+' },
];

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

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
  add_ons_price: number | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  flight_number: string | null;
  airline: string | null;
  special_requests: string | null;
  children_ages: number[] | null;
  duration?: string | null;
  customer_first_name?: string | null;
  customer_last_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
}

interface TourBooking {
  id: string;
  booking_id: string;
  tour_slug: string;
  tour_name: string;
  date: string;
  adults: number;
  children: number;
  base_price: number;
  price_per_extra_person: number;
  total_price: number;
  hotel: string;
  special_requests: string | null;
  status: string;
  customer_first_name?: string | null;
  customer_last_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // ✅ Added null safety for searchParams
  const bookingId = searchParams?.get('booking_id');
  const tourBookingId = searchParams?.get('tour_booking_id');

  // Determine booking type
  const isTourBooking = !!tourBookingId;
  const effectiveBookingId = tourBookingId || bookingId;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [tourBooking, setTourBooking] = useState<TourBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Estado del formulario de cliente
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'US',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<CustomerInfo>>({});
  const hasTrackedCheckout = useRef(false);

  // Get current country's phone prefix
  const currentCountry = COUNTRIES.find(c => c.code === customerInfo.country) || COUNTRIES[0];

  // Cargar trips desde localStorage primero, luego Supabase como fallback
  useEffect(() => {
    async function loadBooking() {
      if (!effectiveBookingId) return;

      try {
        setLoading(true);

        if (isTourBooking) {
          // Load tour booking from tour_bookings table
          const { data: tourData, error: tourError } = await supabase
            .from('tour_bookings')
            .select('*')
            .eq('booking_id', tourBookingId)
            .single();

          if (tourError || !tourData) {
            console.error('Error loading tour booking:', tourError);
            toast.error('Booking not found. Please start over.');
            router.push('/private-tours');
            return;
          }

          setTourBooking(tourData as TourBooking);
          setLoading(false);
        } else {
          // First try to load from localStorage
          const localData = loadBookingFromLocalStorage(bookingId as string);

          if (localData && localData.trips && localData.trips.length > 0) {
            // Convert localStorage format to Trip format
            const localTrips: Trip[] = localData.trips.map((trip, index) => {
              const details = localData.tripDetails?.[index];
              const basePrice = trip.price || trip.calculatedPrice || 0;
              const fees = basePrice * PRICING_CONFIG.FEES_PERCENTAGE;
              const finalPrice = basePrice + fees;

              // Filter out null children ages
              const validChildrenAges = (details?.children_ages || []).filter((age: number | null): age is number => age !== null);

              return {
                id: `local_${index}`,
                booking_id: bookingId as string,
                from_location: trip.from_location,
                to_location: trip.to_location,
                date: trip.date,
                pickup_time: details?.pickup_time || '09:00',
                adults: trip.adults,
                children: trip.children || 0,
                price: basePrice,
                final_price: Math.round(finalPrice * 100) / 100,
                night_surcharge: details?.night_surcharge || 0,
                add_ons: details?.add_ons || null,
                add_ons_price: details?.add_ons_price || 0,
                pickup_address: details?.pickup_address || null,
                dropoff_address: details?.dropoff_address || null,
                flight_number: details?.flight_number || null,
                airline: details?.airline || null,
                special_requests: details?.special_requests || null,
                children_ages: validChildrenAges.length > 0 ? validChildrenAges : null,
                duration: trip.duration || null,
              };
            });

            setTrips(localTrips);
            setLoading(false);
            return;
          }

          // Fallback: Load from Supabase if localStorage is empty
          const existingTripIds = await checkExistingTrips(supabase, bookingId as string);

          if (existingTripIds.length === 0) {
            toast.error('Booking not found. Please start over.');
            router.push('/');
            return;
          }

          const loadedTrips = await loadTripsFromSupabase(supabase, bookingId as string);

          if (!loadedTrips || loadedTrips.length === 0) {
            toast.error('Failed to load booking. Please try again.');
            router.push('/');
            return;
          }

          setTrips(loadedTrips as Trip[]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading booking:', error);
        toast.error('Failed to load booking. Please start over.');
        router.push('/');
      }
    }

    loadBooking();
  }, [effectiveBookingId, isTourBooking, tourBookingId, bookingId, router, supabase]);

  // Track begin_checkout event when data is loaded
  // Single checkout event with all items combined
  useEffect(() => {
    if (loading || hasTrackedCheckout.current) return;

    const allItems: Array<{
      item_id: string;
      item_name: string;
      item_category: string;
      price: number;
      quantity: number;
    }> = [];
    let totalValue = 0;

    // Add tour item
    if (isTourBooking && tourBooking) {
      allItems.push({
        item_id: `tour_${tourBooking.booking_id}`,
        item_name: tourBooking.tour_name,
        item_category: 'Private Tour',
        price: tourBooking.total_price,
        quantity: 1,
      });
      totalValue += tourBooking.total_price;
    }

    // Add shuttle items
    if (!isTourBooking && trips.length > 0) {
      trips.forEach((trip, index) => {
        const price = trip.final_price || trip.price;
        allItems.push({
          item_id: `shuttle_${trip.booking_id}_${index}`,
          item_name: `${trip.from_location} → ${trip.to_location}`,
          item_category: 'Shuttle',
          price: price,
          quantity: 1,
        });
        totalValue += price;
      });
    }

    // Track single checkout event with all items
    if (allItems.length > 0) {
      trackBeginCheckout(allItems, totalValue);
      hasTrackedCheckout.current = true;
    }
  }, [loading, isTourBooking, tourBooking, trips]);

  const grandTotal = useMemo(() => {
    if (isTourBooking && tourBooking) {
      return tourBooking.total_price;
    }
    return trips.reduce((sum, trip) => sum + (trip.final_price || trip.price), 0);
  }, [isTourBooking, tourBooking, trips]);

  const totalPassengers = useMemo(() => {
    if (isTourBooking && tourBooking) {
      return tourBooking.adults + tourBooking.children;
    }
    return trips.reduce((sum, trip) => sum + trip.adults + trip.children, 0);
  }, [isTourBooking, tourBooking, trips]);

  const totalWithFees = useMemo(() => {
    // Tours don't have service fees - price is all-inclusive
    if (isTourBooking) {
      return grandTotal;
    }
    const fees = grandTotal * PRICING_CONFIG.FEES_PERCENTAGE;
    return grandTotal + fees;
  }, [isTourBooking, grandTotal]);

  // Validar formulario de cliente
  const validateCustomerForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (phoneNumber.length < 6) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    if (formErrors.phone) {
      setFormErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  // HANDLE PAY NOW
  const handlePayNow = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (!validateCustomerForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const fullPhone = `${currentCountry.phonePrefix} ${phoneNumber}`;
      const customerData = { ...customerInfo, phone: fullPhone };

      if (isTourBooking && tourBooking) {
        // Update customer info in tour_bookings table
        const { error: updateError } = await supabase
          .from('tour_bookings')
          .update({
            customer_first_name: customerData.firstName,
            customer_last_name: customerData.lastName,
            customer_email: customerData.email,
            customer_phone: customerData.phone,
            customer_country: customerData.country,
          })
          .eq('booking_id', tourBookingId as string);

        if (updateError) {
          console.error('Error updating tour customer info:', updateError);
        }

        // Llamar a la API de Tilopay for tour
        const response = await fetch('/api/tilopay/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: tourBookingId,
            bookingType: 'tour',
            amount: totalWithFees,
            currency: 'USD',
            tourBookingId: tourBooking.id,
            customerInfo: customerData,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to create payment');
        }

        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          throw new Error('No payment URL received');
        }
      } else {
        // Guardar información del cliente en Supabase (shuttles)
        const { error: updateError } = await supabase
          .from('trips')
          .update({
            customer_first_name: customerData.firstName,
            customer_last_name: customerData.lastName,
            customer_email: customerData.email,
            customer_phone: customerData.phone,
            customer_country: customerData.country,
          })
          .eq('booking_id', bookingId as string);

        if (updateError) {
          console.error('Error updating customer info:', updateError);
        }

        // Llamar a la API de Tilopay for shuttles
        const response = await fetch('/api/tilopay/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId,
            bookingType: 'shuttle',
            amount: totalWithFees,
            currency: 'USD',
            tripIds: trips.map(t => t.id),
            customerInfo: customerData,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to create payment');
        }

        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          throw new Error('No payment URL received');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  if (!effectiveBookingId) {
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

  if (loading) {
    return (
      <>
        <BookingNavbar />

        {/* Hero Skeleton */}
        <section className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-700 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="h-8 w-48 bg-white/30 rounded-lg mx-auto mb-2 animate-pulse" />
              <div className="h-5 w-56 bg-white/20 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </section>

        {/* Stepper Skeleton */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  <div className="hidden sm:block h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-6 sm:py-10 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!isTourBooking && trips.length === 0) {
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

  if (isTourBooking && !tourBooking) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Tour Booking Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/private-tours')} className="w-full min-h-[48px]">
                Browse Tours
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // ========================================
  // CHECKOUT - Formulario de pago
  // ========================================
  return (
    <>
      <BookingNavbar />

      {/* Hero Section */}
      <section className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden">
        <Image
          src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
          alt="Secure Checkout"
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
              <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">
                Secure Checkout
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg drop-shadow-md">
              Complete your booking in a few simple steps
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50">
        {/* Stepper - Only show for shuttle bookings */}
        {!isTourBooking && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
              <BookingStepper currentStep={2} />
            </div>
          </div>
        )}

        <div className="py-6 sm:py-10">
          <div className="max-w-4xl mx-auto px-4 space-y-6">

            {/* ============================================ */}
            {/* SECTION 1: ORDER SUMMARY - Full Width */}
            {/* ============================================ */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-white text-xl">Order Summary</CardTitle>
                <CardDescription className="text-blue-100">
                  Review your {isTourBooking ? 'tour' : trips.length > 1 ? 'transfers' : 'transfer'} details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">

                {/* Tour Booking */}
                {isTourBooking && tourBooking && (
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">{tourBooking.tour_name}</p>
                        <p className="text-sm text-gray-500 mt-1" suppressHydrationWarning>
                          {formatDate(tourBooking.date)} • {tourBooking.adults + tourBooking.children} passengers
                        </p>
                        <p className="text-sm text-gray-500">Pickup: {tourBooking.hotel}</p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(tourBooking.total_price)}</p>
                    </div>
                  </div>
                )}

                {/* Shuttle Trips - Beautiful Cards */}
                {!isTourBooking && trips.map((trip, index) => (
                  <div key={trip.id} className={`p-6 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                    {/* Trip Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                            {trips.length > 1 ? `Transfer ${index + 1}` : 'Transfer'}
                          </span>
                          <span className="text-xs text-gray-500" suppressHydrationWarning>
                            {formatDate(trip.date)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {trip.from_location}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <span>→</span>
                          <span className="font-medium text-gray-700">{trip.to_location}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(trip.final_price || trip.price)}
                        </p>
                        {trip.add_ons && trip.add_ons.length > 0 && (
                          <p className="text-xs text-green-600">+ Add-ons included</p>
                        )}
                      </div>
                    </div>

                    {/* Trip Details Grid - 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                      {/* Left Column */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Pickup Time</p>
                            <p className="text-sm font-semibold text-gray-900">{trip.pickup_time || 'Not set'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Users className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Passengers</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {trip.adults} adult{trip.adults !== 1 ? 's' : ''}
                              {trip.children > 0 && `, ${trip.children} child${trip.children !== 1 ? 'ren' : ''}`}
                            </p>
                          </div>
                        </div>

                        {trip.flight_number && (
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <Plane className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-medium">Flight</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {trip.airline ? `${trip.airline} ` : ''}{trip.flight_number}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Pickup</p>
                            <p className="text-sm font-semibold text-gray-900">{trip.pickup_address || 'Not specified'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-4 w-4 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Drop-off</p>
                            <p className="text-sm font-semibold text-gray-900">{trip.dropoff_address || 'Not specified'}</p>
                          </div>
                        </div>

                        {trip.add_ons && trip.add_ons.length > 0 && (
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <Shield className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-medium">Add-ons</p>
                              <div className="space-y-1 mt-1">
                                {trip.add_ons.includes('travel_flex') && (
                                  <div className="flex items-center gap-2">
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Travel Flex</span>
                                    <span className="text-xs text-gray-500">Free cancellation +$59</span>
                                  </div>
                                )}
                                {trip.add_ons.includes('explorer_upgrade') && (
                                  <div className="flex items-center gap-2">
                                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">Explorer</span>
                                    <span className="text-xs text-gray-500">Private vehicle +$195</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Totals Section */}
                <div className="bg-gray-50 border-t border-gray-200 p-6">
                  {!isTourBooking && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(grandTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Service Fee ({(PRICING_CONFIG.FEES_PERCENTAGE * 100).toFixed(0)}%)</span>
                        <span className="font-medium text-gray-600">+{formatCurrency(grandTotal * PRICING_CONFIG.FEES_PERCENTAGE)}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-blue-600">{formatCurrency(totalWithFees)}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1">Taxes and fees included</p>
                </div>
              </CardContent>
            </Card>

            {/* ============================================ */}
            {/* SECTION 2: BILLING & PAYMENT - Full Width */}
            {/* ============================================ */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-white text-xl">Billing & Payment</CardTitle>
                    <CardDescription className="text-green-100">
                      Enter your details to complete the payment
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">

                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                      placeholder="John"
                      disabled={isProcessingPayment}
                      className={`h-11 mt-1.5 ${formErrors.firstName ? 'border-red-500' : ''}`}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                      placeholder="Doe"
                      disabled={isProcessingPayment}
                      className={`h-11 mt-1.5 ${formErrors.lastName ? 'border-red-500' : ''}`}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    placeholder="john@example.com"
                    disabled={isProcessingPayment}
                    className={`h-11 mt-1.5 ${formErrors.email ? 'border-red-500' : ''}`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">We'll send your confirmation to this email</p>
                </div>

                {/* Country & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country" className="text-sm font-medium">Country *</Label>
                    <select
                      id="country"
                      value={customerInfo.country}
                      onChange={(e) => handleCustomerInfoChange('country', e.target.value)}
                      disabled={isProcessingPayment}
                      className="w-full h-11 mt-1.5 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.phonePrefix})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                    <div className="flex gap-2 mt-1.5">
                      <div className="flex items-center justify-center px-3 h-11 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium min-w-[60px]">
                        {currentCountry.phonePrefix}
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="8888 8888"
                        disabled={isProcessingPayment}
                        className={`flex-1 h-11 ${formErrors.phone ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-6">
                  {/* Terms Checkbox */}
                  <TermsCheckbox
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                    error={false}
                  />

                  {/* Pay Button */}
                  <Button
                    onClick={handlePayNow}
                    disabled={!termsAccepted || isProcessingPayment}
                    className="w-full h-14 mt-4 bg-green-600 hover:bg-green-700 text-white text-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-6 w-6 mr-2" />
                        Pay {formatCurrency(totalWithFees)}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-3">
                    You will be redirected to our secure payment provider
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>PCI Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>Visa/Mastercard</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>3D Secure</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back Button & ICT Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                onClick={() => {
                  if (isTourBooking) {
                    router.push('/private-tours');
                  } else {
                    router.push(`/preview?booking_id=${bookingId}`);
                  }
                }}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isTourBooking ? 'Back to Tours' : 'Back to Trip Details'}
              </Button>

              <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-gray-900">ICT Licensed #4121-2025</p>
                  <p className="text-[10px] text-gray-500">Costa Rica Tourism Board</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <>
          <BookingNavbar />
          <section className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-700 animate-pulse" />
          </section>
          <div className="py-6 sm:py-10 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          </div>
        </>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
