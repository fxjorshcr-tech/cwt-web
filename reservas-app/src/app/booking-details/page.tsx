// src/app/booking-details/page.tsx
// ✅ SIMPLIFIED - Consolidated form with fewer cards
'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, MapPin, Calendar, Users, Clock, ArrowRight, Plane, AlertCircle, Info } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import { TripProgress } from '@/components/booking/TripProgress';
import { TripAddOns } from '@/components/booking/TripAddOns';
import { TimePicker } from '@/components/forms/TimePicker';

import {
  validateBookingDetails,
  isAirport,
  ValidationErrors,
} from '@/utils/bookingValidation';
import { normalizeTime } from '@/utils/timeHelpers';
import { calculateNightSurcharge, calculateAddOnsPrice } from '@/lib/pricing-config';
import {
  loadBookingFromLocalStorage,
  saveBookingDetailsToLocalStorage,
  saveBookingToLocalStorage,
  filterChildrenAges,
} from '@/utils/localStorageHelpers';
import { createClient } from '@/lib/supabase/client';
import { checkExistingTrips, loadTripsFromSupabase } from '@/utils/bookingDbHelpers';
import { formatDate } from '@/lib/formatters';

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
  duration?: string | null;
  routeId?: number;
  pickup_address: string | null;
  dropoff_address: string | null;
  flight_number: string | null;
  airline: string | null;
  special_requests: string | null;
  final_price: number | null;
  night_surcharge: number | null;
  add_ons?: string[] | null;
  add_ons_price?: number | null;
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

function BookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ✅ Added null safety for searchParams
  const bookingId = searchParams?.get('booking_id');

  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [completedTrips, setCompletedTrips] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  // ✅ FIXED: Only set trip index AFTER trips are loaded to avoid race condition
  useEffect(() => {
    const tripParam = searchParams?.get('trip');
    if (tripParam && trips.length > 0) {
      const tripIndex = parseInt(tripParam, 10);
      if (!isNaN(tripIndex) && tripIndex >= 0 && tripIndex < trips.length) {
        setCurrentTripIndex(tripIndex);
      }
    }
  }, [searchParams, trips.length]);

  useEffect(() => {
    // ✅ FIXED: Safe window access
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentTripIndex]);

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
  const showFlightFields = isPickupFromAirport || isDropoffToAirport;

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

  useEffect(() => {
    async function loadTrips() {
      if (!bookingId) {
        router.push('/');
        return;
      }

      try {
        setLoading(true);
        const localData = loadBookingFromLocalStorage(bookingId);

        let loadedTrips: Trip[] = [];

        if (localData && localData.trips.length > 0) {
          // Load from localStorage
          loadedTrips = localData.trips.map((trip, index) => {
            const savedDetails = localData.tripDetails?.[index];
            const filteredChildrenAges = savedDetails?.children_ages
              ? filterChildrenAges(savedDetails.children_ages)
              : null;

            return {
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
              pickup_address: savedDetails?.pickup_address || null,
              dropoff_address: savedDetails?.dropoff_address || null,
              pickup_time: savedDetails?.pickup_time || null,
              flight_number: savedDetails?.flight_number || null,
              airline: savedDetails?.airline || null,
              special_requests: savedDetails?.special_requests || null,
              children_ages: filteredChildrenAges,
              add_ons: savedDetails?.add_ons || null,
              night_surcharge: savedDetails?.night_surcharge || null,
              add_ons_price: savedDetails?.add_ons_price || null,
              final_price: savedDetails?.final_price || null,
            };
          });
        } else {
          // Fallback: Load from Supabase (for when user comes back from checkout/summary)
          console.log('localStorage not found, trying Supabase...');
          const supabase = createClient();
          const existingTripIds = await checkExistingTrips(supabase, bookingId);

          if (existingTripIds.length === 0) {
            throw new Error('Booking not found.');
          }

          const supabaseTrips = await loadTripsFromSupabase(supabase, bookingId);

          if (!supabaseTrips || supabaseTrips.length === 0) {
            throw new Error('Failed to load booking from database.');
          }

          // Convert Supabase data to Trip format and restore to localStorage
          loadedTrips = supabaseTrips.map((trip, index) => ({
            id: trip.id,
            booking_id: trip.booking_id,
            from_location: trip.from_location || '',
            to_location: trip.to_location || '',
            date: trip.date || '',
            adults: trip.adults || 0,
            children: trip.children || 0,
            price: trip.price || 0,
            duration: trip.duration,
            routeId: trip.routeId,
            pickup_address: trip.pickup_address || null,
            dropoff_address: trip.dropoff_address || null,
            pickup_time: trip.pickup_time || null,
            flight_number: trip.flight_number || null,
            airline: trip.airline || null,
            special_requests: trip.special_requests || null,
            children_ages: trip.children_ages || null,
            add_ons: trip.add_ons || null,
            night_surcharge: trip.night_surcharge ?? null,
            add_ons_price: trip.add_ons_price ?? null,
            final_price: trip.final_price ?? null,
          }));

          // Restore to localStorage so subsequent navigations work
          const tripsForStorage = loadedTrips.map(trip => ({
            from_location: trip.from_location,
            to_location: trip.to_location,
            date: trip.date,
            adults: trip.adults,
            children: trip.children,
            price: trip.price,
            duration: trip.duration,
            routeId: trip.routeId,
          }));

          const tripDetailsForStorage = loadedTrips.map(trip => ({
            pickup_address: trip.pickup_address || '',
            dropoff_address: trip.dropoff_address || '',
            pickup_time: trip.pickup_time || '',
            flight_number: trip.flight_number || '',
            airline: trip.airline || '',
            special_requests: trip.special_requests || '',
            children_ages: trip.children_ages || [],
            add_ons: trip.add_ons || [],
            night_surcharge: trip.night_surcharge ?? 0,
            add_ons_price: trip.add_ons_price ?? 0,
            final_price: trip.final_price ?? trip.price ?? 0,
          }));

          saveBookingToLocalStorage(bookingId, tripsForStorage, tripDetailsForStorage);
        }

        if (loadedTrips.length === 0) {
          throw new Error('No trips found.');
        }

        setTrips(loadedTrips);

        const completed = loadedTrips
          .map((trip, idx) =>
            trip.pickup_time && trip.pickup_address && trip.dropoff_address ? idx : null
          )
          .filter((idx): idx is number => idx !== null);
        setCompletedTrips(completed);

        if (loadedTrips[0]) {
          const trip = loadedTrips[0];
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
        console.error('Error loading booking:', error);
        alert('Failed to load booking details.');
        router.push('/');
      }
    }

    loadTrips();
  }, [bookingId, router]);

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

  useEffect(() => {
    setErrors({});
  }, [formData.pickup_address, formData.dropoff_address, formData.pickup_time, formData.flight_number]);

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

  const saveToLocalStorage = () => {
    if (!bookingId) return;

    const tripDetails = {
      pickup_address: formData.pickup_address,
      dropoff_address: formData.dropoff_address,
      pickup_time: formData.pickup_time,
      flight_number: formData.flight_number,
      airline: formData.airline,
      special_requests: formData.special_requests,
      children_ages: formData.children_ages,
      add_ons: selectedAddOns,
      night_surcharge: priceCalculation.nightSurcharge,
      add_ons_price: priceCalculation.addOnsPrice,
      final_price: priceCalculation.subtotal,
    };

    const success = saveBookingDetailsToLocalStorage(bookingId, currentTripIndex, tripDetails);

    if (success) {
      setTrips((prevTrips) => {
        const newTrips = [...prevTrips];
        newTrips[currentTripIndex] = {
          ...newTrips[currentTripIndex],
          pickup_address: formData.pickup_address,
          dropoff_address: formData.dropoff_address,
          pickup_time: formData.pickup_time,
          flight_number: formData.flight_number,
          airline: formData.airline,
          special_requests: formData.special_requests,
          children_ages: filterChildrenAges(formData.children_ages),
          add_ons: selectedAddOns,
          night_surcharge: priceCalculation.nightSurcharge,
          add_ons_price: priceCalculation.addOnsPrice,
          final_price: priceCalculation.subtotal,
        };
        return newTrips;
      });
    }
  };

  const handleNext = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSaving(true);
      saveToLocalStorage();

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
      alert('Failed to save. Please try again.');
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (currentTripIndex > 0) {
      saveToLocalStorage();
      setCurrentTripIndex(currentTripIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      saveToLocalStorage();
      router.push(`/preview?booking_id=${bookingId}`);
    }
  };

  const parseDuration = (duration: string | null | undefined): string => {
    if (!duration) return '2-3';
    const match = duration.match(/(\d+\.?\d*)/);
    return match ? match[1] : '2-3';
  };

  if (loading) {
    return (
      <>
        <BookingNavbar />

        {/* Hero Skeleton */}
        <section className="relative h-36 sm:h-40 md:h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-700 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-64 bg-white/30 rounded-lg animate-pulse" />
          </div>
        </section>

        {/* Stepper Skeleton */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  <div className="hidden sm:block h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-6 pb-40 bg-gray-50 min-h-screen">
          {/* Trip Header Skeleton */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl px-4 py-3 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-white/30" />
                <div className="h-4 w-20 bg-white/30 rounded" />
              </div>
              <div className="h-6 w-16 bg-white/30 rounded" />
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="h-5 w-48 bg-white/20 rounded" />
              <div className="h-5 w-40 bg-white/20 rounded" />
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-white/20 rounded" />
              <div className="h-4 w-16 bg-white/20 rounded" />
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="bg-white rounded-b-xl border border-t-0 p-4 md:p-6 space-y-5">
            {[1, 2, 3].map((section) => (
              <div key={section} className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          {/* Add-ons Skeleton */}
          <div className="mt-4 bg-white rounded-xl border p-4">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((addon) => (
                <div key={addon} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-blue-100 rounded animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 h-12 bg-blue-200 rounded-lg animate-pulse" />
            </div>
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

  return (
    <>
      <BookingNavbar />

      {/* Compact Hero */}
      <section className="relative h-36 sm:h-40 md:h-48 w-full overflow-hidden">
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center px-4">
            Complete Your Booking
          </h1>
        </div>
      </section>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <BookingStepper currentStep={2} />
        </div>
      </div>

      {/* Trip Progress */}
      {trips.length > 1 && (
        <div className="bg-gray-100 py-3">
          <div className="max-w-4xl mx-auto px-4">
            <TripProgress
              currentTrip={currentTripIndex}
              totalTrips={trips.length}
              completedTrips={completedTrips}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-40 bg-gray-50 min-h-screen">

        {/* Trip Header - Mobile Responsive */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl px-4 py-3">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                {currentTripIndex + 1}
              </div>
              <span className="text-white/80 text-xs font-medium">Transfer {currentTripIndex + 1}</span>
            </div>
            <p className="text-white font-bold text-lg">${currentTrip.price}</p>
          </div>

          {/* Route - Vertical stack on mobile */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-white text-sm font-medium leading-tight">{currentTrip.from_location}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-orange-400/30 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-2.5 w-2.5 text-orange-200" />
              </div>
              <span className="text-white text-sm font-medium leading-tight">{currentTrip.to_location}</span>
            </div>
          </div>

          {/* Trip Details - Flexible wrap */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-blue-100 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(currentTrip.date)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {currentTrip.adults + currentTrip.children} pax
            </span>
            {currentTrip.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {currentTrip.duration}
              </span>
            )}
          </div>
        </div>

        {/* Main Form Card - All fields in one card */}
        <Card className="rounded-t-none border-t-0">
          <CardContent className="p-4 md:p-6 space-y-5">

            {/* Pickup Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold text-sm">Pickup Details</span>
              </div>

              <div>
                <Label htmlFor="pickup_address" className="text-sm">
                  {isPickupFromAirport ? 'Meeting Point' : 'Pickup Address'} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pickup_address"
                  placeholder={isPickupFromAirport ? "e.g., Airport Main Gate" : "Enter full pickup address"}
                  value={formData.pickup_address}
                  onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                  className={`min-h-[44px] ${errors.pickup_address ? 'border-red-500' : ''}`}
                />
                {errors.pickup_address && (
                  <p className="text-xs text-red-600 mt-1">{errors.pickup_address}</p>
                )}
              </div>

              <div>
                <Label htmlFor="pickup_time" className="text-sm">
                  Pickup Time <span className="text-red-500">*</span>
                </Label>
                <TimePicker value={formData.pickup_time} onChange={(v) => setFormData({ ...formData, pickup_time: v })} selectedDate={currentTrip?.date} />
                {errors.pickup_time && (
                  <p className="text-xs text-red-600 mt-1">{errors.pickup_time}</p>
                )}
                {priceCalculation.nightSurcharge > 0 && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span className="text-amber-800">Night surcharge (9PM-4AM): +${priceCalculation.nightSurcharge}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Drop-off Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-orange-600">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold text-sm">Drop-off Details</span>
              </div>

              <div>
                <Label htmlFor="dropoff_address" className="text-sm">
                  Drop-off Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dropoff_address"
                  placeholder="Enter full drop-off address"
                  value={formData.dropoff_address}
                  onChange={(e) => setFormData({ ...formData, dropoff_address: e.target.value })}
                  className={`min-h-[44px] ${errors.dropoff_address ? 'border-red-500' : ''}`}
                />
                {errors.dropoff_address && (
                  <p className="text-xs text-red-600 mt-1">{errors.dropoff_address}</p>
                )}
                {isDropoffToAirport && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg text-xs">
                    <Info className="h-4 w-4 text-orange-600 flex-shrink-0" />
                    <span className="text-orange-800">Trip ~{parseDuration(currentTrip.duration)} hrs. Arrive 3+ hrs before flight.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Flight Info - Only if relevant */}
            {showFlightFields && (
              <>
                <div className="border-t border-gray-200" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Plane className="h-4 w-4" />
                    <span className="font-semibold text-sm">Flight Info (Optional)</span>
                  </div>
                  {isPickupFromAirport && (
                    <p className="text-xs text-gray-500 -mt-2">We monitor your flight for delays</p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="airline" className="text-sm">Airline</Label>
                      <Input
                        id="airline"
                        placeholder="e.g., United"
                        value={formData.airline}
                        onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                        className="min-h-[44px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="flight_number" className="text-sm">Flight #</Label>
                      <Input
                        id="flight_number"
                        placeholder="e.g., UA 1234"
                        value={formData.flight_number}
                        onChange={(e) => setFormData({ ...formData, flight_number: e.target.value })}
                        className={`min-h-[44px] ${errors.flight_number ? 'border-red-500' : ''}`}
                      />
                      {errors.flight_number && (
                        <p className="text-xs text-red-600 mt-1">{errors.flight_number}</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Children Ages - Only if children */}
            {currentTrip.children > 0 && (
              <>
                <div className="border-t border-gray-200" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold text-sm">Children&apos;s Ages <span className="text-red-500">*</span></span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Array.from({ length: currentTrip.children }, (_, idx) => (
                      <div key={idx}>
                        <Label htmlFor={`child_age_${idx}`} className="text-xs text-gray-500">Child {idx + 1}</Label>
                        <select
                          id={`child_age_${idx}`}
                          value={formData.children_ages[idx] ?? ''}
                          onChange={(e) => {
                            const newAges = [...formData.children_ages];
                            newAges[idx] = e.target.value ? parseInt(e.target.value) : null;
                            setFormData({ ...formData, children_ages: newAges });
                          }}
                          className="w-full h-10 px-2 rounded-md border border-gray-300 bg-white text-sm"
                        >
                          <option value="">Age</option>
                          {Array.from({ length: 13 }, (_, i) => i).map((age) => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  {errors.children_ages && (
                    <p className="text-xs text-red-600">{errors.children_ages}</p>
                  )}
                </div>
              </>
            )}

            {/* Special Requests - Simple inline */}
            <div className="border-t border-gray-200" />
            <div>
              <Label htmlFor="special_requests" className="text-sm text-gray-600">
                Special Requests (Optional)
              </Label>
              <textarea
                id="special_requests"
                placeholder="Any special needs? Extra luggage, car seat, etc."
                value={formData.special_requests}
                onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add-ons Section - Always visible */}
        <div className="mt-4">
          <TripAddOns selectedAddOns={selectedAddOns} onAddOnsChange={setSelectedAddOns} />
        </div>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            {/* Price Summary */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs sm:text-sm">
                <span className="text-gray-600">Transfer {currentTripIndex + 1}:</span>
                {(priceCalculation.nightSurcharge > 0 || priceCalculation.addOnsPrice > 0) && (
                  <span className="text-[10px] sm:text-xs text-gray-500 ml-1 sm:ml-2 block sm:inline">
                    ${priceCalculation.basePrice}
                    {priceCalculation.nightSurcharge > 0 && ` +$${priceCalculation.nightSurcharge}`}
                    {priceCalculation.addOnsPrice > 0 && ` +$${priceCalculation.addOnsPrice}`}
                  </span>
                )}
              </div>
              <span className="text-xl sm:text-2xl font-bold text-blue-600">${priceCalculation.subtotal}</span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 min-h-[48px]"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={saving}
                className="flex-1 min-h-[48px] bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : currentTripIndex < trips.length - 1 ? (
                  <>
                    Next Trip
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continue to Summary
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
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
          {/* Hero Skeleton */}
          <section className="relative h-36 sm:h-40 md:h-48 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-700 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-64 bg-white/30 rounded-lg animate-pulse" />
            </div>
          </section>
          {/* Stepper Skeleton */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    <div className="hidden sm:block h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="max-w-4xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl px-4 py-4 animate-pulse">
              <div className="h-6 w-32 bg-white/30 rounded mb-2" />
              <div className="h-5 w-48 bg-white/20 rounded" />
            </div>
            <div className="bg-white rounded-b-xl border border-t-0 p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </>
      }
    >
      <BookingDetailsContent />
    </Suspense>
  );
}
