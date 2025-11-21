// src/app/booking-details/page.tsx
// ✅ CORREGIDO - Sin fees, solo subtotal (Base + Night + Addons)
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
import { TripProgress } from '@/components/booking/TripProgress';
import { TripAddOns } from '@/components/booking/TripAddOns';

// ✅ NUEVO - Imports de componentes divididos
import {
  TripSummaryCard,
  PickupDetailsCard,
  FlightInfoCard,
  DropoffDetailsCard,
  ChildrenAgesCard,
  SpecialRequestsCard,
  PriceBottomBar,
} from '@/components/booking/details';

import {
  validateBookingDetails,
  sanitizeInput,
  isAirport,
  ValidationErrors,
} from '@/utils/bookingValidation';
import { normalizeTime } from '@/utils/timeHelpers';
import { calculateNightSurcharge, calculateAddOnsPrice } from '@/lib/pricing-config';

// ============================================
// TYPES
// ============================================

interface Trip {
  id: string;
  booking_id: string;
  from_location: string;
  to_location: string;
  date: string;
  pickup_time: string | null;
  adults: number;
  children: number;
  children_ages?: number[] | null;
  price: number;
  pickup_address: string | null;
  dropoff_address: string | null;
  flight_number: string | null;
  airline: string | null;
  special_requests: string | null;
  created_at: string | null;
  final_price: number | null;
  night_surcharge: number | null;
  add_ons?: string[] | null;
  distance?: number | null;
  duration?: string | null;
}

interface FormData {
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  flight_number: string;
  airline: string;
  special_requests: string;
  children_ages: (number | null)[];
}

// ============================================
// MAIN COMPONENT
// ============================================

function BookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const bookingId = searchParams.get('booking_id');

  // STATE
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [completedTrips, setCompletedTrips] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    pickup_address: '',
    dropoff_address: '',
    pickup_time: '',
    flight_number: '',
    airline: '',
    special_requests: '',
    children_ages: [],
  });

  // VALIDACIÓN TEMPRANA
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

  const currentTrip = trips[currentTripIndex];
  const isPickupFromAirport = currentTrip && isAirport(currentTrip.from_location);
  const isDropoffToAirport = currentTrip && isAirport(currentTrip.to_location);

  // ✅ PRICE CALCULATION (sin fees - se agregan en Summary)
  const priceCalculation = useMemo(() => {
    if (!currentTrip) {
      return { basePrice: 0, nightSurcharge: 0, addOnsPrice: 0, subtotal: 0 };
    }
    const basePrice = currentTrip.price || 0;
    const nightSurcharge = calculateNightSurcharge(formData.pickup_time, basePrice);
    const addOnsPrice = calculateAddOnsPrice(selectedAddOns);
    const subtotal = basePrice + nightSurcharge + addOnsPrice;
    return { basePrice, nightSurcharge, addOnsPrice, subtotal };
  }, [currentTrip?.price, formData.pickup_time, selectedAddOns]);

  // LOAD TRIPS
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

        setTrips(data as any);
        const completed = data
          .map((trip, idx) =>
            trip.pickup_time && trip.pickup_address && trip.dropoff_address ? idx : null
          )
          .filter((idx): idx is number => idx !== null);
        setCompletedTrips(completed);

        if (data[0]) {
          const trip = data[0];
          const initialAges =
            trip.children_ages && trip.children_ages.length > 0
              ? trip.children_ages
              : Array(trip.children).fill(null);

          setFormData({
            pickup_address: trip.pickup_address || '',
            dropoff_address: trip.dropoff_address || '',
            pickup_time: normalizeTime(trip.pickup_time),
            flight_number: trip.flight_number || '',
            airline: trip.airline || '',
            special_requests: trip.special_requests || '',
            children_ages: initialAges,
          });

          if (trip.add_ons && Array.isArray(trip.add_ons)) {
            setSelectedAddOns(trip.add_ons);
          }
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

  // UPDATE FORM WHEN TRIP CHANGES
  useEffect(() => {
    if (currentTrip) {
      const initialAges =
        currentTrip.children_ages && currentTrip.children_ages.length > 0
          ? currentTrip.children_ages
          : Array(currentTrip.children).fill(null);

      setFormData({
        pickup_address: currentTrip.pickup_address || '',
        dropoff_address: currentTrip.dropoff_address || '',
        pickup_time: normalizeTime(currentTrip.pickup_time),
        flight_number: currentTrip.flight_number || '',
        airline: currentTrip.airline || '',
        special_requests: currentTrip.special_requests || '',
        children_ages: initialAges,
      });

      if (currentTrip.add_ons && Array.isArray(currentTrip.add_ons)) {
        setSelectedAddOns(currentTrip.add_ons);
      } else {
        setSelectedAddOns([]);
      }
    }
  }, [currentTripIndex, currentTrip]);

  // CLEAR ERRORS
  useEffect(() => {
    setErrors({});
  }, [formData.pickup_address, formData.dropoff_address, formData.pickup_time, formData.flight_number]);

  // VALIDATION
  const validateForm = (): boolean => {
    if (!currentTrip) return false;
    const validationErrors = validateBookingDetails({
      pickup_address: formData.pickup_address,
      dropoff_address: formData.dropoff_address,
      pickup_time: formData.pickup_time,
      flight_number: formData.flight_number,
      from_location: currentTrip.from_location,
      to_location: currentTrip.to_location,
      children: currentTrip.children,
      children_ages: formData.children_ages,
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // HANDLERS
  const saveTripSilently = async (): Promise<boolean> => {
    if (!currentTrip || isSaving) return false;
    try {
      setIsSaving(true);
      const updateData = {
        pickup_address: formData.pickup_address ? sanitizeInput(formData.pickup_address) : null,
        dropoff_address: formData.dropoff_address ? sanitizeInput(formData.dropoff_address) : null,
        pickup_time: formData.pickup_time || null,
        flight_number: formData.flight_number ? sanitizeInput(formData.flight_number) : null,
        airline: formData.airline ? sanitizeInput(formData.airline) : null,
        special_requests: formData.special_requests ? sanitizeInput(formData.special_requests) : null,
        children_ages: formData.children_ages.filter((age): age is number => age !== null),
        add_ons: selectedAddOns.length > 0 ? selectedAddOns : null,
        add_ons_price: priceCalculation.addOnsPrice, // ✅ AGREGADO
        night_surcharge: priceCalculation.nightSurcharge,
        final_price: priceCalculation.subtotal,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('trips').update(updateData).eq('id', currentTrip.id);
      if (error) {
        console.error('Error auto-saving trip:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in saveTripSilently:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    try {
      setSaving(true);
      const updateData = {
        pickup_address: sanitizeInput(formData.pickup_address),
        dropoff_address: sanitizeInput(formData.dropoff_address),
        pickup_time: formData.pickup_time,
        flight_number: formData.flight_number ? sanitizeInput(formData.flight_number) : null,
        airline: formData.airline ? sanitizeInput(formData.airline) : null,
        special_requests: formData.special_requests ? sanitizeInput(formData.special_requests) : null,
        children_ages: formData.children_ages.filter((age): age is number => age !== null),
        add_ons: selectedAddOns.length > 0 ? selectedAddOns : null,
        add_ons_price: priceCalculation.addOnsPrice, // ✅ AGREGADO
        night_surcharge: priceCalculation.nightSurcharge,
        final_price: priceCalculation.subtotal,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('trips').update(updateData).eq('id', currentTrip!.id);
      if (error) throw error;

      if (!completedTrips.includes(currentTripIndex)) {
        setCompletedTrips([...completedTrips, currentTripIndex]);
      }

      if (currentTripIndex < trips.length - 1) {
        setCurrentTripIndex(currentTripIndex + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push(`/summary?booking_id=${bookingId}`);
      }
      setSaving(false);
    } catch (error) {
      console.error('Error saving trip details:', error);
      alert('Failed to save trip details. Please try again.');
      setSaving(false);
    }
  };

  const handleBack = async () => {
    try {
      await saveTripSilently();
    } catch (error) {
      console.error('Auto-save failed on back:', error);
    }
    if (currentTripIndex > 0) {
      setCurrentTripIndex(currentTripIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const params = new URLSearchParams(window.location.search);
      const fromSummary = params.get('from') === 'summary';
      if (fromSummary) {
        router.push(`/summary?booking_id=${bookingId}`);
      } else {
        router.push('/');
      }
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your booking details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!currentTrip) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
              <CardDescription>Unable to load trip details</CardDescription>
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

  const showFlightFields = isAirport(currentTrip.from_location) || isAirport(currentTrip.to_location);

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <BookingNavbar />

      {/* Hero Section */}
      <section className="relative h-48 md:h-64 w-full overflow-hidden">
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
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 drop-shadow-lg">
              Complete Your Booking
            </h1>
            <p className="text-sm md:text-lg drop-shadow-md">Just a few more details for your trip</p>
          </div>
        </div>
      </section>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <BookingStepper currentStep={1} />
        </div>
      </div>

      {/* Progress Indicator */}
      {trips.length > 1 && (
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <TripProgress
              currentTrip={currentTripIndex}
              totalTrips={trips.length}
              completedTrips={completedTrips}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-56 md:pb-36 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 md:space-y-6">
            
            <TripSummaryCard
              tripIndex={currentTripIndex}
              totalTrips={trips.length}
              fromLocation={currentTrip.from_location}
              toLocation={currentTrip.to_location}
              date={currentTrip.date}
              adults={currentTrip.adults}
              children={currentTrip.children}
            />

            <PickupDetailsCard
              fromLocation={currentTrip.from_location}
              isPickupFromAirport={isPickupFromAirport}
              isDropoffToAirport={isDropoffToAirport}
              pickupAddress={formData.pickup_address}
              pickupTime={formData.pickup_time}
              duration={currentTrip.duration}
              errors={errors}
              nightSurcharge={priceCalculation.nightSurcharge}
              onPickupAddressChange={(value) => setFormData({ ...formData, pickup_address: value })}
              onPickupTimeChange={(value) => setFormData({ ...formData, pickup_time: value })}
            />

            {showFlightFields && (
              <FlightInfoCard
                isPickupFromAirport={isPickupFromAirport}
                airline={formData.airline}
                flightNumber={formData.flight_number}
                errors={errors}
                onAirlineChange={(value) => setFormData({ ...formData, airline: value })}
                onFlightNumberChange={(value) => setFormData({ ...formData, flight_number: value })}
              />
            )}

            <DropoffDetailsCard
              toLocation={currentTrip.to_location}
              dropoffAddress={formData.dropoff_address}
              errors={errors}
              onDropoffAddressChange={(value) => setFormData({ ...formData, dropoff_address: value })}
            />

            <ChildrenAgesCard
              childrenCount={currentTrip.children}
              childrenAges={formData.children_ages}
              errors={errors}
              onChildrenAgesChange={(ages) => setFormData({ ...formData, children_ages: ages })}
            />

            <TripAddOns selectedAddOns={selectedAddOns} onAddOnsChange={setSelectedAddOns} />

            <SpecialRequestsCard
              specialRequests={formData.special_requests}
              onSpecialRequestsChange={(value) => setFormData({ ...formData, special_requests: value })}
            />
          </div>
        </div>

        <PriceBottomBar
          currentTripIndex={currentTripIndex}
          totalTrips={trips.length}
          priceCalculation={priceCalculation}
          saving={saving}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense
      fallback={
        <>
          <BookingNavbar />
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </>
      }
    >
      <BookingDetailsContent />
    </Suspense>
  );
}