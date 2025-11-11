// src/app/booking-details/page.tsx
// ✅ VERSIÓN RENOVADA - Mobile optimizado, progress arreglado, bottom bar mejorado
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Users, MapPin, Loader2, AlertCircle, Plane, DollarSign, Clock as ClockIcon } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import { TripProgress } from '@/components/booking/TripProgress';
import { TripAddOns } from '@/components/booking/TripAddOns';
import { TimePicker } from '@/components/home/TimePicker';

import { 
  validateBookingDetails,
  sanitizeInput,
  isAirport,
  ValidationErrors
} from '@/utils/bookingValidation';
import { formatDate } from '@/lib/formatters';
import { calculateNightSurcharge, PRICING_CONFIG } from '@/lib/pricing-config';

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

  // ============================================
  // STATE
  // ============================================

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

  // ✅ VALIDACIÓN TEMPRANA
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

  // ============================================
  // LOAD TRIPS
  // ============================================

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

        if (!data || data.length === 0) {
          throw new Error('No trips found for this booking');
        }

        setTrips(data as any);

        // ✅ Cargar trips completados desde DB
        const completed = data
          .map((trip, idx) => trip.pickup_time && trip.pickup_address && trip.dropoff_address ? idx : null)
          .filter((idx): idx is number => idx !== null);
        setCompletedTrips(completed);

        // Cargar el primer trip
        if (data[0]) {
          const trip = data[0];
          
          const initialAges = trip.children_ages && trip.children_ages.length > 0
            ? trip.children_ages
            : Array(trip.children).fill(null);

          setFormData({
            pickup_address: trip.pickup_address || '',
            dropoff_address: trip.dropoff_address || '',
            pickup_time: trip.pickup_time || '',
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

  // ============================================
  // UPDATE FORM WHEN TRIP CHANGES
  // ============================================

  useEffect(() => {
    if (currentTrip) {
      const initialAges = currentTrip.children_ages && currentTrip.children_ages.length > 0
        ? currentTrip.children_ages
        : Array(currentTrip.children).fill(null);

      // ✅ FIX: Convertir pickup_time de "HH:mm:ss" a "HH:mm" si es necesario
      let pickupTime = currentTrip.pickup_time || '';
      if (pickupTime && pickupTime.includes(':')) {
        const parts = pickupTime.split(':');
        if (parts.length === 3) {
          // Si tiene formato HH:mm:ss, convertir a HH:mm
          pickupTime = `${parts[0]}:${parts[1]}`;
        }
      }

      setFormData({
        pickup_address: currentTrip.pickup_address || '',
        dropoff_address: currentTrip.dropoff_address || '',
        pickup_time: pickupTime,
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

  // ============================================
  // CALCULATE PRICES
  // ============================================

  const basePrice = currentTrip?.price || 0;
  const nightSurcharge = calculateNightSurcharge(formData.pickup_time, basePrice);
  
  const addOnsPrice = selectedAddOns.reduce((total, addonId) => {
    const prices: Record<string, number> = {
      tico_time: PRICING_CONFIG.ADD_ONS.TICO_TIME,
      flex_time: PRICING_CONFIG.ADD_ONS.FLEX_TIME,
    };
    return total + (prices[addonId] || 0);
  }, 0);

  const subtotal = basePrice + nightSurcharge + addOnsPrice;
  const fees = subtotal * PRICING_CONFIG.FEES_PERCENTAGE;
  const finalPrice = subtotal + fees;

  // ============================================
  // VALIDATION
  // ============================================

  const validateForm = (): boolean => {
    if (!currentTrip) return false;

    const validationErrors = validateBookingDetails({
      pickup_address: formData.pickup_address,
      dropoff_address: formData.dropoff_address,
      pickup_time: formData.pickup_time,
      flight_number: formData.flight_number,
      from_location: currentTrip.from_location,
      to_location: currentTrip.to_location,
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // ============================================
  // HANDLERS
  // ============================================

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
        night_surcharge: nightSurcharge,
        final_price: finalPrice,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('trips')
        .update(updateData)
        .eq('id', currentTrip!.id);

      if (error) throw error;

      // ✅ Marcar trip como completado
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

  const handleBack = () => {
    if (currentTripIndex > 0) {
      setCurrentTripIndex(currentTripIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================

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
            <p className="text-sm md:text-lg drop-shadow-md">
              Just a few more details for your trip
            </p>
          </div>
        </div>
      </section>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <BookingStepper currentStep={1} />
        </div>
      </div>

      {/* ✅ Progress Indicator - CON COMPLETED TRIPS */}
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
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-32 md:pb-28 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          
          <div className="space-y-4 md:space-y-6">
            
            {/* Trip Summary Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Trip {currentTripIndex + 1} of {trips.length}
                </CardTitle>
                <CardDescription className="text-sm">
                  {currentTrip.from_location} → {currentTrip.to_location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-semibold text-sm md:text-base">{formatDate(currentTrip.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Users className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Passengers</p>
                      <p className="font-semibold text-sm md:text-base">
                        {currentTrip.adults} Adult{currentTrip.adults !== 1 ? 's' : ''}
                        {currentTrip.children > 0 && `, ${currentTrip.children} Child${currentTrip.children !== 1 ? 'ren' : ''}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pickup Details */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base md:text-lg">Pickup Details</CardTitle>
                <CardDescription className="text-xs md:text-sm">Where and when should we pick you up?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div>
                  <Label htmlFor="pickup_address" className="text-sm">
                    Pickup Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pickup_address"
                    placeholder="Enter full pickup address"
                    value={formData.pickup_address}
                    onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                    className={`min-h-[44px] md:min-h-[48px] ${errors.pickup_address ? 'border-red-500' : ''}`}
                  />
                  {errors.pickup_address && (
                    <p className="text-xs text-red-600 mt-1">{errors.pickup_address}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pickup_time" className="text-sm">
                    Pickup Time <span className="text-red-500">*</span>
                  </Label>
                  <TimePicker
                    value={formData.pickup_time}
                    onChange={(time) => setFormData({ ...formData, pickup_time: time })}
                  />
                  {errors.pickup_time && (
                    <p className="text-xs text-red-600 mt-1">{errors.pickup_time}</p>
                  )}
                  
                  {nightSurcharge > 0 && (
                    <div className="flex items-start gap-2 mt-2 p-2 md:p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm">
                        <p className="font-semibold text-amber-900">Night Surcharge Applied</p>
                        <p className="text-amber-700">
                          Pickups 9 PM - 4 AM: +${nightSurcharge.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Flight Information */}
            {showFlightFields && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Plane className="h-5 w-5 text-blue-600" />
                    Flight Information
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Optional but helps us track your arrival</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div>
                    <Label htmlFor="airline" className="text-sm">Airline</Label>
                    <Input
                      id="airline"
                      placeholder="e.g., United Airlines"
                      value={formData.airline}
                      onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                      className="min-h-[44px] md:min-h-[48px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flight_number" className="text-sm">Flight Number</Label>
                    <Input
                      id="flight_number"
                      placeholder="e.g., UA 1234"
                      value={formData.flight_number}
                      onChange={(e) => setFormData({ ...formData, flight_number: e.target.value })}
                      className={`min-h-[44px] md:min-h-[48px] ${errors.flight_number ? 'border-red-500' : ''}`}
                    />
                    {errors.flight_number && (
                      <p className="text-xs text-red-600 mt-1">{errors.flight_number}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Drop-off Details */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base md:text-lg">Drop-off Details</CardTitle>
                <CardDescription className="text-xs md:text-sm">Where should we drop you off?</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="dropoff_address" className="text-sm">
                    Drop-off Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dropoff_address"
                    placeholder="Enter full drop-off address"
                    value={formData.dropoff_address}
                    onChange={(e) => setFormData({ ...formData, dropoff_address: e.target.value })}
                    className={`min-h-[44px] md:min-h-[48px] ${errors.dropoff_address ? 'border-red-500' : ''}`}
                  />
                  {errors.dropoff_address && (
                    <p className="text-xs text-red-600 mt-1">{errors.dropoff_address}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Children Ages */}
            {currentTrip.children > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base md:text-lg">Children's Ages</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Age of each child (0-12 years)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.from({ length: currentTrip.children }, (_, idx) => (
                      <div key={idx}>
                        <Label htmlFor={`child_age_${idx}`} className="text-sm">Child {idx + 1}</Label>
                        <select
                          id={`child_age_${idx}`}
                          value={formData.children_ages[idx] ?? ''}
                          onChange={(e) => {
                            const newAges = [...formData.children_ages];
                            newAges[idx] = e.target.value ? parseInt(e.target.value) : null;
                            setFormData({ ...formData, children_ages: newAges });
                          }}
                          className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm"
                        >
                          <option value="">Select</option>
                          {Array.from({ length: 13 }, (_, i) => i).map((age) => (
                            <option key={age} value={age}>{age} yr{age !== 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add-ons */}
            <TripAddOns
              selectedAddOns={selectedAddOns}
              onAddOnsChange={setSelectedAddOns}
            />

            {/* Special Requests */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base md:text-lg">Special Requests</CardTitle>
                <CardDescription className="text-xs md:text-sm">Any special needs? (Optional)</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="e.g., Need child car seat, extra luggage..."
                  value={formData.special_requests}
                  onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </CardContent>
            </Card>
          </div>

        </div>
        
        {/* ✅ FIXED BOTTOM BAR - Siempre visible abajo */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-blue-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
              
              {/* Mobile: Vertical layout */}
              <div className="block md:hidden space-y-3">
                {/* Price breakdown */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Trip {currentTripIndex + 1}/{trips.length}</span>
                    <span className="font-semibold text-gray-900">Base: ${basePrice}</span>
                  </div>
                  {nightSurcharge > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-700">Night Surcharge</span>
                      <span className="text-amber-700 font-semibold">+${nightSurcharge}</span>
                    </div>
                  )}
                  {addOnsPrice > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Add-ons</span>
                      <span className="text-green-700 font-semibold">+${addOnsPrice}</span>
                    </div>
                  )}
                  <div className="pt-1.5 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 min-h-[48px] text-sm"
                    disabled={saving}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={saving}
                    className="flex-[2] min-h-[48px] bg-blue-600 hover:bg-blue-700 text-sm font-bold"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {currentTripIndex < trips.length - 1 ? 'Next Trip' : 'Summary'}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Desktop: Horizontal layout */}
              <div className="hidden md:flex items-center justify-between gap-6">
                {/* Left - Price Info */}
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Trip {currentTripIndex + 1} of {trips.length}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">${finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Breakdown */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 border-l border-gray-300 pl-6">
                    <div>
                      <span className="text-gray-500">Base: </span>
                      <span className="font-semibold">${basePrice}</span>
                    </div>
                    {nightSurcharge > 0 && (
                      <div>
                        <span className="text-amber-600">Night: </span>
                        <span className="font-semibold text-amber-600">+${nightSurcharge}</span>
                      </div>
                    )}
                    {addOnsPrice > 0 && (
                      <div>
                        <span className="text-green-600">Add-ons: </span>
                        <span className="font-semibold text-green-600">+${addOnsPrice}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right - Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="min-h-[50px] px-6"
                    disabled={saving}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={saving}
                    className="min-h-[50px] px-8 bg-blue-600 hover:bg-blue-700 font-bold"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {currentTripIndex < trips.length - 1 ? 'Save & Next Trip' : 'Continue to Summary'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

      </div>
    </>
  );
}

// ============================================
// SUSPENSE WRAPPER
// ============================================

export default function BookingDetailsPage() {
  return (
    <Suspense fallback={
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    }>
      <BookingDetailsContent />
    </Suspense>
  );
}