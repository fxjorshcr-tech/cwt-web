// src/components/forms/QuickSearchForm.tsx
// Lightweight search form for Home/Transfers pages
// Single line on desktop, stacked on mobile
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, MapPin, Calendar, Users, ChevronDown, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { loadRoutesFromSupabase, type Route } from '@/utils/bookingFormHelpers';

interface QuickSearchFormProps {
  className?: string;
}

export function QuickSearchForm({ className = '' }: QuickSearchFormProps) {
  const router = useRouter();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(2);

  // Dropdown states
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);

  // Refs for click outside
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const passengersRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Load routes
  useEffect(() => {
    async function loadRoutes() {
      setIsLoadingRoutes(true);
      const supabase = createClient();
      const { routes: loadedRoutes, error: loadError } = await loadRoutesFromSupabase(supabase);

      if (loadError) {
        setError(loadError);
      } else if (loadedRoutes) {
        setRoutes(loadedRoutes);
      }
      setIsLoadingRoutes(false);
    }
    loadRoutes();
  }, []);

  // Get unique origins
  const origins = useMemo(() => {
    const originSet = new Set<string>();
    routes.forEach(r => originSet.add(r.origen));
    return Array.from(originSet).sort();
  }, [routes]);

  // Get destinations filtered by origin
  const destinations = useMemo(() => {
    if (!origin) return [];
    const destSet = new Set<string>();
    routes.filter(r => r.origen === origin).forEach(r => destSet.add(r.destino));
    return Array.from(destSet).sort();
  }, [routes, origin]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setOriginOpen(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(e.target as Node)) {
        setDestinationOpen(false);
      }
      if (passengersRef.current && !passengersRef.current.contains(e.target as Node)) {
        setPassengersOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset destination when origin changes
  useEffect(() => {
    if (origin && destination) {
      const validRoute = routes.find(r => r.origen === origin && r.destino === destination);
      if (!validRoute) {
        setDestination('');
      }
    }
  }, [origin, destination, routes]);

  // Get minimum date (today)
  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!origin || !destination || !date || passengers < 1) {
      setError('Please fill in all fields');
      return;
    }

    if (passengers > 12) {
      setError('For groups larger than 12, please contact us via WhatsApp');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Find the route
      const route = routes.find(r => r.origen === origin && r.destino === destination);
      if (!route) {
        setError('Route not available');
        setIsSubmitting(false);
        return;
      }

      // Generate booking ID
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Calculate price
      let price = route.precio1a6;
      if (passengers > 6 && passengers <= 9) price = route.precio7a9;
      if (passengers > 9 && passengers <= 12) price = route.precio10a12;

      // Create booking data
      const bookingData = {
        bookingId,
        trips: [{
          from_location: origin,
          to_location: destination,
          date,
          adults: passengers,
          children: 0,
          price,
          duration: route.duracion,
          routeId: route.id,
          calculatedPrice: price,
        }],
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));

      // Navigate to preview
      router.push(`/preview?booking_id=${bookingId}`);
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  if (isLoadingRoutes) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-6 ${className}`}>
        <div className="flex items-center justify-center gap-3 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600 text-sm">Loading routes...</span>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-xl overflow-visible ${className}`}
    >
      {error && (
        <div className="px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center justify-between">
            <span className="text-sm text-red-700">{error}</span>
            <button type="button" onClick={() => setError(null)}>
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 lg:p-5">
        {/* Desktop: Single row | Mobile: Stacked */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-2">

          {/* Origin Selector */}
          <div ref={originRef} className="flex-1 relative">
            <label className="block text-xs font-medium text-gray-600 mb-1.5 lg:hidden">
              From
            </label>
            <button
              type="button"
              onClick={() => {
                setOriginOpen(!originOpen);
                setDestinationOpen(false);
                setPassengersOpen(false);
              }}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
            >
              <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className={`flex-1 truncate text-sm ${origin ? 'text-gray-900' : 'text-gray-400'}`}>
                {origin || 'Pick-up location'}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${originOpen ? 'rotate-180' : ''}`} />
            </button>

            {originOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                {origins.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">No locations available</div>
                ) : (
                  <ul className="py-1">
                    {origins.map(loc => (
                      <li key={loc}>
                        <button
                          type="button"
                          onClick={() => {
                            setOrigin(loc);
                            setOriginOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 ${
                            origin === loc ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {loc}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Destination Selector */}
          <div ref={destinationRef} className="flex-1 relative">
            <label className="block text-xs font-medium text-gray-600 mb-1.5 lg:hidden">
              To
            </label>
            <button
              type="button"
              onClick={() => {
                if (origin) {
                  setDestinationOpen(!destinationOpen);
                  setOriginOpen(false);
                  setPassengersOpen(false);
                }
              }}
              disabled={!origin}
              className={`w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left ${
                origin ? 'hover:border-blue-400' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span className={`flex-1 truncate text-sm ${destination ? 'text-gray-900' : 'text-gray-400'}`}>
                {destination || (origin ? 'Drop-off location' : 'Select origin first')}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${destinationOpen ? 'rotate-180' : ''}`} />
            </button>

            {destinationOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                {destinations.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">No destinations for this origin</div>
                ) : (
                  <ul className="py-1">
                    {destinations.map(loc => (
                      <li key={loc}>
                        <button
                          type="button"
                          onClick={() => {
                            setDestination(loc);
                            setDestinationOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 ${
                            destination === loc ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {loc}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="flex-1 lg:max-w-[180px]">
            <label className="block text-xs font-medium text-gray-600 mb-1.5 lg:hidden">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 transition-all appearance-none"
              />
            </div>
          </div>

          {/* Passengers Selector */}
          <div ref={passengersRef} className="relative lg:w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1.5 lg:hidden">
              Passengers
            </label>
            <button
              type="button"
              onClick={() => {
                setPassengersOpen(!passengersOpen);
                setOriginOpen(false);
                setDestinationOpen(false);
              }}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
            >
              <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-900">{passengers}</span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${passengersOpen ? 'rotate-180' : ''}`} />
            </button>

            {passengersOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      className="h-10 w-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-medium transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold text-gray-900">{passengers}</span>
                    <button
                      type="button"
                      onClick={() => setPassengers(Math.min(12, passengers + 1))}
                      className="h-10 w-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">Max 12 passengers</p>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isSubmitting || !origin || !destination || !date}
            className="h-12 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 lg:w-auto w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="lg:hidden">Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
