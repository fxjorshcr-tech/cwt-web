"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Clock,
  CheckCircle2,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Tipos para los datos de la reserva
interface TripDetails {
  id: string;
  from: string;
  fromDisplay: string;
  to: string;
  toDisplay: string;
  date: Date;
  passengers: number;
  distance: string;
  duration: string;
  subtotal: number;
  fees: number;
  total: number;
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2); // Search -> Selection -> Review -> Confirmation
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [specialRequests, setSpecialRequests] = useState("");
  const [trips, setTrips] = useState<TripDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde sessionStorage al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTrips = sessionStorage.getItem('bookingTrips');
      if (savedTrips) {
        try {
          const parsedTrips = JSON.parse(savedTrips);
          // Convertir los datos del formulario a TripDetails
          const formattedTrips: TripDetails[] = parsedTrips.map((trip: any, index: number) => ({
            id: `trip-${index + 1}`,
            from: trip.from,
            fromDisplay: trip.fromDisplay || "Selected Location",
            to: trip.to,
            toDisplay: trip.toDisplay || "Selected Destination",
            date: new Date(trip.date),
            passengers: trip.passengers || 2,
            distance: "120 km", // TODO: Calcular desde Supabase
            duration: "4 h 30 min - 5 h", // TODO: Calcular desde Supabase
            subtotal: 180, // TODO: Obtener desde Supabase según la ruta
            fees: 23.40, // 13% de fees
            total: 203.40,
          }));
          setTrips(formattedTrips);
        } catch (error) {
          console.error('Error parsing trips:', error);
          router.push('/');
        }
      } else {
        // Si no hay datos, redirigir al home
        router.push('/');
      }
      setLoading(false);
    }
  }, [router]);

  if (loading || trips.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking...</p>
        </div>
      </div>
    );
  }

  const currentTrip = trips[selectedTripIndex];
  const completedTrips = 0; // Esto vendría de tu lógica de estado

  const steps = [
    { id: 1, name: "Search", status: "complete" },
    { id: 2, name: "Selection", status: "current" },
    { id: 3, name: "Review", status: "upcoming" },
    { id: 4, name: "Confirmation", status: "upcoming" },
  ];

  const whatsIncluded = [
    "Spacious Van with Full A/C",
    "Personalized Meet & Greet at airport",
    "Door-to-Door Private Service",
    "Free Onboard Wi-Fi & Bottled Water",
    "Professional, Bilingual Driver",
    "All-Inclusive Rates, No Hidden Fees",
  ];

  const importantInfo = [
    "Max. 2 large bags per person",
    "One complimentary 1-hour stop included",
    "Baby car seats & boosters included free of charge",
    "No refund for cancellations within 48 hours of pickup",
    "If refund applies, money back is guaranteed within 12 hours",
  ];

  const handleContinue = () => {
    // Validación
    if (!pickupLocation || !dropoffLocation || !pickupTime) {
      alert("Please fill in all required fields");
      return;
    }

    // Guardar los detalles del viaje actual
    const updatedTrips = [...trips];
    // Aquí guardarías los detalles adicionales (pickup location, time, etc.)
    
    // Si hay más viajes, ir al siguiente
    if (selectedTripIndex < trips.length - 1) {
      setSelectedTripIndex(selectedTripIndex + 1);
      // Reset form for next trip
      setPickupLocation("");
      setDropoffLocation("");
      setPickupTime("09:00");
      setSpecialRequests("");
    } else {
      // Si es el último viaje, ir a la página de revisión
      sessionStorage.setItem('bookingDetails', JSON.stringify(updatedTrips));
      router.push('/booking-review'); // Crea esta página después
    }
  };

  const handleBack = () => {
    if (selectedTripIndex > 0) {
      setSelectedTripIndex(selectedTripIndex - 1);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <div>
                <div className="font-bold text-xl leading-tight">Can't Wait Travel</div>
                <div className="text-xs tracking-wider uppercase text-gray-600">
                  costa rica
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition">
                Home
              </a>
              <a href="/transfers" className="text-gray-600 hover:text-gray-900 transition">
                Transfers
              </a>
              <a href="/about" className="text-gray-600 hover:text-gray-900 transition">
                About
              </a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900 transition">
                Contact
              </a>
              <Button>Book Now</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Private Transportation
          </h1>
          <p className="text-lg text-gray-300">Reliable, convenient & safe</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  {/* Circle */}
                  <div
                    className={cn(
                      "step-indicator",
                      step.status === "complete" && "step-completed",
                      step.status === "current" && "step-active",
                      step.status === "upcoming" && "step-inactive"
                    )}
                  >
                    {step.status === "complete" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {/* Label */}
                  <span
                    className={cn(
                      "font-medium",
                      step.status === "current" && "text-primary",
                      step.status === "complete" && "text-green-600",
                      step.status === "upcoming" && "text-gray-400"
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                {/* Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>

          {/* Progress Counter */}
          {trips.length > 1 && (
            <div className="mt-4 text-right">
              <span className="text-sm font-medium text-green-600">
                {completedTrips} of {trips.length} completed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              {/* Trip Tabs */}
              {trips.length > 1 && (
                <div className="flex gap-2 mb-6 border-b">
                  {trips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTripIndex(index)}
                      className={cn(
                        "px-4 py-2 font-medium border-b-2 transition-colors",
                        selectedTripIndex === index
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Trip {index + 1}
                    </button>
                  ))}
                </div>
              )}

              <h2 className="text-xl font-bold mb-6">
                Trip {selectedTripIndex + 1} Summary
              </h2>

              {/* Route */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">From</div>
                    <div className="font-semibold">{currentTrip.fromDisplay}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">To</div>
                    <div className="font-semibold">{currentTrip.toDisplay}</div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 pb-6 border-b">
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">Date</span>
                  <span className="ml-auto font-medium">
                    {format(currentTrip.date, "EEE, MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">Passengers</span>
                  <span className="ml-auto font-medium">
                    {currentTrip.passengers} {currentTrip.passengers === 1 ? "Adult" : "Adults"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Car className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">Distance</span>
                  <span className="ml-auto font-medium">{currentTrip.distance}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">Duration</span>
                  <span className="ml-auto font-medium">{currentTrip.duration}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-primary mb-3">Price Breakdown</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${currentTrip.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fees (13%)</span>
                  <span className="font-medium">${currentTrip.fees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>TOTAL</span>
                  <span className="text-primary">${currentTrip.total.toFixed(2)}</span>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-blue-900">What's Included:</h4>
                <ul className="space-y-2">
                  {whatsIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Important Information */}
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-amber-900">
                  Important Information:
                </h4>
                <ul className="space-y-2">
                  {importantInfo.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-700 flex-shrink-0">•</span>
                      <span className="text-amber-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Pickup & Dropoff Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-8">Complete Your Booking</h2>

              {/* Pickup Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Pickup Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pickup-location">
                      Pickup Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pickup-location"
                      placeholder="e.g., Hotel Name, Address"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please provide the exact address or hotel name
                    </p>
                  </div>
                </div>
              </div>

              {/* Drop-off Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Drop-off Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dropoff-location">
                      Drop-off Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dropoff-location"
                      placeholder="e.g., Hotel Name, Address"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please provide the exact address or hotel name
                    </p>
                  </div>
                </div>
              </div>

              {/* Pickup Time */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Pickup Time
                </h3>
                <div>
                  <Label htmlFor="pickup-time">
                    Pickup Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pickup-time"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-primary mt-2">
                    Selected: {pickupTime}
                  </p>
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Special Requests</h3>
                <Label htmlFor="special-requests">
                  Special Requests or Info (Optional)
                </Label>
                <textarea
                  id="special-requests"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
                  placeholder="Any special requirements or information we should know..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={handleBack}
                  type="button"
                >
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  size="lg" 
                  onClick={handleContinue}
                  type="button"
                >
                  {selectedTripIndex < trips.length - 1 
                    ? "Save & Next Trip" 
                    : "Continue to Review"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}