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
  ChevronDown,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import { IncludedFeatures, ImportantInfo } from '@/components/summary';
import { createClient } from '@/lib/supabase/client';
import { loadRoutesFromSupabase, type Route, calculateTripPrice } from '@/utils/bookingFormHelpers';
import { loadBookingFromLocalStorage } from '@/utils/localStorageHelpers';

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
  const bookingId = searchParams.get('booking_id');

  const [routes, setRoutes] = useState<Route[]>([]);
  const [trips, setTrips] = useState<TripPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddTrip, setShowAddTrip] = useState(false);

  // Edit form state
  const [editOrigin, setEditOrigin] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editPassengers, setEditPassengers] = useState(2);
  const [editOriginOpen, setEditOriginOpen] = useState(false);
  const [editDestinationOpen, setEditDestinationOpen] = useState(false);

  // Load booking data and routes
  useEffect(() => {
    async function load() {
      if (!bookingId) {
        router.push('/transfers');
        return;
      }

      try {
        // Load routes
        const supabase = createClient();
        const { routes: loadedRoutes } = await loadRoutesFromSupabase(supabase);
        if (loadedRoutes) {
          setRoutes(loadedRoutes);
        }

        // Load booking from localStorage
        const localData = loadBookingFromLocalStorage(bookingId);
        if (!localData) {
          router.push('/transfers');
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
      } catch (error) {
        console.error('Error loading preview:', error);
        router.push('/transfers');
      }
    }
    load();
  }, [bookingId, router]);

  // Get unique origins
  const origins = useMemo(() => {
    const originSet = new Set<string>();
    routes.forEach((r) => originSet.add(r.origen));
    return Array.from(originSet).sort();
  }, [routes]);

  // Get destinations for edit form
  const editDestinations = useMemo(() => {
    if (!editOrigin) return [];
    const destSet = new Set<string>();
    routes.filter((r) => r.origen === editOrigin).forEach((r) => destSet.add(r.destino));
    return Array.from(destSet).sort();
  }, [routes, editOrigin]);

  // Minimum date
  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  // Total price
  const totalPrice = useMemo(() => {
    return trips.reduce((sum, trip) => sum + trip.price, 0);
  }, [trips]);

  // Format date for display
  function formatDisplayDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Start editing a trip
  function startEdit(index: number) {
    const trip = trips[index];
    setEditOrigin(trip.from_location);
    setEditDestination(trip.to_location);
    setEditDate(trip.date);
    setEditPassengers(trip.adults + trip.children);
    setEditingIndex(index);
  }

  // Save edit
  function saveEdit() {
    if (editingIndex === null) return;

    const route = routes.find((r) => r.origen === editOrigin && r.destino === editDestination);
    if (!route) return;

    const price = calculateTripPrice(route, editPassengers);

    const newTrips = [...trips];
    newTrips[editingIndex] = {
      from_location: editOrigin,
      to_location: editDestination,
      date: editDate,
      adults: editPassengers,
      children: 0,
      price,
      duration: route.duracion,
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
  function startAddTrip() {
    const lastTrip = trips[trips.length - 1];
    setEditOrigin(lastTrip.to_location);
    setEditDestination('');
    setEditDate(lastTrip.date);
    setEditPassengers(lastTrip.adults + lastTrip.children);
    setShowAddTrip(true);
    setEditingIndex(null);
  }

  // Save new trip
  function saveNewTrip() {
    const route = routes.find((r) => r.origen === editOrigin && r.destino === editDestination);
    if (!route) return;

    const price = calculateTripPrice(route, editPassengers);

    const newTrip: TripPreview = {
      from_location: editOrigin,
      to_location: editDestination,
      date: editDate,
      adults: editPassengers,
      children: 0,
      price,
      duration: route.duracion,
      routeId: route.id,
    };

    const newTrips = [...trips, newTrip];
    setTrips(newTrips);
    saveToLocalStorage(newTrips);
    setShowAddTrip(false);
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

  if (!bookingId || trips.length === 0) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No booking found</h2>
            <button
              onClick={() => router.push('/transfers')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column: Trips */}
            <div className="lg:col-span-2 space-y-4">
              {trips.map((trip, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Trip Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-3 border-b border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {trips.length > 1 ? `Trip ${index + 1}` : 'Your Transfer'}
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
                    // Edit Mode
                    <div className="p-5 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Origin */}
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">From</label>
                          <button
                            type="button"
                            onClick={() => setEditOriginOpen(!editOriginOpen)}
                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:border-blue-400 text-left text-sm"
                          >
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="flex-1 truncate">{editOrigin || 'Select'}</span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </button>
                          {editOriginOpen && (
                            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                              {origins.map((loc) => (
                                <button
                                  key={loc}
                                  type="button"
                                  onClick={() => {
                                    setEditOrigin(loc);
                                    setEditDestination('');
                                    setEditOriginOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50"
                                >
                                  {loc}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Destination */}
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">To</label>
                          <button
                            type="button"
                            onClick={() => editOrigin && setEditDestinationOpen(!editDestinationOpen)}
                            disabled={!editOrigin}
                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:border-blue-400 text-left text-sm disabled:opacity-50"
                          >
                            <MapPin className="h-4 w-4 text-orange-500" />
                            <span className="flex-1 truncate">{editDestination || 'Select'}</span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </button>
                          {editDestinationOpen && (
                            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                              {editDestinations.map((loc) => (
                                <button
                                  key={loc}
                                  type="button"
                                  onClick={() => {
                                    setEditDestination(loc);
                                    setEditDestinationOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50"
                                >
                                  {loc}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Date */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            min={minDate}
                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>

                        {/* Passengers */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Passengers</label>
                          <div className="flex items-center h-11 border border-gray-200 rounded-lg bg-gray-50">
                            <button
                              type="button"
                              onClick={() => setEditPassengers(Math.max(1, editPassengers - 1))}
                              className="px-4 h-full hover:bg-gray-100 rounded-l-lg"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center text-sm font-medium">{editPassengers}</span>
                            <button
                              type="button"
                              onClick={() => setEditPassengers(Math.min(12, editPassengers + 1))}
                              className="px-4 h-full hover:bg-gray-100 rounded-r-lg"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Edit Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={cancelEdit}
                          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          disabled={!editOrigin || !editDestination || !editDate}
                          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="p-5">
                      {/* Route Display */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                            <MapPin className="h-3 w-3 text-blue-600" />
                            From
                          </div>
                          <p className="font-semibold text-gray-900">{trip.from_location}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                            <MapPin className="h-3 w-3 text-orange-500" />
                            To
                          </div>
                          <p className="font-semibold text-gray-900">{trip.to_location}</p>
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-medium text-gray-900">{formatDisplayDate(trip.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Passengers</p>
                            <p className="text-sm font-medium text-gray-900">{trip.adults + trip.children}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm font-medium text-gray-900">{trip.duration}</p>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-gray-600">Trip Price</span>
                        <span className="text-xl font-bold text-blue-600">${trip.price}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Trip Form */}
              {showAddTrip && (
                <div className="bg-white rounded-xl shadow-sm border border-dashed border-blue-300 overflow-hidden">
                  <div className="bg-blue-50 px-5 py-3 border-b border-blue-200">
                    <span className="font-semibold text-gray-900">Add Another Trip</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Origin */}
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">From</label>
                        <button
                          type="button"
                          onClick={() => setEditOriginOpen(!editOriginOpen)}
                          className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:border-blue-400 text-left text-sm"
                        >
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="flex-1 truncate">{editOrigin || 'Select'}</span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>
                        {editOriginOpen && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {origins.map((loc) => (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => {
                                  setEditOrigin(loc);
                                  setEditDestination('');
                                  setEditOriginOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50"
                              >
                                {loc}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Destination */}
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">To</label>
                        <button
                          type="button"
                          onClick={() => editOrigin && setEditDestinationOpen(!editDestinationOpen)}
                          disabled={!editOrigin}
                          className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 hover:border-blue-400 text-left text-sm disabled:opacity-50"
                        >
                          <MapPin className="h-4 w-4 text-orange-500" />
                          <span className="flex-1 truncate">{editDestination || 'Select'}</span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>
                        {editDestinationOpen && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {editDestinations.map((loc) => (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => {
                                  setEditDestination(loc);
                                  setEditDestinationOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50"
                              >
                                {loc}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Date */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          min={minDate}
                          className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>

                      {/* Passengers */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Passengers</label>
                        <div className="flex items-center h-11 border border-gray-200 rounded-lg bg-gray-50">
                          <button
                            type="button"
                            onClick={() => setEditPassengers(Math.max(1, editPassengers - 1))}
                            className="px-4 h-full hover:bg-gray-100 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center text-sm font-medium">{editPassengers}</span>
                          <button
                            type="button"
                            onClick={() => setEditPassengers(Math.min(12, editPassengers + 1))}
                            className="px-4 h-full hover:bg-gray-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Add Trip Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={cancelEdit}
                        className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveNewTrip}
                        disabled={!editOrigin || !editDestination || !editDate}
                        className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Trip
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Trip Button */}
              {!showAddTrip && editingIndex === null && (
                <button
                  onClick={startAddTrip}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Another Trip
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
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {trips.length > 1 ? `Trip ${index + 1}` : 'Transfer'}
                        </span>
                        <span className="font-medium text-gray-900">${trip.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
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
      </main>
    </>
  );
}

export default function PreviewPage() {
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
      <PreviewPageContent />
    </Suspense>
  );
}
