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
} from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import { IncludedFeatures, ImportantInfo } from '@/components/summary';
import { LocationAutocomplete } from '@/components/forms/LocationAutocomplete';
import { ModernDatePicker } from '@/components/forms/ModernDatePicker';
import { PassengerSelector } from '@/components/forms/PassengerSelector';
import { createClient } from '@/lib/supabase/client';
import { loadRoutesFromSupabase, type Route, calculateTripPrice } from '@/utils/bookingFormHelpers';
import { loadBookingFromLocalStorage } from '@/utils/localStorageHelpers';
import { formatDateToString, parseDateFromString, getAvailabilityCount } from '@/utils/timeHelpers';

interface TripPreview {
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  price: number;
  duration: string;
  routeId: number;
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

  // Edit form state
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [editOrigin, setEditOrigin] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editDate, setEditDate] = useState<Date | null>(null);
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

        // Load booking from localStorage
        const localData = loadBookingFromLocalStorage(bookingId);
        if (!localData) {
          setError('Booking not found. It may have expired.');
          setLoading(false);
          return;
        }

        const loadedTrips: TripPreview[] = localData.trips.map((trip) => ({
          from_location: trip.from_location,
          to_location: trip.to_location,
          date: trip.date,
          adults: trip.adults,
          children: trip.children || 0,
          price: trip.price,
          duration: trip.duration || '',
          routeId: trip.routeId || 0,
        }));

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

  // Total price
  const totalPrice = useMemo(() => {
    return trips.reduce((sum, trip) => sum + trip.price, 0);
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

    const newTrips = [...trips];
    newTrips[editingIndex] = {
      from_location: editOrigin,
      to_location: editDestination,
      date: dateStr,
      adults: editAdults,
      children: editChildren,
      price,
      duration: route.duracion || '',
      routeId: route.id,
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
      setEditAdults(2);
      setEditChildren(0);
      setShowAddTrip(true);
      setEditingIndex(null);
      return;
    }

    const lastTrip = trips[trips.length - 1];
    setEditOrigin(lastTrip?.to_location || '');
    setEditDestination('');
    setEditDate(lastTrip?.date ? parseDateFromString(lastTrip.date) : null);
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
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));
  }

  // Continue to details
  function handleContinue() {
    saveToLocalStorage(trips);
    router.push(`/booking-details?booking_id=${bookingId}&trip=0`);
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
            <ModernDatePicker
              label="Travel Date"
              value={editDate}
              onChange={setEditDate}
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
    <>
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <BookingStepper currentStep={1} />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-8 pb-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column: Trips */}
            <div className="lg:col-span-2 space-y-4">
              {trips.map((trip, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible"
                >
                  {/* Trip Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-3 border-b border-blue-200 flex items-center justify-between">
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
                    <div className="p-4 sm:p-5">
                      {/* Route Display - Vertical on mobile */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-3 w-3 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-gray-500 uppercase">From</p>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{trip.from_location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-3 w-3 text-orange-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-gray-500 uppercase">To</p>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{trip.to_location}</p>
                          </div>
                        </div>
                      </div>

                      {/* Availability Confirmation Message */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg mb-4">
                        <Car className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <p className="text-xs text-green-800">
                          <span className="font-semibold">Van and driver available</span> — limited slots for this date
                        </p>
                      </div>

                      {/* Trip Details - 2x2 grid on mobile */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <Calendar className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                          <p className="text-[10px] text-gray-500 uppercase">Date</p>
                          <p className="text-xs font-semibold text-gray-900">{formatDisplayDate(trip.date)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <Users className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                          <p className="text-[10px] text-gray-500 uppercase">Guests</p>
                          <p className="text-xs font-semibold text-gray-900">{trip.adults + trip.children} pax</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <Clock className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                          <p className="text-[10px] text-gray-500 uppercase">Duration</p>
                          <p className="text-xs font-semibold text-gray-900">{trip.duration || 'N/A'}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <p className="text-[10px] text-blue-600 uppercase font-medium">Price</p>
                          <p className="text-lg font-bold text-blue-600">${trip.price}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Transfer Form */}
              {showAddTrip && (
                <div className="bg-white rounded-xl shadow-sm border border-dashed border-blue-300 overflow-visible">
                  <div className="bg-blue-50 px-5 py-3 border-b border-blue-200">
                    <span className="font-semibold text-gray-900">Add Another Transfer</span>
                  </div>
                  {renderEditForm(true)}
                </div>
              )}

              {/* Add Transfer Button */}
              {!showAddTrip && editingIndex === null && (
                <button
                  onClick={startAddTrip}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Another Transfer
                </button>
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
                    {trips.map((trip, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {trips.length > 1 ? `Transfer ${index + 1}` : 'Transfer'}
                        </span>
                        <span className="font-bold text-gray-900">${trip.price}</span>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="pt-3 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-lg">Total</span>
                        <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Taxes and fees included</p>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={editingIndex !== null || showAddTrip}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  Continue to Details
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
    </>
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
