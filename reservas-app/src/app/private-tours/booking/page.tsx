// src/app/private-tours/booking/page.tsx
// ✅ OPTIMIZADO: Code splitting con componentes separados
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { getTourBySlug, Tour } from '@/lib/supabase-tours';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

// ✅ Imports de componentes divididos
import {
  TourBookingSummary,
  TourDatePassengerForm,
  PickupLocationForm,
} from '@/components/tours/booking';

interface BookingFormData {
  date?: Date;
  adults: number;
  children: number;
  hotel: string;
  specialRequests: string;
}

function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  const [termsAccepted, setTermsAccepted] = useState(false);

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
  const isValidPassengerCount =
    totalPassengers >= tour.min_passengers && totalPassengers <= tour.max_passengers;

  let totalPrice = 0;
  if (totalPassengers >= tour.min_passengers) {
    if (totalPassengers <= 2) {
      totalPrice = tour.base_price;
    } else {
      totalPrice = tour.base_price + (totalPassengers - 2) * tour.price_per_extra_person;
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
          date: formatDateToString(formData.date),
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
            day: 'numeric',
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

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }

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
    if (
      newAdults >= 1 &&
      newAdults <= tour.max_passengers &&
      newAdults + formData.children <= tour.max_passengers
    ) {
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
    if (
      newChildren >= 0 &&
      newChildren <= tour.max_passengers &&
      formData.adults + newChildren <= tour.max_passengers
    ) {
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

  return (
    <>
      <BookingNavbar />

      <section className="relative h-48 md:h-64 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 opacity-10">
          <Image src={tour.image} alt={tour.name} fill className="object-cover" />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Complete Your Booking
          </h1>
          <p className="text-sm md:text-base text-white/90">{tour.name}</p>
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
                <TourDatePassengerForm
                  selectedDate={formData.date}
                  adults={formData.adults}
                  children={formData.children}
                  maxPassengers={tour.max_passengers}
                  minPassengers={tour.min_passengers}
                  minAge={tour.min_age}
                  showPassengerPicker={showPassengerPicker}
                  errors={errors}
                  isValidPassengerCount={isValidPassengerCount}
                  onDateChange={(date) => {
                    setFormData({ ...formData, date: date || undefined });
                    if (date && errors.date) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.date;
                        return newErrors;
                      });
                    }
                  }}
                  onAdultsChange={handleAdultsChange}
                  onChildrenChange={handleChildrenChange}
                  onTogglePassengerPicker={() => setShowPassengerPicker(!showPassengerPicker)}
                  onClosePassengerPicker={() => setShowPassengerPicker(false)}
                />

                <PickupLocationForm
                  hotel={formData.hotel}
                  specialRequests={formData.specialRequests}
                  pickupTime={tour.pickup_time}
                  errors={errors}
                  onHotelChange={(value) => {
                    setFormData({ ...formData, hotel: value });
                    if (value.trim() && errors.hotel) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.hotel;
                        return newErrors;
                      });
                    }
                  }}
                  onSpecialRequestsChange={(value) =>
                    setFormData({ ...formData, specialRequests: value })
                  }
                />
              </form>
            </div>

            <div className="lg:col-span-1">
              <TourBookingSummary
                tour={tour}
                selectedDate={formData.date}
                totalPassengers={totalPassengers}
                totalPrice={totalPrice}
                isValidPassengerCount={isValidPassengerCount}
                termsAccepted={termsAccepted}
                isSubmitting={isSubmitting}
                onTermsChange={setTermsAccepted}
                onPayNow={handlePayNow}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function TourBookingPage() {
  return (
    <Suspense
      fallback={
        <>
          <BookingNavbar />
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </>
      }
    >
      <TourBookingContent />
    </Suspense>
  );
}