// src/app/summary/page.tsx
// ✅ CORREGIDO: Guarda en Supabase SOLO cuando usuario confirma (Pay Now / Add to Cart)
'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import FAQModal from '@/components/booking/FAQModal';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

// ✅ Imports de componentes divididos
import {
  TripSummaryCard,
  FAQSection,
  OrderSummaryCard,
} from '@/components/summary';

import { formatDate, formatTime } from '@/lib/formatters';
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
}

// LocalStorageBooking type is imported from utils/localStorageHelpers

// ✅ CORREGIDO: Nombres actualizados
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

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSavingToSupabase, setIsSavingToSupabase] = useState(false);

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

  // ✅ LOAD FROM LOCALSTORAGE
  useEffect(() => {
    async function loadTrips() {
      try {
        setLoading(true);

        // ✅ Load booking from localStorage using helper
        const localData = loadBookingFromLocalStorage(bookingId as string);

        if (!localData) {
          throw new Error('Booking not found. Please start a new search.');
        }

        // Convert localStorage data to Trip format
        const loadedTrips: Trip[] = localData.trips.map((trip, index) => {
          const details = localData.tripDetails?.[index];

          if (!details) {
            throw new Error('Incomplete booking details. Please complete all steps.');
          }

          const filteredChildrenAges = filterChildrenAges(details.children_ages);

          const tripData: Trip = {
            id: `temp_${localData.bookingId}_${index}`,
            booking_id: localData.bookingId,
            from_location: trip.from_location,
            to_location: trip.to_location,
            date: trip.date,
            adults: trip.adults,
            children: trip.children,
            price: trip.price,
            duration: trip.duration,
            routeId: trip.routeId,
            pickup_address: details.pickup_address,
            dropoff_address: details.dropoff_address,
            pickup_time: details.pickup_time,
            flight_number: details.flight_number || null,
            airline: details.airline || null,
            special_requests: details.special_requests || null,
            children_ages: filteredChildrenAges,
            add_ons: details.add_ons.length > 0 ? details.add_ons : null,
            night_surcharge: details.night_surcharge,
            add_ons_price: details.add_ons_price,
            final_price: details.final_price,
          };

          return tripData;
        });

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

  // ✅ FUNCIÓN PARA GUARDAR EN SUPABASE
  const saveBookingToSupabase = async (): Promise<boolean> => {
    try {
      setIsSavingToSupabase(true);

      // ✅ Check if already exists in Supabase
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

      // ✅ Prepare trips for Supabase insertion
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

      // ✅ Insert with retry logic
      const insertedTrips = await insertTripsWithRetry(supabase, tripsToInsert);

      if (!insertedTrips) {
        throw new Error('Failed to save booking after retries');
      }

      // ✅ Update local state with real Supabase IDs
      if (insertedTrips.length > 0) {
        setTrips((prevTrips) =>
          prevTrips.map((trip, index) => ({
            ...trip,
            id: insertedTrips[index].id,
          }))
        );
      }

      // ✅ Clean up localStorage
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

  // ✅ HANDLE ADD TO CART - Guardar en Supabase primero
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

  // ✅ HANDLE PAY NOW - Guardar en Supabase primero
  const handlePayNow = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    // Guardar en Supabase
    const saved = await saveBookingToSupabase();

    if (!saved) {
      return; // Si falla, no continuar
    }

    // ✅ TODO: Integrar con WeTravel
    toast.info('WeTravel payment integration - Coming soon!');
    // Aquí irá la integración con WeTravel usando los IDs reales de Supabase
  };

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

  return (
    <>
      <BookingNavbar />
      <FAQModal isOpen={showFAQModal} onClose={() => setShowFAQModal(false)} />

      <section className="relative h-40 sm:h-56 md:h-72 w-full overflow-hidden">
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
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
              Booking Summary
            </h1>
            <p className="text-sm sm:text-lg md:text-xl drop-shadow-md">
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
                    isSaving={isSavingToSupabase}
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
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        </>
      }
    >
      <SummaryPageContent />
    </Suspense>
  );
}