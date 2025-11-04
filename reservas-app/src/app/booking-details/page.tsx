// src/app/booking-details/page.tsx
// FINAL VERSION: Restructured columns + Price at bottom after add-ons

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
import { TripAddOns, calculateAddOnsPrice } from '@/components/booking/TripAddOns';
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingStepper from '@/components/booking/BookingStepper';
import {
  validateBookingDetails,
  sanitizeInput,
  isAirport,
  calculateFees,
  calculateFinalPrice,
  type ValidationErrors,
} from '@/utils/bookingValidation';

interface Trip {
  id: string;
  booking_id: string;
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  children_ages?: number[] | null;
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
  add_ons?: string[] | null;
  add_ons_price?: number | null;
}

interface FormData {
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  flight_number: string;
  airline: string;
  arrival_time: string;
  special_requests: string;
  add_ons: string[];
  children_ages: number[];
}

function calculateNightSurcharge(pickupTime: string | null | undefined): number {
  if (!pickupTime) return 0;
  const [hours] = pickupTime.split(':').map(Number);
  if (isNaN(hours) || hours < 0 || hours > 23) return 0;
  const isNightTime = hours >= 21 || hours < 4;
  return isNightTime ? 50 : 0;
}

function isNightTime(pickupTime: string | null | undefined): boolean {
  if (!pickupTime) return false;
  const [hours] = pickupTime.split(':').map(Number);
  if (isNaN(hours)) return false;
  return hours >= 21 || hours < 4;
}

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

