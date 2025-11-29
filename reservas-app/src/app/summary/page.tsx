// src/app/summary/page.tsx
// Flujo de pago integrado: formulario de cliente inline + confirmación en la misma página
'use client';

import { useEffect, useState, useMemo, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, Calendar, Users, MapPin, Mail, Phone, User, Home, Download, CreditCard, Shield } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import FAQModal from '@/components/booking/FAQModal';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

// Imports de componentes divididos
import {
  TripSummaryCard,
  FAQSection,
  OrderSummaryCard,
} from '@/components/summary';

import { formatDate, formatTime, formatCurrency, formatBookingId } from '@/lib/formatters';
import { PRICING_CONFIG } from '@/lib/pricing-config';
import {
  loadBookingFromLocalStorage,
  removeBookingFromLocalStorage,
  filterChildrenAges,
  type LocalStorageBooking,
} from '@/utils/localStorageHelpers';
import {
  checkExistingTrips,
  loadTripsFromSupabase,
  insertTripsWithRetry,
  prepareTripForSupabase,
} from '@/utils/supabaseHelpers';

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
  routeId?: number;
  customer_first_name?: string | null;
  customer_last_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  authCode: string;
  bookingId: string;
}

// Nombres de Add-ons
const ADD_ON_NAMES: Record<string, string> = {
  flex_protection: 'Flex Protection',
  explorer_upgrade: 'Explorer Upgrade',
};

const POPULAR_FAQS = [
  {
    question: 'What is your cancellation policy?',
    answer:
      'Cancellations made at least 48 hours before your scheduled pickup receive a full refund minus 13% taxes and fees. Cancellations within 48 hours are non-refundable. All cancellation requests must be sent by email to mybooking@cantwaittravelcr.com.',
  },
  {
    question: 'Where exactly will the driver meet me at the airport?',
    answer:
      'At SJO Airport: Your driver will meet you just outside the main exit doors with a sign displaying your name. At LIR Airport: Your driver will meet you in the arrivals area with a name sign. We send you driver contact information 24 hours before pickup so you can coordinate via WhatsApp if needed.',
  },
  {
    question: 'How much luggage can I bring?',
    answer:
      'Each passenger can bring: 1 large checked suitcase (up to 50 lbs/23 kg) plus 1 carry-on item (purse, backpack, small bag). Our vehicles have ample space for luggage. If you have oversized items or extra luggage, please inform us at booking.',
  },
  {
    question: 'Do you provide car seats for children?',
    answer:
      'Yes! We provide child car seats and booster seats FREE of charge. You must request them at the time of booking and specify the age/weight of each child. We have seats suitable for children 3 years and up.',
  },
  {
    question: 'What if my flight is delayed or cancelled?',
    answer:
      "Flight delays are not a problem! We monitor your flight status and adjust pickup times accordingly at no extra charge. If your flight is cancelled, please contact us immediately and we'll reschedule your transfer.",
  },
];

function SummaryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { addItem } = useCart();

  const bookingId = searchParams.get('booking_id');

  // Estado de la página: 'summary' o 'confirmation'
  const [pageMode, setPageMode] = useState<'summary' | 'confirmation'>('summary');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSavingToSupabase, setIsSavingToSupabase] = useState(false);

  // Estado del formulario de cliente (inline)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'US',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<CustomerInfo>>({});

  // Datos de confirmación del pago
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  // Get current country's phone prefix
  const currentCountry = COUNTRIES.find(c => c.code === customerInfo.country) || COUNTRIES[0];

  // Escuchar mensajes del popup de Tilopay
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar que el mensaje viene del popup de pago
      if (event.data && event.data.type === 'PAYMENT_COMPLETE') {
        const { success, transactionId, authCode, bookingId: paymentBookingId } = event.data;

        if (success) {
          setPaymentResult({
            success: true,
            transactionId: transactionId || '',
            authCode: authCode || '',
            bookingId: paymentBookingId || bookingId || '',
          });
          setPageMode('confirmation');
          setIsProcessingPayment(false);

          // Recargar trips desde Supabase para obtener la info actualizada
          loadTripsFromSupabase(supabase, paymentBookingId || bookingId || '').then((updatedTrips) => {
            if (updatedTrips && updatedTrips.length > 0) {
              setTrips(updatedTrips as Trip[]);
            }
          });
        } else {
          setIsProcessingPayment(false);
          toast.error('Payment failed. Please try again.');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [bookingId, supabase]);

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

  // LOAD FROM LOCALSTORAGE
  useEffect(() => {
    async function loadTrips() {
      try {
        setLoading(true);

        // Load booking from localStorage using helper
        const localData = loadBookingFromLocalStorage(bookingId as string);

        if (!localData) {
          throw new Error('Booking not found. Please start a new search.');
        }

        // Convert localStorage data to Trip format, filtering out incomplete trips
        const loadedTrips: Trip[] = localData.trips
          .map((trip, index) => {
            const details = localData.tripDetails?.[index];

            // Skip trips without details instead of throwing
            if (!details) {
              console.warn(`Trip ${index} missing details, skipping`);
              return null;
            }

            const filteredChildrenAges = filterChildrenAges(details.children_ages);

            const tripData: Trip = {
              id: `temp_${localData.bookingId}_${index}`,
              booking_id: localData.bookingId,
              from_location: trip.from_location || '',
              to_location: trip.to_location || '',
              date: trip.date || '',
              adults: trip.adults || 0,
              children: trip.children || 0,
              price: trip.price || 0,
              duration: trip.duration,
              routeId: trip.routeId,
              pickup_address: details.pickup_address || '',
              dropoff_address: details.dropoff_address || '',
              pickup_time: details.pickup_time || '',
              flight_number: details.flight_number || null,
              airline: details.airline || null,
              special_requests: details.special_requests || null,
              children_ages: filteredChildrenAges,
              add_ons: details.add_ons && details.add_ons.length > 0 ? details.add_ons : null,
              night_surcharge: details.night_surcharge ?? 0,
              add_ons_price: details.add_ons_price ?? 0,
              final_price: details.final_price ?? trip.price ?? 0,
            };

            return tripData;
          })
          .filter((trip): trip is Trip => trip !== null);

        // Check if any valid trips were loaded
        if (loadedTrips.length === 0) {
          throw new Error('No complete booking details found. Please complete all steps.');
        }

        setTrips(loadedTrips);
        setLoading(false);
      } catch (error) {
        console.error('Error loading booking:', error);
        toast.error('Failed to load booking summary. Please start over.');
        router.push('/');
      }
    }

    loadTrips();
  }, [bookingId, router]);

  const grandTotal = useMemo(
    () => trips.reduce((sum, trip) => sum + (trip.final_price || trip.price), 0),
    [trips]
  );

  const totalPassengers = useMemo(
    () => trips.reduce((sum, trip) => sum + trip.adults + trip.children, 0),
    [trips]
  );

  // Calcular total con fees
  const totalWithFees = useMemo(() => {
    const fees = grandTotal * PRICING_CONFIG.FEES_PERCENTAGE;
    return grandTotal + fees;
  }, [grandTotal]);

  // FUNCIÓN PARA GUARDAR EN SUPABASE
  const saveBookingToSupabase = async (): Promise<boolean> => {
    try {
      setIsSavingToSupabase(true);

      // Check if already exists in Supabase
      const existingTripIds = await checkExistingTrips(supabase, bookingId as string);

      if (existingTripIds.length > 0) {
        console.log('Booking already saved in Supabase, skipping insert');

        // Load full trips from Supabase
        const fullTrips = await loadTripsFromSupabase(supabase, bookingId as string);

        if (fullTrips && fullTrips.length > 0) {
          setTrips((prevTrips) =>
            prevTrips.map((trip, index) => ({
              ...trip,
              id: fullTrips[index]?.id || trip.id,
            }))
          );
        }

        setIsSavingToSupabase(false);
        return true;
      }

      // Prepare trips for Supabase insertion
      const tripsToInsert = trips.map((trip) => prepareTripForSupabase({
        booking_id: bookingId as string,
        from_location: trip.from_location,
        to_location: trip.to_location,
        date: trip.date,
        adults: trip.adults,
        children: trip.children,
        price: trip.price,
        duration: trip.duration,
        pickup_address: trip.pickup_address,
        dropoff_address: trip.dropoff_address,
        pickup_time: trip.pickup_time,
        flight_number: trip.flight_number,
        airline: trip.airline,
        special_requests: trip.special_requests,
        children_ages: trip.children_ages,
        add_ons: trip.add_ons,
        add_ons_price: trip.add_ons_price,
        night_surcharge: trip.night_surcharge,
        final_price: trip.final_price,
      }));

      // Insert with retry logic
      const insertedTrips = await insertTripsWithRetry(supabase, tripsToInsert);

      if (!insertedTrips) {
        throw new Error('Failed to save booking after retries');
      }

      // Update local state with real Supabase IDs
      if (insertedTrips.length > 0) {
        setTrips((prevTrips) =>
          prevTrips.map((trip, index) => ({
            ...trip,
            id: insertedTrips[index].id,
          }))
        );
      }

      // Clean up localStorage
      removeBookingFromLocalStorage(bookingId as string);

      setIsSavingToSupabase(false);
      return true;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      setIsSavingToSupabase(false);
      toast.error('Failed to save booking. Please try again.');
      return false;
    }
  };

  // HANDLE ADD TO CART - Guardar en Supabase primero
  const handleAddToCartAndContinue = async () => {
    // Guardar en Supabase
    const saved = await saveBookingToSupabase();

    if (!saved) {
      return; // Si falla, no continuar
    }

    // Agregar al carrito
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

  // Manejar cambios en campos de cliente
  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    if (formErrors.phone) {
      setFormErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  // HANDLE PAY NOW - Validar formulario y procesar pago con Tilopay
  const handlePayNow = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    // Validar formulario de cliente
    if (!validateCustomerForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Guardar en Supabase primero
    const saved = await saveBookingToSupabase();

    if (!saved) {
      return; // Si falla, no continuar
    }

    setIsProcessingPayment(true);

    try {
      // Combinar prefijo de teléfono con número
      const fullPhone = `${currentCountry.phonePrefix} ${phoneNumber}`;
      const customerData = { ...customerInfo, phone: fullPhone };

      // Guardar información del cliente en Supabase
      const { error: updateError } = await supabase
        .from('trips')
        .update({
          customer_first_name: customerData.firstName,
          customer_last_name: customerData.lastName,
          customer_email: customerData.email,
          customer_phone: customerData.phone,
          customer_country: customerData.country,
        })
        .eq('booking_id', bookingId);

      if (updateError) {
        console.error('Error updating customer info:', updateError);
      }

      // Llamar a la API de Tilopay
      const response = await fetch('/api/tilopay/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
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

      // Abrir Tilopay en popup centrado
      if (data.paymentUrl) {
        // Calcular posición centrada del popup
        const width = 500;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          data.paymentUrl,
          'TilopayPayment',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );

        // Si el popup fue bloqueado, redirigir normalmente
        if (!popup || popup.closed) {
          toast.info('Popup blocked. Redirecting to payment page...');
          window.location.href = data.paymentUrl;
          return;
        }

        // Monitorear el popup para cerrar cuando termine
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            // Si el popup se cerró pero no recibimos mensaje, podría ser que el usuario lo cerró manualmente
            setTimeout(() => {
              if (pageMode !== 'confirmation') {
                setIsProcessingPayment(false);
              }
            }, 1000);
          }
        }, 500);

        toast.success('Payment window opened. Complete your payment there.');
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

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
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  <div className="hidden sm:block h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="py-6 sm:py-10 bg-gray-50 min-h-screen">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Trip Details Skeleton */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="bg-blue-100 px-5 py-3">
                      <div className="h-6 w-32 bg-blue-200 rounded" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="h-20 bg-gray-100 rounded-lg" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-16 bg-gray-100 rounded-lg" />
                        <div className="h-16 bg-gray-100 rounded-lg" />
                      </div>
                      <div className="h-12 bg-gray-100 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column - Order Summary Skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="bg-blue-600 px-5 py-4">
                    <div className="h-6 w-32 bg-white/30 rounded" />
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="h-5 w-full bg-gray-200 rounded" />
                    <div className="h-5 w-full bg-gray-200 rounded" />
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <div className="h-10 w-full bg-blue-100 rounded-lg" />
                      <div className="h-12 w-full bg-blue-200 rounded-lg" />
                      <div className="h-12 w-full bg-gray-200 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

  // ========================================
  // MODO CONFIRMACIÓN - Pago exitoso
  // ========================================
  if (pageMode === 'confirmation') {
    const confirmedCustomerInfo = trips[0];

    return (
      <>
        <BookingNavbar />

        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">

          {/* Stepper - Step 4: Confirmation */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-8">
              <BookingStepper currentStep={4} />
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
                  Congratulations!
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
                          {confirmedCustomerInfo?.customer_first_name || customerInfo.firstName} {confirmedCustomerInfo?.customer_last_name || customerInfo.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold break-all">{confirmedCustomerInfo?.customer_email || customerInfo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold">{confirmedCustomerInfo?.customer_phone || `${currentCountry.phonePrefix} ${phoneNumber}`}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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

                      {trip.pickup_address && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Pickup Address</p>
                          <p className="text-sm font-medium">{trip.pickup_address}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Paid</span>
                      <span className="text-3xl font-bold text-green-600">
                        {formatCurrency(totalWithFees)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              {paymentResult && (
                <Card className="mb-8 bg-green-50 border-green-200 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-750">
                  <CardHeader>
                    <CardTitle className="text-green-900 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {paymentResult.transactionId && (
                        <div>
                          <p className="text-gray-500">Transaction ID</p>
                          <p className="font-mono font-semibold">{paymentResult.transactionId}</p>
                        </div>
                      )}
                      {paymentResult.authCode && (
                        <div>
                          <p className="text-gray-500">Authorization Code</p>
                          <p className="font-mono font-semibold">{paymentResult.authCode}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

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
                        Check your inbox at <strong>{confirmedCustomerInfo?.customer_email || customerInfo.email}</strong> for your booking details and receipt.
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

            </div>
          </div>
        </main>
      </>
    );
  }

  // ========================================
  // MODO SUMMARY - Formulario de pago
  // ========================================
  return (
    <>
      <BookingNavbar />
      <FAQModal isOpen={showFAQModal} onClose={() => setShowFAQModal(false)} />

      <section className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 drop-shadow-lg">
              Booking Summary
            </h1>
            <p className="text-sm sm:text-base md:text-lg drop-shadow-md">
              Review your details before confirming
            </p>
          </div>
        </div>
      </section>

      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
            <BookingStepper currentStep={3} />
          </div>
        </div>

        <div className="py-6 sm:py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {trips.map((trip, index) => (
                  <TripSummaryCard
                    key={trip.id}
                    trip={trip}
                    tripNumber={index + 1}
                    totalTrips={trips.length}
                    addOnNames={ADD_ON_NAMES}
                  />
                ))}

                {/* ========================================
                    SECCIÓN DE INFORMACIÓN DEL CLIENTE (INLINE)
                    ======================================== */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <CardTitle className="text-white text-lg">Billing Information</CardTitle>
                        <CardDescription className="text-blue-100">
                          Enter your details to proceed to payment
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Name fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={customerInfo.firstName}
                          onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                          placeholder="John"
                          disabled={isProcessingPayment}
                          className={formErrors.firstName ? 'border-red-500' : ''}
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={customerInfo.lastName}
                          onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                          placeholder="Doe"
                          disabled={isProcessingPayment}
                          className={formErrors.lastName ? 'border-red-500' : ''}
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                        placeholder="john@example.com"
                        disabled={isProcessingPayment}
                        className={formErrors.email ? 'border-red-500' : ''}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <select
                        id="country"
                        value={customerInfo.country}
                        onChange={(e) => handleCustomerInfoChange('country', e.target.value)}
                        disabled={isProcessingPayment}
                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name} ({country.phonePrefix})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phone with country code */}
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center justify-center px-3 h-10 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium min-w-[70px]">
                          {currentCountry.phonePrefix}
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="8888 8888"
                          disabled={isProcessingPayment}
                          className={`flex-1 ${formErrors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Security badge */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span>Your payment is secured with 256-bit SSL encryption</span>
                    </div>
                  </CardContent>
                </Card>

                <FAQSection faqs={POPULAR_FAQS} onViewAll={() => setShowFAQModal(true)} />
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-[140px] space-y-6">
                  <OrderSummaryCard
                    trips={trips}
                    totalPassengers={totalPassengers}
                    grandTotal={grandTotal}
                    termsAccepted={termsAccepted}
                    feesPercentage={PRICING_CONFIG.FEES_PERCENTAGE}
                    isSaving={isSavingToSupabase || isProcessingPayment}
                    onTermsChange={setTermsAccepted}
                    onPayNow={handlePayNow}
                    onAddToCart={handleAddToCartAndContinue}
                    onBackToDetails={() => {
                      // Ir al ÚLTIMO trip (el más reciente completado)
                      const lastTripIndex = trips.length - 1;
                      router.push(`/booking-details?booking_id=${bookingId}&trip=${lastTripIndex}&from=summary`);
                    }}
                  />
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
    <Suspense
      fallback={
        <>
          <BookingNavbar />
          {/* Hero Skeleton */}
          <section className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-700 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-48 bg-white/30 rounded-lg animate-pulse" />
            </div>
          </section>
          {/* Stepper Skeleton */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="py-6 sm:py-10 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-4">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-xl h-48 animate-pulse" />
                </div>
                <div className="bg-white rounded-xl h-64 animate-pulse" />
              </div>
            </div>
          </div>
        </>
      }
    >
      <SummaryPageContent />
    </Suspense>
  );
}
