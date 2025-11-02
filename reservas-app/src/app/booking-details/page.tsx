// src/app/booking-details/page.tsx
// REDESIGNED VERSION - Modern UI in English with What's Included & Important Info

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Navigation,
  Loader2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plane,
  MessageSquare,
  Car,
  Wifi,
  Shield,
  User,
  DollarSign,
  BaggageClaim,
  Baby,
  Gift,
  Ban,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TripProgress } from '@/components/booking/TripProgress';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingHero from '@/components/booking/BookingHero';
import {
  validateBookingDetails,
  sanitizeInput,
  isAirport,
  calculateFees,
  calculateFinalPrice,
  type ValidationErrors,
} from '@/utils/bookingValidation';

/**
 * ==================== INTERFACES ====================
 */

interface Trip {
  id: string;
  booking_id: string;
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  price: number;
  distance: number | null;
  duration: string | null;
  pickup_address?: string | null;
  dropoff_address?: string | null;
  pickup_time?: string | null;
  flight_number?: string | null;
  airline?: string | null;
  arrival_time?: string | null;
  special_requests?: string | null;
  night_surcharge?: number | null;
  fees?: number | null;
  final_price?: number | null;
}

interface FormData {
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  flight_number: string;
  airline: string;
  arrival_time: string;
  special_requests: string;
}

/**
 * Calculate night surcharge (15% between 9 PM - 4 AM)
 */
function calculateNightSurcharge(pickupTime: string | null | undefined, basePrice: number): number {
  if (!pickupTime || !basePrice) return 0;

  const [hours] = pickupTime.split(':').map(Number);
  if (isNaN(hours) || hours < 0 || hours > 23) return 0;

  const isNightTime = hours >= 21 || hours < 4;
  return isNightTime ? basePrice * 0.15 : 0;
}

function isNightTime(pickupTime: string | null | undefined): boolean {
  if (!pickupTime) return false;
  const [hours] = pickupTime.split(':').map(Number);
  if (isNaN(hours)) return false;
  return hours >= 21 || hours < 4;
}

/**
 * ==================== SERVICE INFO COMPONENTS ====================
 */

