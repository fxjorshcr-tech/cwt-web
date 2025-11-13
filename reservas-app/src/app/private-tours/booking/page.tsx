// src/app/private-tours/booking/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Users, MapPin, Clock, 
  CheckCircle, Loader2, AlertCircle, ShoppingCart, CreditCard,
  ArrowLeft, Plus, Minus
} from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { DatePickerButton } from '@/components/home/DatePickerButton';
import { getTourBySlug, Tour } from '@/lib/supabase-tours';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

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
  const supabase = createClient();
  const { addItem } = useCart();
  
  const tourSlug = searchParams.get('tour');

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function loadTour() {
      if (!tourSlug) {
        router.push('/private-tours');
        return;
      }

      const tourData = await getTourBySlug(tourSlug);
      
      if (!tourData) {
        router.push('/private-tours');
        return;
      }

      setTour(tourData);
      setLoading(false);
    }

    loadTour();
  }, [tourSlug, router]);

  if (loading || !tour) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </>
    );
  }

  const totalPassengers = formData.adults + formData.children;
  const isValidPassengerCount = totalPassengers >= tour.min_passengers && totalPassengers <= tour.max_passengers;
  
  let totalPrice = 0;
  if (totalPassengers >= tour.min_passengers) {
    if (totalPassengers <= 2) {
      totalPrice = tour.base_price;
    } else {
      totalPrice = tour.base_price + ((totalPassengers - 2) * tour.price_per_extra_person);
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (!isValidPassengerCount) {
      newErrors.passengers = `Tour requires ${tour.min_passengers}-${tour.max_passengers} passengers`;
    }

    if (!formData.hotel.trim()) {
      newErrors.hotel = 'Hotel or pickup location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveTourToSupabase = async () => {
    if (!formData.date) return null;

    const bookingId = `tour_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    const { data, error } = await supabase
      .from('tour_bookings')
      .insert([
        {
          booking_id: bookingId,
          tour_slug: tour.slug,
          tour_name: tour.name,
          date: formData.date.toISOString().split('T')[0],
          adults: formData.adults,
          children: formData.children,
          base_price: tour.base_price,
          price_per_extra_person: tour.price_per_extra_person,
          total_price: totalPrice,
          hotel: formData.hotel.trim(),
          special_requests: formData.specialRequests.trim() || null,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving tour:', error);
      throw error;
    }

    return data;
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);

      const tourData = await saveTourToSupabase();
      
      if (tourData) {
        addItem({
          type: 'tour',
          id: tourData.id,
          tourSlug: tour.slug,
          tourName: tour.name,
          date: formData.date!.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          adults: formData.adults,
          children: formData.children,
          price: totalPrice,
          hotel: formData.hotel.trim(),
        });

        toast.success('Tour added to cart!');
        router.push('/private-tours');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add tour to cart');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);

      const tourData = await saveTourToSupabase();
      
      if (tourData) {
        toast.info('WeTravel payment integration - Coming soon!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdultsChange = (increment: boolean) => {
    const newAdults = increment ? formData.adults + 1 : formData.adults - 1;
    if (newAdults >= 1 && newAdults <= tour.max_passengers && (newAdults + formData.children) <= tour.max_passengers) {
      setFormData({ ...formData, adults: newAdults });
      if (errors.passengers) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.passengers;
          return newErrors;
        });
      }
    }
  };

  const handleChildrenChange = (increment: boolean) => {
    const newChildren = increment ? formData.children + 1 : formData.children - 1;
    if (newChildren >= 0 && newChildren <= tour.max_passengers && (formData.adults + newChildren) <= tour.max_passengers) {
      setFormData({ ...formData, children: newChildren });
      if (errors.passengers) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.passengers;
          return newErrors;
        });
      }
    }
  };

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

      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          
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
            
            <div className="lg:col-span-2 space-y-6">
              
              <button
                onClick={() => router.push(`/private-tours/${tour.slug}`)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to tour details</span>
              </button>

              <form className="space-y-6">
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                  <div className="p-6 md:p-8 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                      Tour Date & Passengers
                    </h2>
                  </div>

                  <div className="p-6 md:p-8 space-y-5">
                    <div>
                      <DatePickerButton
                        date={formData.date}
                        onDateChange={(date) => {
                          setFormData({ ...formData, date });
                          if (date && errors.date) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.date;
                              return newErrors;
                            });
                          }
                        }}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passengers <span className="text-red-500">*</span>
                      </label>
                      
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

                      {showPassengerPicker && (
                        <div className="mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-200 p-5">
                          
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
                                disabled={totalPassengers >= tour.max_passengers}
                                className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
                              >
                                <Plus className="h-5 w-5 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">Children</p>
                              <p className="text-sm text-gray-500">Age {tour.min_age}-12</p>
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
                                disabled={totalPassengers >= tour.max_passengers}
                                className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
                              >
                                <Plus className="h-5 w-5 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {totalPassengers >= tour.max_passengers && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-xs text-amber-600 text-center flex items-center justify-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                Maximum {tour.max_passengers} passengers per trip
                              </p>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setShowPassengerPicker(false)}
                            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      )}

                      <div className={`mt-3 p-3 rounded-lg ${isValidPassengerCount ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                        <p className={`text-sm font-medium ${isValidPassengerCount ? 'text-green-700' : 'text-amber-700'}`}>
                          {isValidPassengerCount ? (
                            <>✓ Valid passenger count</>
                          ) : (
                            <>⚠ Tour requires {tour.min_passengers}-{tour.max_passengers} passengers</>
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
                        onChange={(e) => {
                          setFormData({ ...formData, hotel: e.target.value });
                          if (e.target.value.trim() && errors.hotel) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.hotel;
                              return newErrors;
                            });
                          }
                        }}
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
                        Pickup available from La Fortuna area hotels at {tour.pickup_time}
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
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
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
                    <div className="space-y-3 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>Pickup: {tour.pickup_time}</span>
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

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Base price (2 pax)</span>
                        <span className="font-semibold text-gray-900">${tour.base_price}</span>
                      </div>
                      {totalPassengers > 2 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Extra {totalPassengers - 2} passenger{totalPassengers - 2 !== 1 ? 's' : ''}</span>
                          <span className="font-semibold text-gray-900">+${(totalPassengers - 2) * tour.price_per_extra_person}</span>
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

                    <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handlePayNow}
                        disabled={isSubmitting || !isValidPassengerCount}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-lg"
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

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isSubmitting || !isValidPassengerCount}
                        className="w-full h-14 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart & Explore More
                      </button>
                    </div>

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