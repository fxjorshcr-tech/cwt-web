// src/app/payment/page.tsx
// Payment page - Collect customer info before payment

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  CreditCard,
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';

interface Trip {
  id: string;
  booking_id: string;
  from_location: string;
  to_location: string;
  adults: number;
  children: number;
  final_price: number | null;
  price: number;
  customer_first_name?: string | null;
  customer_last_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_country?: string | null;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Ireland',
  'New Zealand',
  'Japan',
  'South Korea',
  'Singapore',
  'Mexico',
  'Brazil',
  'Argentina',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Panama',
  'Other',
].sort();

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
  });

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

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error('No trips found for this booking');

      setTrips(data);

      // Pre-fill form if data exists
      if (data[0].customer_first_name) {
        setCustomerData({
          firstName: data[0].customer_first_name || '',
          lastName: data[0].customer_last_name || '',
          email: data[0].customer_email || '',
          phone: data[0].customer_phone || '',
          country: data[0].customer_country || '',
        });
      }
    } catch (error) {
      console.error('💥 Error loading trips:', error);
      alert('Error loading booking data');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!customerData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!customerData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!customerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = 'WhatsApp number is required';
    } else if (!/^[+]?[\d\s()-]{10,}$/.test(customerData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!customerData.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handlePayNow() {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstError);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Update all trips with customer data
      const updatePromises = trips.map(trip =>
        supabase
          .from('trips')
          .update({
            customer_first_name: customerData.firstName.trim(),
            customer_last_name: customerData.lastName.trim(),
            customer_email: customerData.email.trim().toLowerCase(),
            customer_phone: customerData.phone.trim(),
            customer_country: customerData.country,
            updated_at: new Date().toISOString(),
          })
          .eq('id', trip.id)
      );

      const results = await Promise.all(updatePromises);
      
      // Check for errors
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        throw new Error('Failed to save customer information');
      }

      console.log('✅ Customer data saved successfully');

      // TODO: Integrate with WeTravel here
      // For now, show success message
      alert(`Payment information saved!\n\nBooking ID: ${bookingId}\nTotal: $${grandTotal.toFixed(2)}\n\nWeTravel integration coming soon!`);
      
      // Redirect to confirmation page (you'll create this later)
      // router.push(`/confirmation?booking_id=${bookingId}`);

    } catch (error) {
      console.error('💥 Error saving customer data:', error);
      alert('Error saving your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <BookingNavbar />
        <BookingStepper currentStep={3} />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading payment page...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BookingNavbar />
      <BookingStepper currentStep={3} />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Summary
          </Button>

          {/* Booking Summary */}
          <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Booking ID</p>
                  <p className="font-mono text-sm font-bold text-gray-900">
                    ...{bookingId?.slice(-8)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Transfers</p>
                  <p className="text-sm font-bold text-gray-900">{trips.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Passengers</p>
                  <p className="text-sm font-bold text-gray-900">{totalPassengers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Amount</p>
                  <p className="text-lg font-bold text-blue-600">${grandTotal.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Payment Information</CardTitle>
              <CardDescription>
                Please provide your contact details to complete the booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerData.firstName}
                      onChange={(e) => setCustomerData({ ...customerData, firstName: e.target.value })}
                      placeholder="John"
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerData.lastName}
                      onChange={(e) => setCustomerData({ ...customerData, lastName: e.target.value })}
                      placeholder="Doe"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      placeholder="john.doe@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send your booking confirmation to this email
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">WhatsApp Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Include country code (e.g., +1 for US, +506 for Costa Rica)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <select
                      id="country"
                      value={customerData.country}
                      onChange={(e) => setCustomerData({ ...customerData, country: e.target.value })}
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-sm text-red-600 mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="pt-4 border-t">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Before You Pay
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Double-check all your information is correct</li>
                        <li>• You'll receive instant confirmation via email</li>
                        <li>• Our team monitors your flights automatically</li>
                        <li>• Free cancellation up to 48 hours before pickup</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Back
                </Button>

                <Button
                  onClick={handlePayNow}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay Now ${grandTotal.toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <>
          <BookingNavbar />
          <BookingStepper currentStep={3} />
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        </>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}