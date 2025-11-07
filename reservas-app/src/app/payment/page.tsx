// src/app/payment/page.tsx
// ✅ CORRECTED VERSION - Phase 1 fixes applied
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, CreditCard, User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingNavbar from '@/components/booking/BookingNavbar';

// ✅ IMPORTS CORREGIDOS - Validaciones robustas centralizadas
import { validateEmail, validatePhone, validateName } from '@/lib/validators';
import { sanitizeInput } from '@/utils/bookingValidation';
import { formatDate, formatTime, formatCurrency } from '@/lib/formatters';

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

// ============================================
// MAIN COMPONENT
// ============================================

function PaymentPageContent() {
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
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
  });

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

        if (!data || data.length === 0) {
          throw new Error('No trips found for this booking');
        }

        setTrips(data as Trip[]);

        // ✅ Pre-fill form de forma segura
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
        alert('Failed to load booking details. Please try again.');
        router.push('/');
      }
    }

    loadTrips();
  }, [bookingId, supabase, router]);

  // ============================================
  // VALIDATION - Usando funciones centralizadas
  // ============================================

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // ✅ Validar nombre con función robusta
    const firstNameError = validateName(customerData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateName(customerData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;

    // ✅ Validar email con función robusta
    const emailError = validateEmail(customerData.email);
    if (emailError) newErrors.email = emailError;

    // ✅ Validar teléfono con función robusta
    const phoneError = validatePhone(customerData.phone);
    if (phoneError) newErrors.phone = phoneError;

    // Validar país
    if (!customerData.country || customerData.country.trim().length === 0) {
      newErrors.country = 'Country is required';
    } else if (customerData.country.trim().length < 2) {
      newErrors.country = 'Please enter a valid country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // ✅ FIX: Sanitizar TODOS los inputs antes de guardar
      const updatePromises = trips.map(trip =>
        supabase
          .from('trips')
          .update({
            customer_first_name: sanitizeInput(customerData.firstName.trim()),
            customer_last_name: sanitizeInput(customerData.lastName.trim()),
            customer_email: customerData.email.trim().toLowerCase(), // Email no necesita sanitize
            customer_phone: sanitizeInput(customerData.phone.trim()),
            customer_country: sanitizeInput(customerData.country.trim()),
            updated_at: new Date().toISOString(),
          })
          .eq('id', trip.id)
      );

      const results = await Promise.all(updatePromises);

      // Verificar errores
      const hasError = results.some(result => result.error);
      if (hasError) {
        throw new Error('Failed to update customer information');
      }

      // ✅ Mostrar éxito con UI profesional
      setShowSuccess(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/summary?booking_id=${bookingId}`);
      }, 2000);

      setSaving(false);
    } catch (error) {
      console.error('Error saving customer data:', error);
      alert('Failed to save your information. Please try again.');
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/booking-details?booking_id=${bookingId}`);
  };

  // ============================================
  // CALCULATE TOTAL
  // ============================================

  const grandTotal = trips.reduce((sum, trip) => {
    return sum + (trip.final_price || trip.price);
  }, 0);

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
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // SUCCESS MODAL
  // ============================================

  if (showSuccess) {
    return (
      <>
        <BookingNavbar />
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 animate-in fade-in zoom-in duration-300">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Success!</CardTitle>
              <CardDescription>
                Your information has been saved
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Redirecting to booking summary...
              </p>
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
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
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Customer Information
            </h1>
            <p className="text-gray-600">
              Please provide your contact details to complete the booking
            </p>
          </div>

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
                        className={errors.firstName ? 'border-red-500' : ''}
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
                        className={errors.lastName ? 'border-red-500' : ''}
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
                      className={errors.email ? 'border-red-500' : ''}
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
                        className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
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
                        className={`pl-10 ${errors.country ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.country && (
                      <p className="text-sm text-red-600 mt-1">{errors.country}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Notice */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    After submitting your information, you'll receive a payment link via email 
                    or WhatsApp to complete your booking. We accept all major credit cards.
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* RIGHT - Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                    <CardDescription>{trips.length} trip{trips.length !== 1 ? 's' : ''}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Trip List */}
                    <div className="space-y-3">
                      {trips.map((trip, index) => (
                        <div key={trip.id} className="pb-3 border-b last:border-0">
                          <p className="text-sm font-semibold text-gray-900">
                            Trip {index + 1}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {trip.from_location} → {trip.to_location}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(trip.date)} at {formatTime(trip.pickup_time)}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(trip.final_price || trip.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(grandTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4">
                      <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="w-full"
                        size="lg"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          'Continue to Summary'
                        )}
                      </Button>

                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="w-full"
                        disabled={saving}
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
    </>
  );
}

// ============================================
// SUSPENSE WRAPPER
// ============================================

export default function PaymentPage() {
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
      <PaymentPageContent />
    </Suspense>
  );
}