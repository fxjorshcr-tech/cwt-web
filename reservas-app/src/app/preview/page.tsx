// src/app/preview/page.tsx
// Preview page: Shows route details, price, allows editing and adding more trips
'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Loader2,
  MapPin,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Plus,
  X,
  Edit2,
  Check,
  AlertCircle,
  Shield,
  Car,
  BadgeCheck,
  Headphones,
  CheckCircle,
  Save,
  AlertTriangle,
  Flame,
  Sparkles,
  Plane,
} from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import { IncludedFeatures, ImportantInfo } from '@/components/summary';
import { TripAddOns, calculateAddOnsPrice } from '@/components/booking/TripAddOns';
import { Input } from '@/components/ui/input';
import { LocationAutocomplete } from '@/components/forms/LocationAutocomplete';
import { ModernDatePicker } from '@/components/forms/ModernDatePicker';
import { PassengerSelector } from '@/components/forms/PassengerSelector';
import { createClient } from '@/lib/supabase/client';
import { loadRoutesFromSupabase, type Route, calculateTripPrice } from '@/utils/bookingFormHelpers';
import { loadBookingFromLocalStorage, saveBookingToLocalStorage } from '@/utils/localStorageHelpers';
import { checkExistingTrips, loadTripsFromSupabase } from '@/utils/supabaseHelpers';
import { formatDateToString, parseDateFromString, getAvailabilityCount, getNowInCostaRica } from '@/utils/timeHelpers';

// Popular routes that get special badge
const POPULAR_ROUTES = [
  'SJO Airport - La Fortuna',
  'SJO Airport - Manuel Antonio',
  'SJO Airport - Tamarindo',
  'SJO Airport - Monteverde',
  'LIR Airport - Tamarindo',
  'LIR Airport - La Fortuna',
  'La Fortuna - Monteverde',
  'La Fortuna - Manuel Antonio',
];

// Check if a route is popular
function isPopularRoute(from: string, to: string): boolean {
  const routeKey = `${from} - ${to}`;
  return POPULAR_ROUTES.some(r =>
    routeKey.toLowerCase().includes(r.toLowerCase().split(' - ')[0]) &&
    routeKey.toLowerCase().includes(r.toLowerCase().split(' - ')[1])
  );
}

// Check if date is in high season (Dec-Apr, Easter week)
function isHighSeason(dateString: string): boolean {
  const date = parseDateFromString(dateString);
  if (isNaN(date.getTime())) return false;

  const month = date.getMonth(); // 0-11
  // High season: December (11), January (0), February (1), March (2), April (3)
  return month === 11 || month <= 3;
}

// Check if booking is last-minute (within 48 hours)
function isLastMinuteBooking(dateString: string): boolean {
  const bookingDate = parseDateFromString(dateString);
  if (isNaN(bookingDate.getTime())) return false;

  const now = getNowInCostaRica();
  const diffMs = bookingDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours > 0 && diffHours <= 48;
}

