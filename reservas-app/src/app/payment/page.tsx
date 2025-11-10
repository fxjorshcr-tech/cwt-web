// src/app/payment/page.tsx
// ✅ PAYMENT PAGE - Customer info + Stripe (Step 3)
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, CreditCard, User, Mail, Phone, MapPin, CheckCircle, Lock } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';

import { validateEmail, validatePhone, validateName } from '@/lib/validators';
import { sanitizeInput } from '@/utils/bookingValidation';
import { formatCurrency } from '@/lib/formatters';

interface Trip {
  id: string;
  booking_id: string;
  from_location: string;
  to_location: string;
  price: number;
  final_price: number | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_country: string | null;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
}

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const bookingId = searchParams.get('booking_id');

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
  });

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

        const firstTrip = data[0] as Trip;
        if (firstTrip.customer_first_name) {
          setCustomerData({
            firstName: firstTrip.customer_first_name || '',
            lastName: firstTrip.customer_last_name || '',
            email: firstTrip.customer_email || '',
            phone: firstTrip.customer_phone || '',
            country: firstTrip.customer_country || '',
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading trips:', error);
        alert('Failed to load booking details');
        router.push('/');
      }
    }

    loadTrips();
  }, [bookingId, supabase, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const firstNameError = validateName(customerData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateName(customerData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;

    const emailError = validateEmail(customerData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(customerData.phone);
    if (phoneError) newErrors.phone = phoneError;

    if (!customerData.country || customerData.country.trim().length === 0) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const updatePromises = trips.map(trip =>
        supabase
          .from('trips')
          .update({
            customer_first_name: sanitizeInput(customerData.firstName.trim()),
            customer_last_name: sanitizeInput(customerData.lastName.trim()),
            customer_email: customerData.email.trim().toLowerCase(),
            customer_phone: sanitizeInput(customerData.phone.trim()),
            customer_country: sanitizeInput(customerData.country.trim()),
            updated_at: new Date().toISOString(),
          })
          .eq('id', trip.id)
      );

      const results = await Promise.all(updatePromises);
      const hasError = results.some(result => result.error);
      if (hasError) throw new Error('Failed to update customer information');

      // TODO: Aquí iría la integración con Stripe
      // Por ahora solo redirigimos a confirmation
      
      router.push(`/confirmation?booking_id=${bookingId}`);

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process payment');
      setSaving(false);
    }
  };

  const grandTotal = trips.reduce((sum, trip) => sum + (trip.final_price || trip.price), 0);

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
              Payment Information
            </h1>
            <p className="text-lg md:text-xl drop-shadow-md">
              Secure payment for your Costa Rica adventure
            </p>
          </div>
        </div>
      </section>

      {/* Stepper - Step 3: Payment */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <BookingStepper currentStep={3} />
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* LEFT - Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>This information will be used for your booking confirmation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={customerData.firstName}
                        onChange={(e) => setCustomerData({ ...customerData, firstName: e.target.value })}
                        className={`min-h-[48px] ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={customerData.lastName}
                        onChange={(e) => setCustomerData({ ...customerData, lastName: e.target.value })}
                        className={`min-h-[48px] ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>We'll send your confirmation to this email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      className={`min-h-[48px] ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        className={`pl-10 min-h-[48px] ${errors.phone ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Include country code (e.g., +1 for USA, +506 for Costa Rica)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="country">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="country"
                        placeholder="United States"
                        value={customerData.country}
                        onChange={(e) => setCustomerData({ ...customerData, country: e.target.value })}
                        className={`pl-10 min-h-[48px] ${errors.country ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.country && (
                      <p className="text-sm text-red-600 mt-1">{errors.country}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method - Stripe Placeholder */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Secure payment powered by Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* TODO: Aquí va el componente de Stripe */}
                  <div className="bg-white rounded-lg p-6 border-2 border-dashed border-blue-300">
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                      <p className="font-semibold text-gray-900 mb-2">
                        Stripe Payment Integration
                      </p>
                      <p className="text-sm text-gray-600">
                        Credit card form will be integrated here
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        All payments are processed securely through Stripe
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 pt-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                    <div className="flex gap-2">
                      <CreditCard className="h-6 w-6 text-gray-400" />
                      <Lock className="h-6 w-6 text-green-600" />
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>

            {/* RIGHT - Summary (STICKY) */}
            <div className="lg:col-span-1">
              <div className="sticky top-[140px]">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Total</CardTitle>
                    <CardDescription>{trips.length} trip{trips.length !== 1 ? 's' : ''}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-bold text-blue-600">
                          {formatCurrency(grandTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="w-full min-h-[48px]"
                        size="lg"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Pay Now
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => router.push(`/summary?booking_id=${bookingId}`)}
                        variant="outline"
                        className="w-full min-h-[48px]"
                        disabled={saving}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Summary
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span>Secure 256-bit SSL encryption</span>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}