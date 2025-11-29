// src/app/checkout/page.tsx
// Nueva página de checkout con formulario de billing y proceso de pago
'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Loader2,
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
  User,
  Home,
  Download,
  CreditCard,
  Shield,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import TermsCheckbox from '@/components/booking/TermsCheckbox';
import { toast } from 'sonner';
import { formatDate, formatTime, formatCurrency, formatBookingId } from '@/lib/formatters';
import { PRICING_CONFIG } from '@/lib/pricing-config';
import {
  checkExistingTrips,
  loadTripsFromSupabase,
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

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const bookingId = searchParams.get('booking_id');

  // Estado de la página: 'checkout' o 'confirmation'
  const [pageMode, setPageMode] = useState<'checkout' | 'confirmation'>('checkout');
  const [trips, setTrips] = useState<Trip[]>([]);
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

  // Datos de confirmación del pago
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  // Get current country's phone prefix
  const currentCountry = COUNTRIES.find(c => c.code === customerInfo.country) || COUNTRIES[0];

  // Escuchar mensajes del popup de Tilopay
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
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

  // Cargar trips desde Supabase
  useEffect(() => {
    async function loadTrips() {
      if (!bookingId) return;

      try {
        setLoading(true);

        // Cargar trips desde Supabase (ya fueron guardados en summary)
        const existingTripIds = await checkExistingTrips(supabase, bookingId);

        if (existingTripIds.length === 0) {
          toast.error('Booking not found. Please start over.');
          router.push('/');
          return;
        }

        const loadedTrips = await loadTripsFromSupabase(supabase, bookingId);

        if (!loadedTrips || loadedTrips.length === 0) {
          toast.error('Failed to load booking. Please try again.');
          router.push('/');
          return;
        }

        setTrips(loadedTrips as Trip[]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading booking:', error);
        toast.error('Failed to load booking. Please start over.');
        router.push('/');
      }
    }

    loadTrips();
  }, [bookingId, router, supabase]);

  const grandTotal = useMemo(
    () => trips.reduce((sum, trip) => sum + (trip.final_price || trip.price), 0),
    [trips]
  );

  const totalPassengers = useMemo(
    () => trips.reduce((sum, trip) => sum + trip.adults + trip.children, 0),
    [trips]
  );

  const totalWithFees = useMemo(() => {
    const fees = grandTotal * PRICING_CONFIG.FEES_PERCENTAGE;
    return grandTotal + fees;
  }, [grandTotal]);

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
        .eq('booking_id', bookingId as string);

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
        const width = 500;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          data.paymentUrl,
          'TilopayPayment',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );

        if (!popup || popup.closed) {
          toast.info('Popup blocked. Redirecting to payment page...');
          window.location.href = data.paymentUrl;
          return;
        }

        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
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
  // MODO CHECKOUT - Formulario de pago
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

      <main className="min-h-screen bg-gray-50">
        {/* Stepper */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
            <BookingStepper currentStep={4} />
          </div>
        </div>

        <div className="py-6 sm:py-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">

              {/* LEFT COLUMN - Billing Form (wider) */}
              <div className="lg:col-span-3 space-y-6">

                {/* Billing Information Card */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <CardTitle className="text-white text-xl">Billing Information</CardTitle>
                        <CardDescription className="text-blue-100">
                          Enter your details to complete the payment
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5">
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

                    {/* Country */}
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

                    {/* Phone with country code */}
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                      <div className="flex gap-2 mt-1.5">
                        <div className="flex items-center justify-center px-4 h-11 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium min-w-[70px]">
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

                    {/* Security badge */}
                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-green-50 rounded-lg p-4 border border-green-100">
                      <Shield className="h-6 w-6 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">Secure Payment</p>
                        <p className="text-xs text-green-700">Your data is protected with 256-bit SSL encryption</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Back button */}
                <Button
                  onClick={() => router.push(`/summary?booking_id=${bookingId}`)}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Summary
                </Button>
              </div>

              {/* RIGHT COLUMN - Order Summary */}
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-[100px] space-y-4">

                  {/* Order Summary Card */}
                  <Card className="shadow-lg">
                    <CardHeader className="border-b border-gray-200 pb-3">
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">

                      {/* Trips */}
                      {trips.map((trip, index) => (
                        <div key={trip.id} className={`${index > 0 ? 'pt-3 border-t border-gray-100' : ''}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {trips.length > 1 && `Trip ${index + 1}: `}
                                {trip.from_location} → {trip.to_location}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatDate(trip.date)} • {trip.adults + trip.children} passengers
                              </p>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              {formatCurrency(trip.final_price || trip.price)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Separator */}
                      <div className="border-t border-gray-200" />

                      {/* Subtotal & Fees */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal</span>
                          <span className="text-sm font-semibold">{formatCurrency(grandTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Service Fee ({(PRICING_CONFIG.FEES_PERCENTAGE * 100).toFixed(0)}%)</span>
                          <span className="text-sm font-medium text-gray-600">
                            +{formatCurrency(grandTotal * PRICING_CONFIG.FEES_PERCENTAGE)}
                          </span>
                        </div>
                      </div>

                      {/* Separator */}
                      <div className="border-t border-gray-200" />

                      {/* Total */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(totalWithFees)}
                          </span>
                        </div>
                      </div>

                      {/* Terms & Pay Button */}
                      <div className="space-y-3">
                        <TermsCheckbox
                          checked={termsAccepted}
                          onChange={setTermsAccepted}
                          error={false}
                        />

                        <Button
                          onClick={handlePayNow}
                          disabled={!termsAccepted || isProcessingPayment}
                          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessingPayment ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="h-5 w-5 mr-2" />
                              Pay {formatCurrency(totalWithFees)}
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-center text-gray-500">
                          You will be redirected to our secure payment provider
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span>Safe Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