// Get days until booking
function getDaysUntilBooking(dateString: string): number {
  const bookingDate = parseDateFromString(dateString);
  if (isNaN(bookingDate.getTime())) return 999;

  const now = getNowInCostaRica();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = bookingDate.getTime() - todayStart.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

interface TripPreview {
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  price: number;
  duration: string;
  routeId: number;
  // Inline details
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  children_ages: (number | null)[];
  // Airport/Flight info
  flight_number: string;
  airline: string;
  // Add-ons
  add_ons: string[];
}

function PreviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ✅ Added null safety for searchParams
  const bookingId = searchParams?.get('booking_id');

  const [routes, setRoutes] = useState<Route[]>([]);
  const [trips, setTrips] = useState<TripPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'approved'>('idle');
  const [tripType, setTripType] = useState<'one-way' | 'multi'>('one-way');

  // Error states
  const [error, setError] = useState<string | null>(null); // Fatal errors (booking not found)
  const [validationError, setValidationError] = useState<string | null>(null); // Inline validation errors

  // Edit form state
  const [editOrigin, setEditOrigin] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editPickupTime, setEditPickupTime] = useState('');
  const [editAdults, setEditAdults] = useState(2);
  const [editChildren, setEditChildren] = useState(0);

  // Load booking data and routes
  useEffect(() => {
    async function load() {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      try {
        // Load routes
        const supabase = createClient();
        const { routes: loadedRoutes, error: routesError } = await loadRoutesFromSupabase(supabase);

        if (routesError) {
          setError('Failed to load routes. Please try again.');
          setLoading(false);
          return;
        }

        if (loadedRoutes) {
          setRoutes(loadedRoutes);
        }

        // Load booking from localStorage first
        const localData = loadBookingFromLocalStorage(bookingId);
        let loadedTrips: TripPreview[] = [];

        if (localData && localData.trips.length > 0) {
          // Load from localStorage
          loadedTrips = localData.trips.map((trip, index) => {
            const details = localData.tripDetails?.[index];
            return {
              from_location: trip.from_location,
              to_location: trip.to_location,
              date: trip.date,
              adults: trip.adults,
              children: trip.children || 0,
              price: trip.price,
              duration: trip.duration || '',
              routeId: trip.routeId || 0,
              pickup_address: details?.pickup_address || '',
              dropoff_address: details?.dropoff_address || '',
              pickup_time: details?.pickup_time || '', // Empty by default - must be selected
              children_ages: details?.children_ages || Array(trip.children || 0).fill(null),
              flight_number: details?.flight_number || '',
              airline: details?.airline || '',
              add_ons: details?.add_ons || [],
            };
          });

          // Load tripType from localStorage
          if (localData.tripType) {
            setTripType(localData.tripType);
          }
        } else {
          // Fallback: Load from Supabase if localStorage is empty
          console.log('localStorage empty, loading from Supabase...');
          const existingTripIds = await checkExistingTrips(supabase, bookingId);

          if (existingTripIds.length === 0) {
            setError('Booking not found. It may have expired.');
            setLoading(false);
            return;
          }

          const supabaseTrips = await loadTripsFromSupabase(supabase, bookingId);

          if (!supabaseTrips || supabaseTrips.length === 0) {
            setError('Failed to load booking details.');
            setLoading(false);
            return;
          }

          // Convert Supabase trips to TripPreview format and restore to localStorage
          const tripsForStorage = supabaseTrips.map((trip) => ({
            from_location: trip.from_location || '',
            to_location: trip.to_location || '',
            date: trip.date || '',
            adults: trip.adults || 1,
            children: trip.children || 0,
            price: trip.price || 0,
            duration: trip.duration || '',
            routeId: trip.routeId || 0,
            calculatedPrice: trip.price || 0,
          }));

          const tripDetailsForStorage = supabaseTrips.map((trip) => ({
            pickup_time: trip.pickup_time || '',
            pickup_address: trip.pickup_address || '',
            dropoff_address: trip.dropoff_address || '',
            flight_number: trip.flight_number || '',
            airline: trip.airline || '',
            special_requests: trip.special_requests || '',
            children_ages: trip.children_ages || [],
            add_ons: trip.add_ons || [],
            night_surcharge: trip.night_surcharge ?? 0,
            add_ons_price: trip.add_ons_price ?? 0,
            final_price: trip.final_price ?? trip.price ?? 0,
          }));

          // Save to localStorage for subsequent page loads
          saveBookingToLocalStorage(bookingId, {
            trips: tripsForStorage,
            tripDetails: tripDetailsForStorage,
            createdAt: new Date().toISOString(),
          });

          loadedTrips = supabaseTrips.map((trip) => ({
            from_location: trip.from_location || '',
            to_location: trip.to_location || '',
            date: trip.date || '',
            adults: trip.adults || 1,
            children: trip.children || 0,
            price: trip.price || 0,
            duration: trip.duration || '',
            routeId: trip.routeId || 0,
            pickup_address: trip.pickup_address || '',
            dropoff_address: trip.dropoff_address || '',
            pickup_time: trip.pickup_time || '', // Must be selected
            children_ages: trip.children_ages || Array(trip.children || 0).fill(null),
            flight_number: trip.flight_number || '',
            airline: trip.airline || '',
            add_ons: trip.add_ons || [],
          }));
        }

        if (loadedTrips.length === 0) {
          setError('Booking not found. It may have expired.');
          setLoading(false);
          return;
        }

        setTrips(loadedTrips);
        setLoading(false);
      } catch (err) {
        console.error('Error loading preview:', err);
        setError('Something went wrong loading your booking. Please try again.');
        setLoading(false);
      }
    }
    load();
  }, [bookingId, router]);

  // Total price (including add-ons)
  const totalPrice = useMemo(() => {
    return trips.reduce((sum, trip) => {
      const addOnsPrice = calculateAddOnsPrice(trip.add_ons || []);
      return sum + trip.price + addOnsPrice;
    }, 0);
  }, [trips]);

  // Format date for display
  // ✅ FIXED: Handle null/undefined dates safely
  function formatDisplayDate(dateStr: string | null | undefined): string {
    if (!dateStr || typeof dateStr !== 'string') return 'N/A';

    try {
      const date = parseDateFromString(dateStr);
      if (!date || isNaN(date.getTime())) return 'N/A';

      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }

  // Start editing a trip
  // ✅ FIXED: Check bounds before accessing array
  function startEdit(index: number) {
    if (!trips || index < 0 || index >= trips.length) return;

    const trip = trips[index];
    if (!trip) return;

    setEditOrigin(trip.from_location || '');
    setEditDestination(trip.to_location || '');
    setEditDate(trip.date ? parseDateFromString(trip.date) : null);
    setEditPickupTime(trip.pickup_time || '');
    setEditAdults(trip.adults || 1);
    setEditChildren(trip.children || 0);
    setEditingIndex(index);
    setShowAddTrip(false);
  }

  // Handle passengers change in edit mode
  const handleEditPassengersChange = (adults: number, children: number) => {
    setEditAdults(adults);
    setEditChildren(children);
  };

  // Save edit
  // ✅ FIXED: Handle null date and bounds check
  function saveEdit() {
    if (editingIndex === null || !editDate) return;
    if (editingIndex < 0 || editingIndex >= trips.length) return;

    const route = routes.find((r) => r.origen === editOrigin && r.destino === editDestination);
    if (!route) return;

    const totalPassengers = editAdults + editChildren;
    const price = calculateTripPrice(route, totalPassengers);
    const dateStr = formatDateToString(editDate);

    // ✅ Don't save if date formatting failed
    if (!dateStr) return;

    const existingTrip = trips[editingIndex];
    const newTrips = [...trips];

    // Adjust children_ages array if children count changed
    let childrenAges = existingTrip.children_ages || [];
    if (editChildren > childrenAges.length) {
      childrenAges = [...childrenAges, ...Array(editChildren - childrenAges.length).fill(null)];
    } else if (editChildren < childrenAges.length) {
      childrenAges = childrenAges.slice(0, editChildren);
    }

    newTrips[editingIndex] = {
      from_location: editOrigin,
      to_location: editDestination,
      date: dateStr,
      adults: editAdults,
      children: editChildren,
      price,
      duration: route.duracion || '',
      routeId: route.id,
      pickup_address: existingTrip.pickup_address || '',
      dropoff_address: existingTrip.dropoff_address || '',
      pickup_time: editPickupTime,
      children_ages: childrenAges,
      flight_number: existingTrip.flight_number || '',
      airline: existingTrip.airline || '',
      add_ons: existingTrip.add_ons || [],
    };

    setTrips(newTrips);
    saveToLocalStorage(newTrips);
    setEditingIndex(null);
  }

  // Cancel edit
  function cancelEdit() {
    setEditingIndex(null);
    setShowAddTrip(false);
  }

  // Add new trip
  // ✅ FIXED: Check if trips array has elements before accessing
  function startAddTrip() {
    if (!trips || trips.length === 0) {
      // Default values if no trips exist
      setEditOrigin('');
      setEditDestination('');
      setEditDate(null);
      setEditPickupTime('');
      setEditAdults(2);
      setEditChildren(0);
      setShowAddTrip(true);
      setEditingIndex(null);
      return;
    }

    const lastTrip = trips[trips.length - 1];
    setEditOrigin(lastTrip?.to_location || '');
    setEditDestination('');
    setEditDate(null); // New trip should have empty date
    setEditPickupTime('');
    setEditAdults(lastTrip?.adults || 2);
    setEditChildren(lastTrip?.children || 0);
    setShowAddTrip(true);
    setEditingIndex(null);
  }

  // Save new trip
  // ✅ FIXED: Handle null date gracefully
  async function saveNewTrip() {
    if (!editDate) return;

    const route = routes.find((r) => r.origen === editOrigin && r.destino === editDestination);
    if (!route) return;

    // Show "Preparing your quote..." for 300ms
    setAvailabilityStatus('checking');
    await new Promise(resolve => setTimeout(resolve, 300));

    // Show "Quote ready!" for 300ms
    setAvailabilityStatus('approved');
    await new Promise(resolve => setTimeout(resolve, 300));

    const totalPassengers = editAdults + editChildren;
    const price = calculateTripPrice(route, totalPassengers);
    const dateStr = formatDateToString(editDate);

    // ✅ Don't save if date formatting failed
    if (!dateStr) {
      setAvailabilityStatus('idle');
      return;
    }

    const newTrip: TripPreview = {
      from_location: editOrigin,
      to_location: editDestination,
      date: dateStr,
      adults: editAdults,
      children: editChildren,
      price,
      duration: route.duracion || '',
      routeId: route.id,
      pickup_address: '',
      dropoff_address: '',
      pickup_time: editPickupTime,
      children_ages: Array(editChildren).fill(null),
      flight_number: '',
      airline: '',
      add_ons: [],
    };

    const newTrips = [...trips, newTrip];
    setTrips(newTrips);
    saveToLocalStorage(newTrips);
    setShowAddTrip(false);
    setAvailabilityStatus('idle');
  }

  // Remove trip
  function removeTrip(index: number) {
    if (trips.length <= 1) return;
    const newTrips = trips.filter((_, i) => i !== index);
    setTrips(newTrips);
    saveToLocalStorage(newTrips);
  }

  // Save to localStorage
  function saveToLocalStorage(tripsToSave: TripPreview[]) {
    const bookingData = {
      bookingId,
      trips: tripsToSave.map((trip) => ({
        from_location: trip.from_location,
        to_location: trip.to_location,
        date: trip.date,
        adults: trip.adults,
        children: trip.children,
        price: trip.price,
        duration: trip.duration,
        routeId: trip.routeId,
        calculatedPrice: trip.price,
      })),
      tripDetails: tripsToSave.map((trip) => ({
        pickup_address: trip.pickup_address || '',
        dropoff_address: trip.dropoff_address || '',
        pickup_time: trip.pickup_time || '',
        flight_number: trip.flight_number || '',
        airline: trip.airline || '',
        special_requests: '',
        children_ages: trip.children_ages || [],
        add_ons: trip.add_ons || [],
        night_surcharge: 0,
        add_ons_price: calculateAddOnsPrice(trip.add_ons || []),
        final_price: trip.price + calculateAddOnsPrice(trip.add_ons || []),
      })),
      tripType, // Save trip type (one-way or multi)
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));
  }

  // Continue directly to checkout (only save to localStorage, NOT Supabase)
  function handleContinue() {
    if (!bookingId) return;

    // Clear any previous validation error
    setValidationError(null);

    // Validate pickup time is selected
    const missingPickupTime = trips.filter(trip => !trip.pickup_time);
    if (missingPickupTime.length > 0) {
      setValidationError('Please select a pickup time for all transfers');
      return;
    }

    // Validate that all required inline fields are filled
    const incompleteTrips = trips.filter(trip => !trip.pickup_address || !trip.dropoff_address);
    if (incompleteTrips.length > 0) {
      setValidationError('Please fill in pickup and drop-off addresses for all transfers');
      return;
    }

    // Validate children ages if there are children
    const missingChildrenAges = trips.filter(trip =>
      trip.children > 0 && trip.children_ages.filter(age => age !== null).length < trip.children
    );
    if (missingChildrenAges.length > 0) {
      setValidationError('Please provide ages for all children');
      return;
    }

    // Save to localStorage and navigate
    saveToLocalStorage(trips);
    router.push(`/checkout?booking_id=${bookingId}`);
  }

  // Update trip inline field
  function updateTripField(index: number, field: keyof TripPreview, value: any) {
    const newTrips = [...trips];
    newTrips[index] = { ...newTrips[index], [field]: value };
    setTrips(newTrips);
    // Auto-save to localStorage
    saveToLocalStorage(newTrips);
  }

  // Update child age
  function updateChildAge(tripIndex: number, childIndex: number, age: number | null) {
    const newTrips = [...trips];
    const newAges = [...(newTrips[tripIndex].children_ages || [])];
    newAges[childIndex] = age;
    newTrips[tripIndex] = { ...newTrips[tripIndex], children_ages: newAges };
    setTrips(newTrips);
    saveToLocalStorage(newTrips);
  }

  // Update add-ons for a trip
  function updateTripAddOns(tripIndex: number, addOns: string[]) {
    const newTrips = [...trips];
    newTrips[tripIndex] = { ...newTrips[tripIndex], add_ons: addOns };
    setTrips(newTrips);
    saveToLocalStorage(newTrips);
  }

  // Update passengers for a trip (recalculates price)
  function updateTripPassengers(tripIndex: number, adults: number, children: number) {
    const trip = trips[tripIndex];
    const route = routes.find(r => r.id === trip.routeId);
    if (!route) return;

    const totalPassengers = adults + children;
    const newPrice = calculateTripPrice(route, totalPassengers);

    // Adjust children_ages array
    let childrenAges = trip.children_ages || [];
    if (children > childrenAges.length) {
      childrenAges = [...childrenAges, ...Array(children - childrenAges.length).fill(null)];
    } else if (children < childrenAges.length) {
      childrenAges = childrenAges.slice(0, children);
    }

    const newTrips = [...trips];
    newTrips[tripIndex] = {
      ...trip,
      adults,
      children,
      price: newPrice,
      children_ages: childrenAges,
    };
    setTrips(newTrips);
    saveToLocalStorage(newTrips);
  }

  // Render edit/add form
  function renderEditForm(isNewTrip: boolean) {
    return (
      <div className="p-5 space-y-4 relative notranslate" style={{ minHeight: '320px' }} translate="no">
        <div className="grid sm:grid-cols-2 gap-4 relative z-30">
          {/* Origin */}
          <div className="relative z-40">
            <LocationAutocomplete
              label="Pick-up Location"
              placeholder="Where from?"
              value={editOrigin}
              onChange={(val) => {
                setEditOrigin(val);
                // Reset destination if origin changes
                if (val !== editOrigin) {
                  setEditDestination('');
                }
              }}
              routes={routes}
              filterByDestination={editDestination}
              type="origin"
            />
          </div>

          {/* Destination */}
          <div className="relative z-30">
            <LocationAutocomplete
              label="Drop-off Location"
              placeholder={editOrigin ? "Where to?" : "Select origin first"}
              value={editDestination}
              onChange={setEditDestination}
              routes={routes}
              filterByOrigin={editOrigin}
              disabled={!editOrigin}
              type="destination"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 relative z-20">
          {/* Date */}
          <div className="relative z-20">
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</label>
            <ModernDatePicker
              value={editDate}
              onChange={setEditDate}
              enforceMinimumAdvance={true}
            />
          </div>

          {/* Passengers */}
          <div className="relative z-10">
            <PassengerSelector
              label="Passengers"
              adults={editAdults}
              children={editChildren}
              onPassengersChange={handleEditPassengersChange}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={cancelEdit}
            disabled={availabilityStatus !== 'idle'}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={isNewTrip ? saveNewTrip : saveEdit}
            disabled={!editOrigin || !editDestination || !editDate || availabilityStatus !== 'idle'}
            className={`flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              availabilityStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300'
            }`}
          >
            {availabilityStatus === 'checking' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing your quote...
              </>
            ) : availabilityStatus === 'approved' ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Quote ready!
              </>
            ) : isNewTrip ? (
              <>
                <Save className="h-4 w-4" />
                Save Transfer
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <BookingNavbar />

        {/* Hero Skeleton */}
        <section className="relative h-48 md:h-56 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-700 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="h-8 w-48 bg-white/30 rounded-lg mx-auto mb-2 animate-pulse" />
              <div className="h-5 w-64 bg-white/20 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </section>

        {/* Stepper Skeleton */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-6">
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
        <div className="bg-gray-50 py-8 pb-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Trip Cards Skeleton */}
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="bg-blue-100 px-5 py-3 border-b border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-300" />
                        <div className="h-5 w-24 bg-blue-200 rounded" />
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 w-3/4 bg-gray-200 rounded" />
                      <div className="h-6 w-2/3 bg-gray-200 rounded" />
                      <div className="grid grid-cols-4 gap-3 pt-4">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="h-16 bg-gray-100 rounded-lg" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column - Summary Skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="bg-blue-600 px-5 py-4">
                    <div className="h-6 w-32 bg-white/30 rounded" />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-full bg-gray-200 rounded" />
                    <div className="h-5 w-full bg-gray-200 rounded" />
                    <div className="pt-3 border-t border-gray-200">
                      <div className="h-8 w-24 bg-blue-100 rounded ml-auto" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-14 bg-blue-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || (!bookingId && !loading) || (trips.length === 0 && !loading)) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center px-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'No booking found'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              {error
                ? 'Please start a new search to continue.'
                : 'Your booking may have expired. Please start a new search.'
              }
            </p>
            <button
              onClick={() => router.push('/transfers')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Start New Search
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <BookingNavbar />

      {/* Hero */}
      <section className="relative h-48 md:h-56 w-full overflow-hidden">
        <Image
          src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp"
          alt="Costa Rica"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">Review Your Trip</h1>
            <p className="text-sm md:text-lg drop-shadow-md">
              Confirm details and add more rides if needed
            </p>
          </div>
        </div>
      </section>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm overflow-hidden">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <BookingStepper currentStep={1} />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-6 sm:py-8 pb-24 overflow-x-hidden w-full max-w-[100vw]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {/* Left Column: Trips */}
            <div className="lg:col-span-2 space-y-4 w-full min-w-0">
              {trips.map((trip, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full"
                >
                  {/* Trip Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-3 sm:px-5 py-3 border-b border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {trips.length > 1 ? `Transfer ${index + 1}` : 'Your Transfer'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingIndex !== index && (
                        <>
                          <button
                            onClick={() => startEdit(index)}
                            className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 text-blue-700" />
                          </button>
                          {trips.length > 1 && (
                            <button
                              onClick={() => removeTrip(index)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Trip Content */}
                  {editingIndex === index ? (
                    renderEditForm(false)
                  ) : (
                    // View Mode
                    <div className="p-3 sm:p-5">
                      {/* 1. Trip Info Summary - FIRST (Date, Pax, Duration, Price) */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <Calendar className="h-4 w-4 text-blue-500 mx-auto mb-0.5" />
                          <p className="text-[9px] text-gray-500 uppercase">Date</p>
                          <p className="text-[11px] font-semibold text-gray-900">{formatDisplayDate(trip.date)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <Users className="h-4 w-4 text-blue-500 mx-auto mb-0.5" />
                          <p className="text-[9px] text-gray-500 uppercase">Pax</p>
                          <p className="text-[11px] font-semibold text-gray-900">{trip.adults + trip.children}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <Clock className="h-4 w-4 text-blue-500 mx-auto mb-0.5" />
                          <p className="text-[9px] text-gray-500 uppercase">Duration</p>
                          <p className="text-[11px] font-semibold text-gray-900">{trip.duration || 'N/A'}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-[9px] text-blue-600 uppercase font-medium">Price</p>
                          <p className="text-base font-bold text-blue-600">
                            ${trip.price + calculateAddOnsPrice(trip.add_ons || [])}
                          </p>
                        </div>
                      </div>

                      {/* 2. Availability & Alerts Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(() => {
                          const availableVans = getAvailabilityCount(trip.from_location, trip.to_location, trip.date);
                          const totalSlots = 8;
                          const isLow = availableVans <= 2;
                          return (
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] ${
                              isLow
                                ? 'bg-red-50 border border-red-200'
                                : 'bg-green-50 border border-green-200'
                            }`}>
                              <Car className={`h-3 w-3 ${isLow ? 'text-red-500' : 'text-green-500'}`} />
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: totalSlots }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      i < availableVans
                                        ? isLow ? 'bg-red-500' : 'bg-green-500'
                                        : 'bg-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {isLow && (
                                <span className="text-red-600 font-semibold">Book soon!</span>
                              )}
                            </div>
                          );
                        })()}
                        {isHighSeason(trip.date) && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 border border-amber-300 rounded-lg text-xs">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            <span className="font-bold text-amber-700">High Season</span>
                          </div>
                        )}
                        {isPopularRoute(trip.from_location, trip.to_location) && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-100 border border-orange-300 rounded-lg text-xs">
                            <Flame className="h-3.5 w-3.5 text-orange-500" />
                            <span className="font-bold text-orange-700">Popular</span>
                          </div>
                        )}
                      </div>

                      {/* 3. Route Details with inputs */}
                      <div className="space-y-3 mb-4">
                        {/* FROM section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] text-gray-500 uppercase">From</p>
                              <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{trip.from_location}</p>
                            </div>
                          </div>
                          {/* Pickup Time - own row */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] text-gray-600">Pickup:</span>
                            <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] ${
                              trip.pickup_time
                                ? 'bg-blue-600 text-white'
                                : 'bg-orange-500 text-white animate-pulse'
                            }`}>
                              <Clock className="h-2.5 w-2.5" />
                              <select
                                value={trip.pickup_time}
                                onChange={(e) => updateTripField(index, 'pickup_time', e.target.value)}
                                className="bg-transparent text-white text-[11px] font-medium focus:outline-none cursor-pointer pr-1"
                              >
                                <option value="" className="text-gray-900">Select time</option>
                                {Array.from({ length: 48 }, (_, i) => {
                                  const hour = Math.floor(i / 2);
                                  const minute = i % 2 === 0 ? '00' : '30';
                                  const value = `${hour.toString().padStart(2, '0')}:${minute}`;
                                  const label = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${minute} ${hour < 12 ? 'AM' : 'PM'}`;
                                  return <option key={value} value={value} className="text-gray-900">{label}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                          <Input
                            placeholder="Pickup address (hotel, Airbnb...)"
                            value={trip.pickup_address}
                            onChange={(e) => updateTripField(index, 'pickup_address', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>

                        {/* TO section with dropoff address */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-3 w-3 text-orange-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] text-gray-500 uppercase">To</p>
                              <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{trip.to_location}</p>
                            </div>
                          </div>
                          <Input
                            placeholder="Drop-off address (hotel, Airbnb...)"
                            value={trip.dropoff_address}
                            onChange={(e) => updateTripField(index, 'dropoff_address', e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>

                        {/* Flight Information - only for airport routes */}
                        {(trip.from_location.toLowerCase().includes('airport') ||
                          trip.from_location.includes('SJO') ||
                          trip.from_location.includes('LIR') ||
                          trip.to_location.toLowerCase().includes('airport') ||
                          trip.to_location.includes('SJO') ||
                          trip.to_location.includes('LIR')) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                <Plane className="h-3 w-3 inline mr-1" />
                                Flight Number (optional)
                              </label>
                              <Input
                                placeholder="e.g. AA1234"
                                value={trip.flight_number}
                                onChange={(e) => updateTripField(index, 'flight_number', e.target.value)}
                                className="h-9 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Airline (optional)
                              </label>
                              <Input
                                placeholder="e.g. American Airlines"
                                value={trip.airline}
                                onChange={(e) => updateTripField(index, 'airline', e.target.value)}
                                className="h-9 text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {/* Passengers Selector */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-700 mb-3 flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            Passengers
                          </p>
                          <div className="flex flex-wrap gap-4 sm:gap-6">
                            {/* Adults */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-700 font-medium min-w-[50px]">Adults</span>
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => updateTripPassengers(index, Math.max(1, trip.adults - 1), trip.children)}
                                  disabled={trip.adults <= 1}
                                  className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-lg font-medium transition-colors"
                                >
                                  -
                                </button>
                                <span className="w-10 h-9 flex items-center justify-center text-base font-semibold bg-white">{trip.adults}</span>
                                <button
                                  type="button"
                                  onClick={() => updateTripPassengers(index, Math.min(12, trip.adults + 1), trip.children)}
                                  disabled={trip.adults + trip.children >= 12}
                                  className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-lg font-medium transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            {/* Children */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-700 font-medium min-w-[55px]">Children</span>
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => updateTripPassengers(index, trip.adults, Math.max(0, trip.children - 1))}
                                  disabled={trip.children <= 0}
                                  className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-lg font-medium transition-colors"
                                >
                                  -
                                </button>
                                <span className="w-10 h-9 flex items-center justify-center text-base font-semibold bg-white">{trip.children}</span>
                                <button
                                  type="button"
                                  onClick={() => updateTripPassengers(index, trip.adults, Math.min(11, trip.children + 1))}
                                  disabled={trip.adults + trip.children >= 12}
                                  className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-lg font-medium transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Children Ages - only if there are children */}
                        {trip.children > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-xs font-medium text-orange-800 mb-2">
                              Children&apos;s Ages (required for car seats)
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {Array.from({ length: trip.children }, (_, childIdx) => (
                                <select
                                  key={childIdx}
                                  value={trip.children_ages?.[childIdx] ?? ''}
                                  onChange={(e) => updateChildAge(index, childIdx, e.target.value ? parseInt(e.target.value) : null)}
                                  className="w-20 h-9 px-2 rounded-md border border-orange-300 bg-white text-sm"
                                >
                                  <option value="">Age</option>
                                  {Array.from({ length: 13 }, (_, age) => (
                                    <option key={age} value={age}>{age}</option>
                                  ))}
                                </select>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add-ons */}
                        <TripAddOns
                          selectedAddOns={trip.add_ons || []}
                          onAddOnsChange={(addOns) => updateTripAddOns(index, addOns)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Transfer Button - Only show for multi-destination */}
              {tripType === 'multi' && editingIndex === null && (
                <button
                  onClick={startAddTrip}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Another Transfer
                </button>
              )}

              {/* Add Transfer Modal */}
              {showAddTrip && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/50"
                    onClick={cancelEdit}
                  />

                  {/* Modal */}
                  <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-visible">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Add Another Transfer</h3>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Form Content */}
                      <div className="p-4 space-y-4">
                        {/* Origin & Destination Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                            <LocationAutocomplete
                              placeholder="Where from?"
                              value={editOrigin}
                              onChange={(val) => {
                                setEditOrigin(val);
                                if (val !== editOrigin) setEditDestination('');
                              }}
                              routes={routes}
                              filterByDestination={editDestination}
                              type="origin"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                            <LocationAutocomplete
                              placeholder={editOrigin ? "Where to?" : "Select origin first"}
                              value={editDestination}
                              onChange={setEditDestination}
                              routes={routes}
                              filterByOrigin={editOrigin}
                              disabled={!editOrigin}
                              type="destination"
                            />
                          </div>
                        </div>

                        {/* Date/Time & Passengers Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                            <ModernDatePicker
                              value={editDate}
                              onChange={setEditDate}
                              enforceMinimumAdvance={true}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                            <PassengerSelector
                              adults={editAdults}
                              children={editChildren}
                              onPassengersChange={handleEditPassengersChange}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={cancelEdit}
                            className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveNewTrip}
                            disabled={!editOrigin || !editDestination || !editDate || availabilityStatus !== 'idle'}
                            className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                              availabilityStatus === 'approved'
                                ? 'bg-green-600 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
                            }`}
                          >
                            {availabilityStatus === 'checking' ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Preparing quote...
                              </>
                            ) : availabilityStatus === 'approved' ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Quote ready!
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4" />
                                Add Transfer
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Summary & Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-[140px] space-y-4">
                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                    <h2 className="text-white font-bold text-lg">Order Summary</h2>
                  </div>
                  <div className="p-5 space-y-3">
                    {trips.map((trip, index) => {
                      const addOnsPrice = calculateAddOnsPrice(trip.add_ons || []);
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {trips.length > 1 ? `Transfer ${index + 1}` : 'Transfer'}
                            </span>
                            <span className="font-bold text-gray-900">${trip.price}</span>
                          </div>
                          {addOnsPrice > 0 && (
                            <div className="flex items-center justify-between text-blue-600">
                              <span className="text-xs pl-2">+ Add-ons</span>
                              <span className="text-sm font-medium">+${addOnsPrice}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Total */}
                    <div className="pt-3 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-lg">Total</span>
                        <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validation Error */}
                {validationError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{validationError}</p>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={editingIndex !== null || showAddTrip}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  Continue to Checkout
                  <ArrowRight className="h-5 w-5" />
                </button>

                {/* Included Features */}
                <IncludedFeatures />

                {/* Important Info */}
                <ImportantInfo />
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-5xl mx-auto px-4 mt-12 border-t border-gray-200 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-sm border border-gray-200">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Car className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">100% Private</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">No shared shuttles</p>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-sm border border-gray-200">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Fully Insured</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">Complete coverage</p>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-sm border border-gray-200">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Licensed & Vetted</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">Certified drivers</p>
            </div>
            <div className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-sm border border-gray-200">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Headphones className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Dedicated Support</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">Here to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <>
          <BookingNavbar />
          {/* Hero Skeleton */}
          <section className="relative h-48 md:h-56 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-700 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-48 bg-white/30 rounded-lg animate-pulse" />
            </div>
          </section>
          {/* Stepper Skeleton */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="bg-gray-50 py-8 min-h-screen">
            <div className="max-w-5xl mx-auto px-4">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-xl h-48 animate-pulse" />
                </div>
                <div className="bg-white rounded-xl h-64 animate-pulse" />
              </div>
            </div>
          </div>
        </>
      }
    >
      <PreviewPageContent />
    </Suspense>
  );
}
