// src/app/private-tours/booking/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Users, MapPin, Clock, DollarSign, 
  CheckCircle, Loader2, AlertCircle, ShoppingCart, CreditCard,
  ArrowLeft, Plus, Minus
} from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { DatePickerButton } from '@/components/home/DatePickerButton';
import { getTourBySlug } from '@/lib/tours-data';

interface BookingFormData {
  date?: Date;
  adults: number;
  children: number;
  hotel: string;
  specialRequests: string;
}

function TourBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tourSlug = searchParams.get('tour');

  const [formData, setFormData] = useState<BookingFormData>({
    date: undefined,
    adults: 2,
    children: 0,
    hotel: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassengerPicker, setShowPassengerPicker] = useState(false);

  const tour = tourSlug ? getTourBySlug(tourSlug) : null;

  useEffect(() => {
    if (!tourSlug || !tour) {
      router.push('/private-tours');
    }
  }, [tourSlug, tour, router]);

  if (!tour) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  // Calculate total passengers and price
  const totalPassengers = formData.adults + formData.children;
  const isValidPassengerCount = totalPassengers >= tour.minPassengers && totalPassengers <= tour.maxPassengers;
  
  // Price calculation
  let totalPrice = 0;
  if (totalPassengers >= tour.minPassengers) {
    if (totalPassengers <= 2) {
      totalPrice = tour.basePrice;
    } else {
      totalPrice = tour.basePrice + ((totalPassengers - 2) * tour.pricePerExtraPerson);
    }
  }

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (!isValidPassengerCount) {
      newErrors.passengers = `Tour requires ${tour.minPassengers}-${tour.maxPassengers} passengers`;
    }

    if (!formData.hotel.trim()) {
      newErrors.hotel = 'Hotel or pickup location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // TODO: Add to cart functionality
    alert('Add to cart functionality - to be implemented with your cart system');
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // TODO: Integrate with payment gateway
    const message = `
🌟 TOUR BOOKING - PAY NOW

Tour: ${tour.name}
Date: ${formData.date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Passengers: ${formData.adults} adults, ${formData.children} children
Total Price: $${totalPrice}

Pickup Location: ${formData.hotel}
Special Requests: ${formData.specialRequests || 'None'}
    `.trim();

    const whatsappUrl = `https://wa.me/50685962438?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  // Handlers for passenger picker
  const handleAdultsChange = (increment: boolean) => {
    const newAdults = increment ? formData.adults + 1 : formData.adults - 1;
    if (newAdults >= 1 && newAdults <= tour.maxPassengers && (newAdults + formData.children) <= tour.maxPassengers) {
      setFormData({ ...formData, adults: newAdults });
    }
  };

  const handleChildrenChange = (increment: boolean) => {
    const newChildren = increment ? formData.children + 1 : formData.children - 1;
    if (newChildren >= 0 && newChildren <= tour.maxPassengers && (formData.adults + newChildren) <= tour.maxPassengers) {
      setFormData({ ...formData, children: newChildren });
    }
  };

  // Format date for display
  const formatDateDisplay = (date?: Date) => {
    if (!date) return 'Not selected';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <>
      <BookingNavbar />

      {/* Hero Section */}
      <section className="relative h-48 md:h-64 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 opacity-10">
          <Image
            src={tour.image}
            alt={tour.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Complete Your Booking
          </h1>
          <p className="text-sm md:text-base text-white/90">
            {tour.name}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Error Alert */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Please fix the following errors:</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Back Button */}
              <button
                onClick={() => router.push(`/private-tours/${tour.slug}`)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to tour details</span>
              </button>

              <form className="space-y-6">
                
                {/* Tour Date & Passengers */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                  <div className="p-6 md:p-8 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                      Tour Date & Passengers
                    </h2>
                  </div>

                  <div className="p-6 md:p-8 space-y-5">
                    {/* Travel Date - Using SAME component as shuttles */}
                    <div>
                      <DatePickerButton
                        date={formData.date}
                        onDateChange={(date) => setFormData({ ...formData, date })}
                        label="Travel Date"
                        placeholder="Select your tour date"
                        className={errors.date ? 'border-red-300 bg-red-50' : ''}
                      />
                      {errors.date && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.date}
                        </p>
                      )}
                    </div>

                    {/* Passengers Picker */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passengers <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Display Button */}
                      <button
                        type="button"
                        onClick={() => setShowPassengerPicker(!showPassengerPicker)}
                        className={`w-full h-14 px-4 text-left rounded-xl border-2 transition-all flex items-center justify-between ${
                          errors.passengers
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-gray-400" />
                          <div>
                            <span className="text-base font-medium text-gray-900">
                              {formData.adults} {formData.adults === 1 ? 'Adult' : 'Adults'}
                              {formData.children > 0 && `, ${formData.children} ${formData.children === 1 ? 'Child' : 'Children'}`}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                            {totalPassengers} total
                          </span>
                        </div>
                      </button>

                      {/* Passenger Picker Dropdown */}
                      {showPassengerPicker && (
                        <div className="mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-200 p-5">
                          
                          {/* Adults */}
                          <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-200">
                            <div>
                              <p className="font-semibold text-gray-900">Adults</p>
                              <p className="text-sm text-gray-500">Age 13+</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => handleAdultsChange(false)}
                                disabled={formData.adults <= 1}
                                className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
                              >
                                <Minus className="h-5 w-5 text-gray-600" />
                              </button>
                              
                              <span className="w-8 text-center font-bold text-xl text-gray-900">
                                {formData.adults}
                              </span>
                              
                              <button
                                type="button"
                                onClick={() => handleAdultsChange(true)}
                                disabled={totalPassengers >= tour.maxPassengers}
                                className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
                              >
                                <Plus className="h-5 w-5 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">Children</p>
                              <p className="text-sm text-gray-500">Age {tour.minAge}-12</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => handleChildrenChange(false)}
                                disabled={formData.children <= 0}
                                className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
                              >
                                <Minus className="h-5 w-5 text-gray-600" />
                              </button>
                              
                              <span className="w-8 text-center font-bold text-xl text-gray-900">
                                {formData.children}
                              </span>
                              
                              <button
                                type="button"
                                onClick={() => handleChildrenChange(true)}
                                disabled={totalPassengers >= tour.maxPassengers}
                                className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
                              >
                                <Plus className="h-5 w-5 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Limit Warning */}
                          {totalPassengers >= tour.maxPassengers && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-xs text-amber-600 text-center flex items-center justify-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                Maximum {tour.maxPassengers} passengers per trip
                              </p>
                            </div>
                          )}

                          {/* Done Button */}
                          <button
                            type="button"
                            onClick={() => setShowPassengerPicker(false)}
                            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      )}

                      {/* Passenger Count Info */}
                      <div className={`mt-3 p-3 rounded-lg ${isValidPassengerCount ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                        <p className={`text-sm font-medium ${isValidPassengerCount ? 'text-green-700' : 'text-amber-700'}`}>
                          {isValidPassengerCount ? (
                            <>✓ Valid passenger count</>
                          ) : (
                            <>⚠ Tour requires {tour.minPassengers}-{tour.maxPassengers} passengers</>
                          )}
                        </p>
                      </div>

                      {errors.passengers && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.passengers}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Pickup Location
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="hotel" className="block text-sm font-medium text-gray-700 mb-2">
                        Hotel Name or Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="hotel"
                        type="text"
                        placeholder="Enter your hotel name or full address in La Fortuna"
                        value={formData.hotel}
                        onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                        className={`w-full h-14 px-4 text-base rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.hotel 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      />
                      {errors.hotel && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.hotel}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        Pickup available from La Fortuna area hotels at {tour.pickupTime}
                      </p>
                    </div>

                    <div>
                      <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        id="specialRequests"
                        placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 text-base rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isSubmitting || !isValidPassengerCount}
                    className="flex-1 h-14 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handlePayNow}
                    disabled={isSubmitting || !isValidPassengerCount}
                    className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Booking Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
                  {/* Tour Image */}
                  <div className="relative h-48">
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-bold text-white text-lg drop-shadow-lg">
                        {tour.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Tour Details */}
                    <div className="space-y-3 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>Pickup: {tour.pickupTime}</span>
                      </div>
                      {formData.date && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-gray-400">📅</span>
                          <span className="font-medium">{formatDateDisplay(formData.date)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Base price (2 pax)</span>
                        <span className="font-semibold text-gray-900">${tour.basePrice}</span>
                      </div>
                      {totalPassengers > 2 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Extra {totalPassengers - 2} passenger{totalPassengers - 2 !== 1 ? 's' : ''}</span>
                          <span className="font-semibold text-gray-900">+${(totalPassengers - 2) * tour.pricePerExtraPerson}</span>
                        </div>
                      )}
                      
                      <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <div className="text-right">
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-blue-600 text-3xl font-bold">${totalPrice}</span>
                          </div>
                          <p className="text-xs text-gray-500">All inclusive</p>
                        </div>
                      </div>
                    </div>

                    {/* What's Included */}
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Included:</p>
                      <ul className="space-y-2">
                        {tour.included.slice(0, 4).map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function TourBookingPage() {
  return (
    <Suspense fallback={
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    }>
      <TourBookingContent />
    </Suspense>
  );
}