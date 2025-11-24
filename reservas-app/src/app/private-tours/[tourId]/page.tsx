// src/app/private-tours/[tourId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Clock, Users, MapPin, AlertCircle, Star,
  CheckCircle, XCircle, Loader2, ChevronDown
} from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import { getTourBySlug, Tour } from '@/lib/supabase-tours';
import { TourGallery } from '@/components/tours/TourGallery';
import { TourItinerary } from '@/components/tours/TourItinerary';
import {
  TourBookingSummary,
  TourDatePassengerForm,
  PickupLocationForm,
} from '@/components/tours/booking';
import { FAQsWidget } from '@/components/booking/FAQsWidget';
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

function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface PageProps {
  params: {
    tourId: string;
  };
}

export default function TourDetailPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClient();
  const { addItem } = useCart();

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

  // Accordion states
  const [accordions, setAccordions] = useState({
    included: false,
    notIncluded: false,
    whatToBring: false,
    importantInfo: false,
  });

  const toggleAccordion = (key: keyof typeof accordions) => {
    setAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    async function loadTour() {
      const tourData = await getTourBySlug(params.tourId);

      if (!tourData) {
        notFound();
      }

      setTour(tourData);
      setLoading(false);
    }

    loadTour();
  }, [params.tourId]);

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

  // Determinar tiempo de manejo
  const getDriveTime = (slug: string) => {
    const driveTimes: Record<string, { time: string; description: string }> = {
      'poas-la-paz-waterfall': {
        time: '2h drive',
        description: 'Beautiful 2-hour mountain drive to Poás'
      },
      'rio-celeste-frog-sloth-tour': {
        time: '1h drive',
        description: 'Scenic 1-hour drive each way from La Fortuna'
      },
      'bajos-del-toro-blue-falls': {
        time: '1.5h drive',
        description: 'Scenic 1.5-hour drive through mountain countryside'
      },
    };
    return driveTimes[slug] || null;
  };

  const driveTimeInfo = getDriveTime(params.tourId);

  const difficultyColors: Record<string, string> = {
    Easy: 'text-green-600 bg-green-50 border-green-200',
    Moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    Challenging: 'text-red-600 bg-red-50 border-red-200'
  };

  const totalPassengers = formData.adults + formData.children;
  const isValidPassengerCount =
    totalPassengers >= tour.min_passengers && totalPassengers <= tour.max_passengers;

  // NUEVA LÓGICA DE PRECIOS: Siempre muestra precio base × 2 como mínimo
  let totalPrice = tour.base_price * 2; // Precio mínimo para 2 personas
  if (totalPassengers > 2) {
    totalPrice = totalPrice + (totalPassengers - 2) * tour.price_per_extra_person;
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
          base_price: tour.base_price * 2, // Guardar precio base × 2
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

      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] min-h-[450px] sm:min-h-[500px] flex items-end">
        <div className="absolute inset-0 z-0">
          <Image
            src={tour.image}
            alt={tour.name}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 w-full pb-8 sm:pb-12 px-4 sm:px-6 pt-20 sm:pt-0">
          <div className="container mx-auto max-w-6xl">
            {/* Back Button */}
            <Link
              href="/private-tours"
              className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-all text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Tours</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-2xl leading-tight">
              {tour.name}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-3xl drop-shadow-lg mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none">
              {tour.short_description}
            </p>

            {/* Quick Info Badges - Optimizado para móvil */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
              <div className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/95 backdrop-blur-sm rounded-lg flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">{tour.duration}</span>
              </div>
              <div className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/95 backdrop-blur-sm rounded-lg flex items-center gap-1.5 sm:gap-2">
                <Users className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">Max {tour.max_passengers}</span>
              </div>
              <div className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 backdrop-blur-sm rounded-lg flex items-center gap-1.5 sm:gap-2 border ${difficultyColors[tour.difficulty]}`}>
                <AlertCircle className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">{tour.difficulty}</span>
              </div>
              {/* Pickup time - visible en todos los tamaños pero más compacto */}
              <div className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/95 backdrop-blur-sm rounded-lg flex items-center gap-1.5 sm:gap-2">
                <MapPin className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm md:text-base truncate max-w-[80px] sm:max-w-none">{tour.pickup_time}</span>
              </div>
              {/* Drive time - solo visible en pantallas medianas y grandes */}
              {driveTimeInfo && (
                <div className="hidden md:flex px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-orange-500/95 backdrop-blur-sm rounded-lg items-center gap-1.5 sm:gap-2">
                  <span className="text-white text-xs sm:text-sm md:text-base">🚗</span>
                  <span className="font-semibold text-white text-xs sm:text-sm md:text-base whitespace-nowrap">{driveTimeInfo.time}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Error Messages */}
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

            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">

              {/* Overview - Short Description */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Overview</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {tour.short_description}
                </p>
              </div>

              {/* Photo Gallery */}
              {tour.gallery && tour.gallery.length > 0 && (
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Photos</h2>
                  <TourGallery images={tour.gallery} tourName={tour.name} />
                </div>
              )}

              {/* Highlights */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Highlights</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Star className="h-4 w-4 text-green-600 fill-green-600" />
                      </div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tour Itinerary */}
              <TourItinerary description={tour.long_description} />

              {/* What's Included / Not Included - Accordions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Included Accordion */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('included')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors border-b border-green-200"
                  >
                    <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      What's Included
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-green-700 transition-transform ${
                        accordions.included ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {accordions.included && (
                    <div className="p-6 bg-green-50">
                      <ul className="space-y-2">
                        {tour.included.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-green-600 mt-0.5 text-sm font-bold">•</span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Not Included Accordion */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('notIncluded')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-red-50 hover:bg-red-100 transition-colors border-b border-red-200"
                  >
                    <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Not Included
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-red-700 transition-transform ${
                        accordions.notIncluded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {accordions.notIncluded && (
                    <div className="p-6 bg-red-50">
                      <ul className="space-y-2">
                        {tour.not_included.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-red-600 mt-0.5 text-sm font-bold">•</span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* What to Bring - Accordion */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('whatToBring')}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-bold text-gray-900">What to Bring</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-700 transition-transform ${
                      accordions.whatToBring ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {accordions.whatToBring && (
                  <div className="p-6 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-3">
                      {tour.what_to_bring.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-600 mt-0.5 text-sm font-bold">•</span>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Important Information - Accordion */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('importantInfo')}
                  className="w-full px-6 py-4 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors border-b border-amber-200"
                >
                  <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Important Information
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-amber-700 transition-transform ${
                      accordions.importantInfo ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {accordions.importantInfo && (
                  <div className="p-6 bg-amber-50">
                    <ul className="space-y-2">
                      {tour.important_notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-amber-600 mt-0.5 text-sm">•</span>
                          <span className="text-sm">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* FAQs Section - ONLY ON MOBILE */}
              <div className="lg:hidden">
                <FAQsWidget />
              </div>
            </div>

            {/* Right Column - Booking Form (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Booking Section Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-2">Book This Adventure</h2>
                  <p className="text-blue-100 text-sm">
                    Fill in the details below to reserve your spot on this amazing tour
                  </p>
                </div>

                {/* Booking Form */}
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

                {/* Booking Summary with updated pricing */}
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

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">Got Questions?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Contact us on WhatsApp for instant answers about this tour or custom requests.
                    For groups larger than {tour.max_passengers} people, we can provide a custom quote.
                  </p>
                  <Link
                    href={`https://wa.me/50685962438?text=Hi!%20I%20have%20questions%20about%20the%20${encodeURIComponent(tour.name)}%20tour`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-center"
                  >
                    Chat on WhatsApp
                  </Link>
                </div>

                {/* FAQs Section - ONLY ON DESKTOP */}
                <div className="hidden lg:block">
                  <FAQsWidget />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