function WhatsIncluded() {
  const inclusions = [
    { icon: Car, text: 'Spacious Van with Full A/C' },
    { icon: User, text: 'Personalized Meet & Greet at airport' },
    { icon: Shield, text: 'Door-to-Door Private Service' },
    { icon: Wifi, text: 'Free Onboard Wi-Fi & Bottled Water' },
    { icon: Users, text: 'Professional, Bilingual Driver' },
    { icon: DollarSign, text: 'All-Inclusive Rates, No Hidden Fees' },
  ];

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
      <CardHeader>
        <CardTitle className="text-cyan-700 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          What's Included?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {inclusions.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-4 w-4 text-cyan-600" />
              </div>
              <span className="text-sm text-gray-700">{item.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ImportantInformation() {
  const infoItems = [
    { icon: BaggageClaim, text: 'Max. 2 large bags per person.' },
    { icon: Gift, text: 'One complimentary 1-hour stop included.' },
    { icon: Baby, text: 'Baby car seats & boosters are included free of charge.' },
    { icon: Ban, text: 'No refund for cancellations within 48 hours of pickup.' },
    { icon: Clock, text: 'If refund applies, money back is guaranteed within 12 hours.', highlight: true },
  ];

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-700 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Important Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {infoItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.highlight ? 'bg-cyan-100' : 'bg-orange-100'
              }`}>
                <item.icon className={`h-4 w-4 ${item.highlight ? 'text-cyan-600' : 'text-orange-600'}`} />
              </div>
              <span className={`text-sm ${item.highlight ? 'text-cyan-700 font-medium' : 'text-gray-700'}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/**
 * ==================== PURA VIDA PROMISE COMPONENT ====================
 */

function PuraVidaPromise() {
  const promises = [
    {
      icon: CheckCircle,
      title: 'Instant Confirmation',
      description: 'Your booking is confirmed the moment you pay. Receive all your details by email instantly, with no waiting or uncertainty.',
      color: 'cyan',
    },
    {
      icon: MessageSquare,
      title: '24/7 Traveler Support',
      description: 'Plans change? Have a question? Our dedicated support team is available around the clock via WhatsApp or phone to assist you.',
      color: 'blue',
    },
    {
      icon: Shield,
      title: 'Worry-Free Travel',
      description: 'We monitor flights, guarantee punctuality, and handle all the logistics. Your only job is to relax and enjoy the journey ahead.',
      color: 'indigo',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Our Pura Vida Promise to You
        </h2>
        <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-12 rounded-full"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promises.map((promise, idx) => (
            <div key={idx} className="text-center">
              <div className={`mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-${promise.color}-400 to-${promise.color}-600 flex items-center justify-center shadow-lg`}>
                <promise.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {promise.title}
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}

function ModernTimePicker({ value, onChange, label, error }: TimePickerProps) {
  // Convert 24h format to 12h + AM/PM
  const convert24to12 = (time24: string) => {
    if (!time24) return { hour: '', minute: '', period: 'AM' };
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return { 
      hour: hour12.toString(), 
      minute: m.toString().padStart(2, '0'),
      period 
    };
  };

  // Convert 12h + AM/PM to 24h format
  const convert12to24 = (hour12: string, minute: string, period: string) => {
    let h = parseInt(hour12);
    if (isNaN(h)) return '';
    
    if (period === 'AM') {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h += 12;
    }
    
    return `${h.toString().padStart(2, '0')}:${minute}`;
  };

  const { hour, minute, period } = convert24to12(value);
  
  const hours12 = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = ['00', '15', '30', '45'];

  const handleChange = (newHour: string, newMinute: string, newPeriod: string) => {
    if (newHour && newMinute && newPeriod) {
      const time24 = convert12to24(newHour, newMinute, newPeriod);
      onChange(time24);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label} *</Label>
      <div className="grid grid-cols-[2fr_2fr_1.5fr] gap-2">
        {/* Hour */}
        <select
          value={hour}
          onChange={(e) => handleChange(e.target.value, minute || '00', period)}
          className={`w-full px-3 py-3 text-lg font-semibold bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Hour</option>
          {hours12.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        {/* Minute */}
        <select
          value={minute}
          onChange={(e) => handleChange(hour || '1', e.target.value, period)}
          className={`w-full px-3 py-3 text-lg font-semibold bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Min</option>
          {minutes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* AM/PM */}
        <select
          value={period}
          onChange={(e) => handleChange(hour || '1', minute || '00', e.target.value)}
          className={`w-full px-3 py-3 text-lg font-bold bg-gradient-to-r from-blue-50 to-indigo-50 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            error ? 'border-red-500' : 'border-blue-300'
          }`}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      
      {value && (
        <p className="text-sm text-gray-600 mt-1">
          Selected time: <span className="font-mono font-bold text-blue-600">
            {convert24to12(value).hour}:{convert24to12(value).minute} {convert24to12(value).period}
          </span>
        </p>
      )}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

/**
 * ==================== MAIN COMPONENT ====================
 */

function BookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    pickup_address: '',
    dropoff_address: '',
    pickup_time: '',
    flight_number: '',
    airline: '',
    arrival_time: '',
    special_requests: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const bookingId = searchParams.get('booking_id');
  const tripParam = searchParams.get('trip');
  const currentTrip = trips[currentTripIndex];
  const nightSurcharge = currentTrip ? calculateNightSurcharge(formData.pickup_time, currentTrip.price) : 0;
  const showNightAlert = isNightTime(formData.pickup_time);
  const showFlightFields = currentTrip && (isAirport(currentTrip.from_location) || isAirport(currentTrip.to_location));

  // Calculate grand total for ALL trips
  const grandTotal = trips.reduce((total, trip) => {
    const tripNightSurcharge = trip.pickup_time ? calculateNightSurcharge(trip.pickup_time, trip.price) : 0;
    const tripTotal = trip.price + tripNightSurcharge + calculateFees(trip.price + tripNightSurcharge);
    return total + tripTotal;
  }, 0);

  useEffect(() => {
    if (!bookingId) {
      console.error('❌ No booking_id in URL');
      router.push('/');
      return;
    }
    loadTrips();
    
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [bookingId, router]);

  useEffect(() => {
    if (tripParam) {
      const index = parseInt(tripParam);
      if (!isNaN(index) && index >= 0) {
        setCurrentTripIndex(index);
      }
    }
  }, [tripParam]);

  useEffect(() => {
    if (currentTrip) {
      setFormData({
        pickup_address: currentTrip.pickup_address || '',
        dropoff_address: currentTrip.dropoff_address || '',
        pickup_time: currentTrip.pickup_time || '',
        flight_number: currentTrip.flight_number || '',
        airline: currentTrip.airline || '',
        arrival_time: currentTrip.arrival_time || '',
        special_requests: currentTrip.special_requests || '',
      });
    }
  }, [currentTrip]);

  async function loadTrips() {
    try {
      setLoading(true);
      const supabase = createClient();

      console.log('🔄 Loading trips for booking_id:', bookingId);

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Supabase Error:', error);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        throw new Error('No trips found for this booking');
      }

      console.log('✅ Trips loaded:', data);
      setTrips(data);
    } catch (error) {
      console.error('💥 Error loading trips:', error);
      alert('Error loading booking data');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }

  function validateForm(): boolean {
    if (!currentTrip) return false;

    const validationErrors = validateBookingDetails({
      pickup_address: formData.pickup_address,
      dropoff_address: formData.dropoff_address,
      pickup_time: formData.pickup_time,
      flight_number: showFlightFields ? formData.flight_number : undefined,
      from_location: currentTrip.from_location,
      to_location: currentTrip.to_location,
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  async function handleSaveAndContinue() {
    if (!currentTrip || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const fees = calculateFees(currentTrip.price + nightSurcharge);
      const finalPrice = calculateFinalPrice(currentTrip.price, nightSurcharge);

      const updateData = {
        pickup_address: sanitizeInput(formData.pickup_address),
        dropoff_address: sanitizeInput(formData.dropoff_address),
        pickup_time: formData.pickup_time,
        flight_number: formData.flight_number || null,
        airline: formData.airline || null,
        arrival_time: formData.arrival_time || null,
        special_requests: sanitizeInput(formData.special_requests),
        night_surcharge: nightSurcharge,
        fees,
        final_price: finalPrice,
        updated_at: new Date().toISOString(),
      };

      console.log('💾 Saving trip:', currentTrip.id, updateData);

      const { error } = await supabase
        .from('trips')
        .update(updateData)
        .eq('id', currentTrip.id);

      if (error) {
        console.error('❌ Error saving:', error);
        throw new Error(error.message);
      }

      console.log('✅ Trip saved successfully');

      const nextIndex = currentTripIndex + 1;

      if (nextIndex < trips.length) {
        console.log('➡️ Navigating to next trip');
        router.push(`/booking-details?booking_id=${bookingId}&trip=${nextIndex}`);
      } else {
        console.log('🎉 All trips completed');
        setIsConfirmed(true);
        setTimeout(() => {
          router.push(`/payment?booking_id=${bookingId}`);
        }, 3000);
      }
    } catch (error) {
      console.error('💥 Error:', error);
      alert('Error saving details');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading booking data...</p>
          </div>
        </div>
      </>
    );
  }

  if (isConfirmed) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Details Completed!</CardTitle>
              <CardDescription>
                All trips have been configured successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                <p className="font-mono text-sm font-bold text-gray-900 break-all">
                  {bookingId}
                </p>
              </div>
              <p className="text-sm text-center text-gray-600">
                Redirecting to payment in 3 seconds...
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!currentTrip) {
    return (
      <>
        <BookingNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Trip information not found</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/')} className="w-full">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const totalPrice = currentTrip.price + nightSurcharge + calculateFees(currentTrip.price + nightSurcharge);

  return (
    <>
      <BookingNavbar />
      <BookingHero />
      
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <TripProgress 
            currentTrip={currentTripIndex} 
            totalTrips={trips.length}
            grandTotal={trips.length > 1 ? grandTotal : undefined}
            totalPassengers={trips.reduce((sum, t) => sum + t.adults + t.children, 0)}
          />

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Trip {currentTripIndex + 1} Details
            </h1>
            <p className="text-gray-600 mt-1">
              Complete the information for your transfer
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Origin</p>
                        <p className="font-semibold">{currentTrip.from_location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="font-semibold">{currentTrip.to_location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Calendar className="h-4 w-4" />
                        Date
                      </div>
                      <p className="font-semibold text-sm">
                        {new Date(currentTrip.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Users className="h-4 w-4" />
                        Passengers
                      </div>
                      <p className="font-semibold text-sm">
                        {currentTrip.adults} adults, {currentTrip.children} children
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Navigation className="h-4 w-4" />
                        Distance
                      </div>
                      <p className="font-semibold text-sm">
                        {currentTrip.distance ? `${currentTrip.distance} km` : 'N/A'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Clock className="h-4 w-4" />
                        Duration
                      </div>
                      <p className="font-semibold text-sm">
                        {currentTrip.duration || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">${currentTrip.price.toFixed(2)}</span>
                  </div>

                  {nightSurcharge > 0 && (
                    <div className="flex justify-between text-sm text-amber-600">
                      <span>Night Surcharge (15%):</span>
                      <span className="font-semibold">+${nightSurcharge.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fees (13%):</span>
                    <span className="font-semibold">
                      +${calculateFees(currentTrip.price + nightSurcharge).toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <WhatsIncluded />

              {/* Important Information */}
              <ImportantInformation />
            </div>

            {/* RIGHT COLUMN - FORM */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Details</CardTitle>
                  <CardDescription>
                    Provide the necessary information for your pickup and drop-off
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pickup Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Pickup Details
                    </h3>

                    <div>
                      <Label htmlFor="pickup_address">Pickup Address *</Label>
                      <Textarea
                        id="pickup_address"
                        value={formData.pickup_address}
                        onChange={(e) =>
                          setFormData({ ...formData, pickup_address: e.target.value })
                        }
                        placeholder={
                          currentTrip.from_location.includes('SJO') || currentTrip.from_location.includes('Juan Santamaría')
                            ? "Denny's, outside terminal, or another meeting point at SJO airport..."
                            : currentTrip.from_location.includes('LIR') || currentTrip.from_location.includes('Liberia')
                            ? "Starbucks, KFC, outside terminal, or another meeting point at LIR airport..."
                            : "Hotel name, Airbnb address, house address, or paste Google Maps link..."
                        }
                        rows={3}
                        className={errors.pickup_address ? 'border-red-500' : ''}
                      />
                      {errors.pickup_address && (
                        <p className="text-sm text-red-600 mt-1">{errors.pickup_address}</p>
                      )}
                    </div>

                    <ModernTimePicker
                      value={formData.pickup_time}
                      onChange={(value) => setFormData({ ...formData, pickup_time: value })}
                      label="Pickup Time"
                      error={errors.pickup_time}
                    />

                    {showNightAlert && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">
                            Night Surcharge
                          </p>
                          <p className="text-xs text-amber-700">
                            A 15% surcharge applies for pickups between 9 PM and 4 AM
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Airport Timing Alert */}
                    {currentTrip && isAirport(currentTrip.to_location) && formData.pickup_time && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-300 rounded-lg">
                        <Plane className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900">
                            Airport Departure Reminder
                          </p>
                          <p className="text-xs text-blue-700">
                            <strong>Important:</strong> This transfer takes approximately{' '}
                            <strong>{currentTrip.duration || '4-5 hours'}</strong>.{' '}
                            Please select your pickup time considering:
                          </p>
                          <ul className="text-xs text-blue-700 mt-2 ml-4 list-disc space-y-1">
                            <li>Transfer duration: {currentTrip.duration || '4-5 hours'}</li>
                            <li>Airport check-in time: <strong>3 hours before flight</strong></li>
                          </ul>
                          <p className="text-xs text-blue-700 mt-2">
                            Make sure your pickup time allows enough time for both the transfer and check-in.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dropoff Details */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-red-600" />
                      Drop-off Details
                    </h3>

                    <div>
                      <Label htmlFor="dropoff_address">Drop-off Address *</Label>
                      <Textarea
                        id="dropoff_address"
                        value={formData.dropoff_address}
                        onChange={(e) =>
                          setFormData({ ...formData, dropoff_address: e.target.value })
                        }
                        placeholder="Hotel name, Airbnb address, house address, or paste Google Maps link..."
                        rows={3}
                        className={errors.dropoff_address ? 'border-red-500' : ''}
                      />
                      {errors.dropoff_address && (
                        <p className="text-sm text-red-600 mt-1">{errors.dropoff_address}</p>
                      )}
                    </div>
                  </div>

                  {/* Flight Information */}
                  {showFlightFields && (
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Plane className="h-5 w-5 text-blue-600" />
                        Flight Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="airline">Airline</Label>
                          <Input
                            id="airline"
                            value={formData.airline}
                            onChange={(e) =>
                              setFormData({ ...formData, airline: e.target.value })
                            }
                            placeholder="e.g. Copa Airlines"
                          />
                        </div>

                        <div>
                          <Label htmlFor="flight_number">Flight Number</Label>
                          <Input
                            id="flight_number"
                            value={formData.flight_number}
                            onChange={(e) =>
                              setFormData({ ...formData, flight_number: e.target.value })
                            }
                            placeholder="e.g. CM 123"
                            className={errors.flight_number ? 'border-red-500' : ''}
                          />
                          {errors.flight_number && (
                            <p className="text-sm text-red-600 mt-1">{errors.flight_number}</p>
                          )}
                        </div>
                      </div>

                      <ModernTimePicker
                        value={formData.arrival_time}
                        onChange={(value) => setFormData({ ...formData, arrival_time: value })}
                        label={isAirport(currentTrip.to_location) ? "Flight Departure Time" : "Flight Arrival Time"}
                      />

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900">
                          {isAirport(currentTrip.to_location) ? (
                            <>
                              <strong>Don't worry!</strong> We'll get you to the airport on time for your flight. 
                              Who says Tico Time is late? Not when it's airport time! 😁
                            </>
                          ) : (
                            <>
                              <strong>Note:</strong> We monitor your flight to automatically adjust pickup in case of delays.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      Special Requests
                    </h3>

                    <div>
                      <Label htmlFor="special_requests">
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="special_requests"
                        value={formData.special_requests}
                        onChange={(e) =>
                          setFormData({ ...formData, special_requests: e.target.value })
                        }
                        placeholder="Extra luggage, baby seat, surfboard, etc."
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum 1000 characters
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1"
                    >
                      Back
                    </Button>

                    <Button
                      onClick={handleSaveAndContinue}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : currentTripIndex + 1 < trips.length ? (
                        <>
                          Save & Next
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Pura Vida Promise Section */}
      <PuraVidaPromise />
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
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        </>
      }
    >
      <BookingDetailsContent />
    </Suspense>
  );
}