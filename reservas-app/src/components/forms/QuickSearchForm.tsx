// src/components/forms/QuickSearchForm.tsx
// ✅ REDESIGNED: Horizontal layout + Multi-destination support
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, AlertCircle, X, CheckCircle, Plus, Trash2, Users, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { LocationAutocomplete } from './LocationAutocomplete';
import { ModernDatePicker } from './ModernDatePicker';
import { loadRoutesFromSupabase, calculateTripPrice, type Route } from '@/utils/bookingFormHelpers';
import { formatDateToString } from '@/utils/timeHelpers';
import { isLocalStorageAvailable, saveBookingToLocalStorage } from '@/utils/localStorageHelpers';

interface TripInput {
  origin: string;
  destination: string;
  date: Date | null;
  pickupTime: string;
}

interface QuickSearchFormProps {
  className?: string;
  initialOrigin?: string;
  initialDestination?: string;
}

export function QuickSearchForm({
  className = '',
  initialOrigin = '',
  initialDestination = '',
}: QuickSearchFormProps) {
  const router = useRouter();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'approved'>('idle');

  // Trip type toggle
  const [tripType, setTripType] = useState<'one-way' | 'multi'>('one-way');

  // Multi-trip state
  const [trips, setTrips] = useState<TripInput[]>([
    { origin: initialOrigin, destination: initialDestination, date: null, pickupTime: '09:00' }
  ]);

  // Shared passengers (same for all trips)
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  // Update first trip when initial values change
  useEffect(() => {
    if (initialOrigin || initialDestination) {
      setTrips(prev => [{
        ...prev[0],
        origin: initialOrigin || prev[0].origin,
        destination: initialDestination || prev[0].destination,
      }]);
    }
  }, [initialOrigin, initialDestination]);

  // Load routes
  useEffect(() => {
    async function loadRoutes() {
      setIsLoadingRoutes(true);
      setError(null);
      try {
        const supabase = createClient();
        const { routes: loadedRoutes, error: loadError } = await loadRoutesFromSupabase(supabase);
        if (loadError) {
          setError(loadError);
        } else if (loadedRoutes) {
          setRoutes(loadedRoutes);
        }
      } catch (err) {
        console.error('Error loading routes:', err);
        setError('Unable to connect to our servers. Please try again.');
      }
      setIsLoadingRoutes(false);
    }
    loadRoutes();
  }, []);

  // Update trip field
  const updateTrip = (index: number, field: keyof TripInput, value: any) => {
    setTrips(prev => {
      const newTrips = [...prev];
      newTrips[index] = { ...newTrips[index], [field]: value };

      // Reset destination if origin changes and they're now the same
      if (field === 'origin' && newTrips[index].destination === value) {
        newTrips[index].destination = '';
      }

      return newTrips;
    });
  };

  // Add new trip (for multi-destination)
  const addTrip = () => {
    const lastTrip = trips[trips.length - 1];
    setTrips(prev => [...prev, {
      origin: lastTrip.destination, // Next trip starts from last destination
      destination: '',
      date: null,
      pickupTime: '09:00',
    }]);
  };

  // Remove trip
  const removeTrip = (index: number) => {
    if (trips.length > 1) {
      setTrips(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const totalPassengers = adults + children;

    // Validate all trips
    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];
      if (!trip.origin || !trip.destination || !trip.date) {
        setError(`Please complete all fields for ${trips.length > 1 ? `Transfer ${i + 1}` : 'your transfer'}`);
        return;
      }
    }

    if (totalPassengers > 12) {
      setError('For groups larger than 12, please contact us via WhatsApp');
      return;
    }

    if (!isLocalStorageAvailable()) {
      setError('Your browser settings are blocking this feature. Please enable cookies/localStorage.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate all routes exist
      const tripData = [];
      const tripDetails = [];

      for (const trip of trips) {
        const route = routes.find(r => r.origen === trip.origin && r.destino === trip.destination);
        if (!route) {
          setError(`Route not available: ${trip.origin} → ${trip.destination}`);
          setIsSubmitting(false);
          return;
        }

        const price = calculateTripPrice(route, totalPassengers);
        const dateStr = formatDateToString(trip.date!);

        tripData.push({
          from_location: trip.origin,
          to_location: trip.destination,
          date: dateStr,
          adults,
          children,
          price,
          duration: route.duracion,
          routeId: route.id,
          calculatedPrice: price,
        });

        tripDetails.push({
          pickup_time: trip.pickupTime,
          pickup_address: '',
          dropoff_address: '',
          flight_number: '',
          airline: '',
          special_requests: '',
          children_ages: [],
          add_ons: [],
          night_surcharge: 0,
          add_ons_price: 0,
          final_price: price,
        });
      }

      setAvailabilityStatus('checking');
      await new Promise(resolve => setTimeout(resolve, 300));
      setAvailabilityStatus('approved');
      await new Promise(resolve => setTimeout(resolve, 300));

      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const bookingData = {
        trips: tripData,
        tripDetails,
        tripType, // Save trip type to know if it's one-way or multi
        createdAt: new Date().toISOString(),
      };

      const saved = saveBookingToLocalStorage(bookingId, bookingData);
      if (!saved) {
        throw new Error('Failed to save booking data.');
      }

      router.push(`/preview?booking_id=${bookingId}`);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsSubmitting(false);
      setAvailabilityStatus('idle');
    }
  }

  // Loading state
  if (isLoadingRoutes) {
    return (
      <div className={`bg-[#0a1628] rounded-2xl shadow-xl overflow-visible notranslate ${className}`} translate="no">
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <div className="h-8 w-20 bg-gray-700 rounded-full animate-pulse" />
            <div className="h-8 w-32 bg-gray-700 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-14 flex-1 min-w-[200px] bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-14 flex-1 min-w-[200px] bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-14 w-48 bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-14 w-32 bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-14 w-32 bg-blue-600 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error state (no routes)
  if (routes.length === 0 && error) {
    return (
      <div className={`bg-[#0a1628] rounded-2xl shadow-xl p-6 notranslate ${className}`} translate="no">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-gray-300 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalPassengers = adults + children;

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-xl border border-gray-200 overflow-visible notranslate ${className}`}
      translate="no"
    >
      <div className="p-4 md:p-6">
        {/* Trip Type Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setTripType('one-way');
                setTrips([trips[0]]); // Keep only first trip
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                tripType === 'one-way'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                tripType === 'one-way' ? 'border-white' : 'border-gray-400'
              }`}>
                {tripType === 'one-way' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              One way
            </button>
            <button
              type="button"
              onClick={() => setTripType('multi')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                tripType === 'multi'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                tripType === 'multi' ? 'border-white' : 'border-gray-400'
              }`}>
                {tripType === 'multi' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              Multi-city
              <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-bold">New</span>
            </button>
          </div>

          {/* Passengers selector - right side */}
          <div className="ml-auto relative">
            <button
              type="button"
              onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
            >
              <Users className="h-4 w-4" />
              {totalPassengers}
              <ChevronDown className="h-3 w-3" />
            </button>

            {showPassengerDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Adults</p>
                      <p className="text-xs text-gray-500">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-medium">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(12, adults + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Children</p>
                      <p className="text-xs text-gray-500">Age 0-12</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-medium">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(Math.min(12, children + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">Each passenger is allowed:</p>
                    <p className="text-xs text-gray-600">• One checked bag (29 x 21 x 11 inch)</p>
                    <p className="text-xs text-gray-600">• One carry-on bag (22 x 14 x 9 inch)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
            <button type="button" onClick={() => setError(null)}>
              <X className="h-4 w-4 text-red-500 hover:text-red-700" />
            </button>
          </div>
        )}

        {/* Trip rows */}
        <div className="space-y-3">
          {trips.map((trip, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                {/* Origin */}
                <div className="flex-1 min-w-[200px]">
                  <LocationAutocomplete
                    placeholder="Where from?"
                    value={trip.origin}
                    onChange={(val) => updateTrip(index, 'origin', val)}
                    routes={routes}
                    filterByDestination={trip.destination}
                    type="origin"
                  />
                </div>

                {/* Destination */}
                <div className="flex-1 min-w-[200px]">
                  <LocationAutocomplete
                    placeholder={trip.origin ? "Where to?" : "Select origin first"}
                    value={trip.destination}
                    onChange={(val) => updateTrip(index, 'destination', val)}
                    routes={routes}
                    filterByOrigin={trip.origin}
                    disabled={!trip.origin}
                    type="destination"
                  />
                </div>

                {/* Date & Time */}
                <div className="w-56">
                  <ModernDatePicker
                    value={trip.date}
                    onChange={(date) => updateTrip(index, 'date', date)}
                    enforceMinimumAdvance={true}
                    showTimePicker={true}
                    selectedTime={trip.pickupTime}
                    onTimeChange={(time) => updateTrip(index, 'pickupTime', time)}
                  />
                </div>

                {/* Remove button (only for multi with more than 1 trip) */}
                {tripType === 'multi' && trips.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrip(index)}
                    className="h-11 w-11 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add destination button (only for multi-city) - before search */}
        {tripType === 'multi' && (
          <button
            type="button"
            onClick={addTrip}
            className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add destination
          </button>
        )}

        {/* Search Button - Full width below trips */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {availabilityStatus === 'checking' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : availabilityStatus === 'approved' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Search className="h-5 w-5" />
          )}
          <span>Find a ride</span>
        </button>

        {/* Info Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>Max 12 per van with luggage</span>
          <span>•</span>
          <span>Custom routes available *</span>
          <span>•</span>
          <a href="https://wa.me/50685962438" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
            Last-minute? WhatsApp us
          </a>
        </div>
      </div>
    </form>
  );
}