function WhyBookWithUs() {
  const reasons = [
    {
      icon: CheckCircle,
      title: 'Instant Confirmation',
      description: 'Booking confirmed instantly upon payment.',
    },
    {
      icon: MessageSquare,
      title: '24/7 Support',
      description: 'Always available via WhatsApp or phone.',
    },
    {
      icon: Shield,
      title: 'Worry-Free',
      description: 'We monitor flights and handle logistics.',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Why Book With Us?</h3>
      <div className="grid grid-cols-1 gap-4">
        {reasons.map((reason, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <reason.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{reason.title}</h4>
                <p className="text-sm text-gray-600">{reason.description}</p>
              </div>
            </div>
          </div>
        ))}
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
    add_ons: [],
    children_ages: [],
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const bookingId = searchParams.get('booking_id');
  const tripParam = searchParams.get('trip');
  const currentTrip = trips[currentTripIndex];
  
  const nightSurcharge = formData.pickup_time ? calculateNightSurcharge(formData.pickup_time) : 0;
  const addOnsPrice = calculateAddOnsPrice(formData.add_ons);
  const showNightAlert = isNightTime(formData.pickup_time);
  const showFlightFields = currentTrip && (isAirport(currentTrip.from_location) || isAirport(currentTrip.to_location));

  useEffect(() => {
    if (!bookingId) {
      console.error('❌ No booking_id in URL');
      router.push('/');
      return;
    }
    loadTrips();
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
      const initialAges = currentTrip.children_ages && currentTrip.children_ages.length > 0
        ? currentTrip.children_ages
        : Array(currentTrip.children).fill(0);
      
      setFormData({
        pickup_address: currentTrip.pickup_address || '',
        dropoff_address: currentTrip.dropoff_address || '',
        pickup_time: currentTrip.pickup_time || '',
        flight_number: currentTrip.flight_number || '',
        airline: currentTrip.airline || '',
        arrival_time: currentTrip.arrival_time || '',
        special_requests: currentTrip.special_requests || '',
        add_ons: currentTrip.add_ons || [],
        children_ages: initialAges,
      });
    }
  }, [currentTrip]);

  async function loadTrips() {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error('No trips found for this booking');

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
    
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return false;
    }
    return true;
  }

  async function handleSaveAndContinue() {
    if (!currentTrip || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const fees = calculateFees(currentTrip.price + nightSurcharge + addOnsPrice);
      const finalPrice = currentTrip.price + nightSurcharge + addOnsPrice + fees;

      const updateData = {
        pickup_address: sanitizeInput(formData.pickup_address),
        dropoff_address: sanitizeInput(formData.dropoff_address),
        pickup_time: formData.pickup_time,
        flight_number: formData.flight_number || null,
        airline: formData.airline || null,
        arrival_time: formData.arrival_time || null,
        special_requests: sanitizeInput(formData.special_requests),
        night_surcharge: nightSurcharge,
        add_ons: formData.add_ons,
        add_ons_price: addOnsPrice,
        children_ages: formData.children_ages,
        fees,
        final_price: finalPrice,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('trips')
        .update(updateData)
        .eq('id', currentTrip.id);

      if (error) throw new Error(error.message);

      const nextIndex = currentTripIndex + 1;

      if (nextIndex < trips.length) {
        router.push(`/booking-details?booking_id=${bookingId}&trip=${nextIndex}`);
      } else {
        router.push(`/summary?booking_id=${bookingId}`);
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
                Redirecting to summary...
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

  const totalPrice = currentTrip.price + nightSurcharge + addOnsPrice + calculateFees(currentTrip.price + nightSurcharge + addOnsPrice);

  return (
    <>
      <BookingNavbar />
      
      {/* Hero Section */}
      <div className="relative h-80 w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
            alt="Costa Rica Beach"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 65%' }}
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
              Trusted Costa Rica Drivers for Your Peace of Mind
            </h1>
          </div>
        </div>
      </div>
      
      <BookingStepper currentStep={1} />
      
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
            {/* LEFT COLUMN - RESTRUCTURED */}
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

              {/* What's Included - Desktop */}
              <div className="hidden lg:block">
                <WhatsIncluded />
              </div>

              {/* Important Information - Desktop */}
              <div className="hidden lg:block">
                <ImportantInformation />
              </div>

              {/* Why Book With Us - Desktop */}
              <div className="hidden lg:block">
                <WhyBookWithUs />
              </div>
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
                            Night Surcharge Applied
                          </p>
                          <p className="text-xs text-amber-700">
                            A fixed $50 surcharge applies for pickups between 9 PM and 4 AM
                          </p>
                        </div>
                      </div>
                    )}

                    {currentTrip && isAirport(currentTrip.to_location) && formData.pickup_time && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-300 rounded-lg">
                        <Plane className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900">
                            Airport Departure Reminder
                          </p>
                          <p className="text-xs text-blue-700">
                            This transfer takes approximately {currentTrip.duration || '4-5 hours'}. 
                            Allow 3 hours for airport check-in.
                          </p>
                        </div>
                      </div>
                    )}

                    {currentTrip && currentTrip.children > 0 && (
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Children Ages *</Label>
                        <p className="text-sm text-gray-600">
                          Please provide the age of each child for proper car seat arrangements
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Array.from({ length: currentTrip.children }).map((_, idx) => (
                            <div key={idx}>
                              <Label htmlFor={`child_age_${idx}`} className="text-sm">
                                Child {idx + 1}
                              </Label>
                              <select
                                id={`child_age_${idx}`}
                                value={formData.children_ages[idx] || 0}
                                onChange={(e) => {
                                  const newAges = [...formData.children_ages];
                                  newAges[idx] = parseInt(e.target.value);
                                  setFormData({ ...formData, children_ages: newAges });
                                }}
                                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              >
                                <option value="0">Select age</option>
                                {Array.from({ length: 13 }, (_, i) => i).map((age) => (
                                  <option key={age} value={age}>
                                    {age} {age === 1 ? 'year' : 'years'}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <Baby className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-green-900">
                              Free Car Seats & Boosters Included
                            </p>
                            <p className="text-xs text-green-700">
                              We provide appropriate car seats and safety equipment at no extra charge.
                            </p>
                          </div>
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
                    </div>
                  )}

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
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    <TripAddOns
                      selectedAddOns={formData.add_ons}
                      onAddOnsChange={(addOns) => setFormData({ ...formData, add_ons: addOns })}
                    />
                  </div>

                  {/* PRICE BREAKDOWN - MOVED HERE AFTER ADD-ONS */}
                  <div className="pt-6 border-t">
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
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
                            <span>Night Surcharge ($50 fixed):</span>
                            <span className="font-semibold">+${nightSurcharge.toFixed(2)}</span>
                          </div>
                        )}

                        {addOnsPrice > 0 && (
                          <div className="flex justify-between text-sm text-blue-600">
                            <span>Add-ons:</span>
                            <span className="font-semibold">+${addOnsPrice.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Fees (13%):</span>
                          <span className="font-semibold">
                            +${calculateFees(currentTrip.price + nightSurcharge + addOnsPrice).toFixed(2)}
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
                  </div>

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
                          Continue to Summary
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile - What's Included, Important Info, Why Book */}
              <div className="lg:hidden space-y-6 mt-6">
                <WhatsIncluded />
                <ImportantInformation />
                <WhyBookWithUs />
              </div>
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