// src/app/cart/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingCart, ArrowRight, Calendar, Users, MapPin, CreditCard, Shield, Lock, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useCart, ShuttleCartItem, TourCartItem } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingNavbar from '@/components/booking/BookingNavbar';
import TermsCheckbox from '@/components/booking/TermsCheckbox';
import { formatCurrency } from '@/lib/formatters';
import { PRICING_CONFIG } from '@/lib/pricing-config';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

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

export default function CartPage() {
  const router = useRouter();
  const supabase = createClient();
  const { items, itemCount, totalAmount, removeItem, clearCart } = useCart();

  // Checkout form state
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'US',
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<CustomerInfo>>({});

  // Get current country's phone prefix
  const currentCountry = COUNTRIES.find(c => c.code === customerInfo.country) || COUNTRIES[0];

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  // Validate form
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

  // Calculate totals
  const shuttles = items.filter((item) => item.type === 'shuttle') as ShuttleCartItem[];
  const tours = items.filter((item) => item.type === 'tour') as TourCartItem[];

  const shuttleSubtotal = shuttles.reduce((sum, s) => sum + s.finalPrice, 0);
  const tourSubtotal = tours.reduce((sum, t) => sum + t.price, 0);
  const shuttleFees = shuttleSubtotal * PRICING_CONFIG.FEES_PERCENTAGE;
  const grandTotal = shuttleSubtotal + shuttleFees + tourSubtotal; // Tours have no fees

  // Handle checkout
  const handleProceedToCheckout = () => {
    setShowCheckoutForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle payment
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

      // Generate a unified cart booking ID
      const cartBookingId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      // Update customer info for all shuttle bookings
      const shuttleBookingIds = Array.from(new Set(shuttles.map(s => s.bookingId)));
      for (const bookingId of shuttleBookingIds) {
        await supabase
          .from('trips')
          .update({
            customer_first_name: customerData.firstName,
            customer_last_name: customerData.lastName,
            customer_email: customerData.email,
            customer_phone: customerData.phone,
            customer_country: customerData.country,
          })
          .eq('booking_id', bookingId);
      }

      // Update customer info for all tour bookings
      const tourIds = tours.map(t => t.id);
      for (const tourId of tourIds) {
        await supabase
          .from('tour_bookings')
          .update({
            customer_first_name: customerData.firstName,
            customer_last_name: customerData.lastName,
            customer_email: customerData.email,
            customer_phone: customerData.phone,
            customer_country: customerData.country,
          })
          .eq('id', tourId);
      }

      // Create payment request for cart
      const response = await fetch('/api/tilopay/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: cartBookingId,
          bookingType: 'cart',
          amount: grandTotal,
          currency: 'USD',
          cartItems: {
            shuttles: shuttles.map(s => ({ id: s.id, bookingId: s.bookingId, price: s.finalPrice })),
            tours: tours.map(t => ({ id: t.id, price: t.price })),
          },
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
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  if (itemCount === 0) {
    return (
      <>
        <BookingNavbar />

        <section className="relative h-48 md:h-64 w-full overflow-hidden">
          <Image
            src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
            alt="Costa Rica Beach"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              Shopping Cart
            </h1>
          </div>
        </section>

        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <Card>
              <CardContent className="py-16 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">
                  Add shuttles or tours to get started!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => router.push('/transfers')} size="lg">
                    Browse Shuttles
                  </Button>
                  <Button onClick={() => router.push('/private-tours')} variant="outline" size="lg">
                    Browse Tours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Checkout Form View
  if (showCheckoutForm) {
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
                    onClick={() => setShowCheckoutForm(false)}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ← Back to Cart
                  </Button>
                </div>

                {/* RIGHT COLUMN - Order Summary */}
                <div className="lg:col-span-2">
                  <div className="lg:sticky lg:top-4 space-y-4">

                    {/* Order Summary Card */}
                    <Card className="shadow-lg">
                      <CardHeader className="border-b border-gray-200 pb-3">
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">

                        {/* Shuttles */}
                        {shuttles.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              🚐 Shuttles ({shuttles.length})
                            </h4>
                            {shuttles.map((shuttle) => (
                              <div key={shuttle.id} className="text-sm pl-2 border-l-2 border-blue-200">
                                <p className="font-medium text-gray-900">
                                  {shuttle.fromLocation} → {shuttle.toLocation}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {shuttle.date} • {shuttle.adults + shuttle.children} pax
                                </p>
                                <p className="text-sm font-semibold text-blue-600">
                                  {formatCurrency(shuttle.finalPrice)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tours */}
                        {tours.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              🎯 Tours ({tours.length})
                            </h4>
                            {tours.map((tour) => (
                              <div key={tour.id} className="text-sm pl-2 border-l-2 border-green-200">
                                <p className="font-medium text-gray-900">{tour.tourName}</p>
                                <p className="text-xs text-gray-500">
                                  {tour.date} • {tour.adults + tour.children} pax
                                </p>
                                <p className="text-sm font-semibold text-green-600">
                                  {formatCurrency(tour.price)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Separator */}
                        <div className="border-t border-gray-200" />

                        {/* Subtotals & Fees */}
                        <div className="space-y-2">
                          {shuttles.length > 0 && (
                            <>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Shuttles Subtotal</span>
                                <span className="font-semibold">{formatCurrency(shuttleSubtotal)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Service Fee ({(PRICING_CONFIG.FEES_PERCENTAGE * 100).toFixed(0)}%)</span>
                                <span className="text-gray-600">+{formatCurrency(shuttleFees)}</span>
                              </div>
                            </>
                          )}
                          {tours.length > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Tours (no fees)</span>
                              <span className="font-semibold">{formatCurrency(tourSubtotal)}</span>
                            </div>
                          )}
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200" />

                        {/* Total */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-blue-600">
                              {formatCurrency(grandTotal)}
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
                                Pay {formatCurrency(grandTotal)}
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

  // Regular Cart View
  return (
    <>
      <BookingNavbar />

      <section className="relative h-48 md:h-64 w-full overflow-hidden">
        <Image
          src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
          alt="Costa Rica Beach"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg mb-2">
              Shopping Cart
            </h1>
            <p className="text-lg drop-shadow-md">
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">

          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT - Cart Items */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shuttles Section */}
              {shuttles.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🚐 Private Shuttles ({shuttles.length})
                  </h2>

                  <div className="space-y-4">
                    {shuttles.map((shuttle) => (
                      <Card key={shuttle.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {shuttle.fromLocation} → {shuttle.toLocation}
                                </h3>
                                {shuttle.tripNumber && shuttle.totalTrips && (
                                  <p className="text-sm text-gray-500">
                                    Trip {shuttle.tripNumber} of {shuttle.totalTrips}
                                  </p>
                                )}
                              </div>

                              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>{shuttle.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Users className="h-4 w-4" />
                                  <span>{shuttle.adults} Adults, {shuttle.children} Children</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <span className="text-xl font-bold text-blue-600">
                                  {formatCurrency(shuttle.finalPrice)}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(shuttle.id)}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Remove from cart"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Tours Section */}
              {tours.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🎯 Private Tours ({tours.length})
                  </h2>

                  <div className="space-y-4">
                    {tours.map((tour) => (
                      <Card key={tour.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {tour.tourName}
                                </h3>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>{tour.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Users className="h-4 w-4" />
                                  <span>{tour.adults} Adults, {tour.children} Children</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>{tour.hotel}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <span className="text-xl font-bold text-blue-600">
                                  {formatCurrency(tour.price)}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(tour.id)}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Remove from cart"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT - Summary (STICKY) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    <div className="space-y-3">
                      {shuttles.length > 0 && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shuttles ({shuttles.length})</span>
                            <span className="font-semibold">
                              {formatCurrency(shuttleSubtotal)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Service Fee ({(PRICING_CONFIG.FEES_PERCENTAGE * 100).toFixed(0)}%)</span>
                            <span className="text-gray-600">
                              +{formatCurrency(shuttleFees)}
                            </span>
                          </div>
                        </>
                      )}
                      {tours.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tours ({tours.length})</span>
                          <span className="font-semibold">
                            {formatCurrency(tourSubtotal)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-bold text-blue-600">
                          {formatCurrency(grandTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleProceedToCheckout}
                        className="w-full min-h-[48px] bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        💳 Proceed to Checkout
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>

                      <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="w-full min-h-[48px]"
                      >
                        Continue Shopping
                      </Button>

                      <Button
                        onClick={handleClearCart}
                        variant="outline"
                        className="w-full min-h-[48px] border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Cart
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
