// src/app/booking-details/page.tsx
// FIX: Removed trip_number column that doesn't exist in database

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
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TripProgress } from '@/components/booking/TripProgress';
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

// ✅ FIXED: Removed trip_number property that doesn't exist in the database
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
 * Calcular recargo nocturno inline (15% entre 9 PM - 4 AM)
 */
function calculateNightSurcharge(pickupTime: string | null | undefined, basePrice: number): number {
  if (!pickupTime || !basePrice) return 0;

  const [hours] = pickupTime.split(':').map(Number);
  if (isNaN(hours) || hours < 0 || hours > 23) return 0;

  // 21:00 (9 PM) hasta 03:59 (3:59 AM)
  const isNightTime = hours >= 21 || hours < 4;
  return isNightTime ? basePrice * 0.15 : 0;
}

/**
 * Verificar si es hora nocturna
 */
function isNightTime(pickupTime: string | null | undefined): boolean {
  if (!pickupTime) return false;
  const [hours] = pickupTime.split(':').map(Number);
  if (isNaN(hours)) return false;
  return hours >= 21 || hours < 4;
}

/**
 * ==================== COMPONENTE INTERNO ====================
 */

function BookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados principales
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Datos del formulario
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

  // Obtener parámetros de URL
  const bookingId = searchParams.get('booking_id');
  const tripParam = searchParams.get('trip');

  // Trip actual
  const currentTrip = trips[currentTripIndex];

  // Calcular recargo nocturno
  const nightSurcharge = currentTrip ? calculateNightSurcharge(formData.pickup_time, currentTrip.price) : 0;
  const showNightAlert = isNightTime(formData.pickup_time);

  // Detectar si es aeropuerto
  const showFlightFields =
    currentTrip &&
    (isAirport(currentTrip.from_location) || isAirport(currentTrip.to_location));

  /**
   * ==================== CARGAR TRIPS ====================
   */
  useEffect(() => {
    if (!bookingId) {
      console.error('❌ No hay booking_id en la URL');
      router.push('/');
      return;
    }

    loadTrips();
  }, [bookingId, router]);

  /**
   * ==================== ACTUALIZAR ÍNDICE DE TRIP ====================
   */
  useEffect(() => {
    if (tripParam) {
      const index = parseInt(tripParam);
      if (!isNaN(index) && index >= 0) {
        setCurrentTripIndex(index);
      }
    }
  }, [tripParam]);

  /**
   * ==================== PRE-LLENAR FORMULARIO ====================
   */
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

  /**
   * ==================== FUNCIÓN: CARGAR TRIPS ====================
   * ✅ FIXED: Order by created_at instead of non-existent trip_number
   */
  async function loadTrips() {
    try {
      setLoading(true);
      const supabase = createClient();

      console.log('🔄 Cargando trips para booking_id:', bookingId);

      // ✅ FIXED: Removed .order('trip_number') and using created_at instead
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error de Supabase:', error);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        throw new Error('No se encontraron viajes para esta reserva');
      }

      console.log('✅ Trips cargados:', data);
      setTrips(data);
    } catch (error) {
      console.error('💥 Error al cargar trips:', error);
      alert('Error al cargar los datos de la reserva');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }

  /**
   * ==================== FUNCIÓN: VALIDAR FORMULARIO ====================
   */
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

  /**
   * ==================== FUNCIÓN: GUARDAR Y CONTINUAR ====================
   */
  async function handleSaveAndContinue() {
    if (!currentTrip || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Calcular precios
      const fees = calculateFees(currentTrip.price + nightSurcharge);
      const finalPrice = calculateFinalPrice(currentTrip.price, nightSurcharge);

      // Preparar datos para actualizar
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

      console.log('💾 Guardando trip:', currentTrip.id, updateData);

      const { error } = await supabase
        .from('trips')
        .update(updateData)
        .eq('id', currentTrip.id);

      if (error) {
        console.error('❌ Error al guardar:', error);
        throw new Error(error.message);
      }

      console.log('✅ Trip guardado exitosamente');

      // Navegar al siguiente trip o a payment
      const nextIndex = currentTripIndex + 1;

      if (nextIndex < trips.length) {
        // Hay más trips
        console.log('➡️ Navegando al siguiente trip');
        router.push(`/booking-details?booking_id=${bookingId}&trip=${nextIndex}`);
      } else {
        // Último trip completado
        console.log('🎉 Todos los trips completados');
        setIsConfirmed(true);

        // Redirigir a payment después de 3 segundos
        setTimeout(() => {
          router.push(`/payment?booking_id=${bookingId}`);
        }, 3000);
      }
    } catch (error) {
      console.error('💥 Error:', error);
      alert('Error al guardar los detalles');
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * ==================== RENDER: LOADING ====================
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos de reserva...</p>
        </div>
      </div>
    );
  }

  /**
   * ==================== RENDER: CONFIRMACIÓN ====================
   */
  if (isConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Detalles Completados!</CardTitle>
            <CardDescription>
              Todos los viajes han sido configurados exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">ID de Reserva</p>
              <p className="font-mono text-sm font-bold text-gray-900 break-all">
                {bookingId}
              </p>
            </div>
            <p className="text-sm text-center text-gray-600">
              Redirigiendo a la página de pago en 3 segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * ==================== RENDER: SIN TRIPS ====================
   */
  if (!currentTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>No se encontró información del viaje</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = currentTrip.price + nightSurcharge + calculateFees(currentTrip.price + nightSurcharge);

  /**
   * ==================== RENDER: FORMULARIO PRINCIPAL ====================
   */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Botón Volver */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        {/* Indicador de Progreso */}
        <TripProgress currentTrip={currentTripIndex} totalTrips={trips.length} />

        {/* Título */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Detalles de tu Viaje {currentTripIndex + 1}
          </h1>
          <p className="text-gray-600 mt-1">
            Completa la información para tu traslado
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* COLUMNA IZQUIERDA: Resumen */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card: Información del Viaje */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen del Viaje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ruta */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Origen</p>
                      <p className="font-semibold">{currentTrip.from_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Destino</p>
                      <p className="font-semibold">{currentTrip.to_location}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Calendar className="h-4 w-4" />
                      Fecha
                    </div>
                    <p className="font-semibold text-sm">
                      {new Date(currentTrip.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Users className="h-4 w-4" />
                      Pasajeros
                    </div>
                    <p className="font-semibold text-sm">
                      {currentTrip.adults} adultos, {currentTrip.children} niños
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Navigation className="h-4 w-4" />
                      Distancia
                    </div>
                    <p className="font-semibold text-sm">
                      {currentTrip.distance ? `${currentTrip.distance} km` : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Clock className="h-4 w-4" />
                      Duración
                    </div>
                    <p className="font-semibold text-sm">
                      {currentTrip.duration || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card: Desglose de Precios */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Desglose de Precios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio Base:</span>
                  <span className="font-semibold">${currentTrip.price.toFixed(2)}</span>
                </div>

                {nightSurcharge > 0 && (
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>Recargo Nocturno (15%):</span>
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
          </div>

          {/* COLUMNA DERECHA: Formulario */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Traslado</CardTitle>
                <CardDescription>
                  Proporciona la información necesaria para tu recogida y entrega
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pickup Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Detalles de Recogida
                  </h3>

                  <div>
                    <Label htmlFor="pickup_address">Dirección de Recogida *</Label>
                    <Textarea
                      id="pickup_address"
                      value={formData.pickup_address}
                      onChange={(e) =>
                        setFormData({ ...formData, pickup_address: e.target.value })
                      }
                      placeholder="Dirección completa, incluyendo referencias"
                      rows={3}
                      className={errors.pickup_address ? 'border-red-500' : ''}
                    />
                    {errors.pickup_address && (
                      <p className="text-sm text-red-600 mt-1">{errors.pickup_address}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="pickup_time">Hora de Recogida *</Label>
                    <Input
                      id="pickup_time"
                      type="time"
                      value={formData.pickup_time}
                      onChange={(e) =>
                        setFormData({ ...formData, pickup_time: e.target.value })
                      }
                      className={errors.pickup_time ? 'border-red-500' : ''}
                    />
                    {errors.pickup_time && (
                      <p className="text-sm text-red-600 mt-1">{errors.pickup_time}</p>
                    )}
                    {showNightAlert && (
                      <div className="mt-2 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">
                            Recargo Nocturno
                          </p>
                          <p className="text-xs text-amber-700">
                            Se aplicará un recargo del 15% por recogida entre 9 PM y 4 AM
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dropoff Details */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    Detalles de Entrega
                  </h3>

                  <div>
                    <Label htmlFor="dropoff_address">Dirección de Entrega *</Label>
                    <Textarea
                      id="dropoff_address"
                      value={formData.dropoff_address}
                      onChange={(e) =>
                        setFormData({ ...formData, dropoff_address: e.target.value })
                      }
                      placeholder="Dirección completa, incluyendo referencias"
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
                      Información de Vuelo
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="airline">Aerolínea</Label>
                        <Input
                          id="airline"
                          value={formData.airline}
                          onChange={(e) =>
                            setFormData({ ...formData, airline: e.target.value })
                          }
                          placeholder="ej: Copa Airlines"
                        />
                      </div>

                      <div>
                        <Label htmlFor="flight_number">Número de Vuelo</Label>
                        <Input
                          id="flight_number"
                          value={formData.flight_number}
                          onChange={(e) =>
                            setFormData({ ...formData, flight_number: e.target.value })
                          }
                          placeholder="ej: CM 123"
                          className={errors.flight_number ? 'border-red-500' : ''}
                        />
                        {errors.flight_number && (
                          <p className="text-sm text-red-600 mt-1">{errors.flight_number}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="arrival_time">Hora de Llegada</Label>
                        <Input
                          id="arrival_time"
                          type="time"
                          value={formData.arrival_time}
                          onChange={(e) =>
                            setFormData({ ...formData, arrival_time: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-900">
                        <strong>Nota:</strong> Monitoreamos tu vuelo para ajustar el pickup
                        automáticamente en caso de retrasos.
                      </p>
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Solicitudes Especiales
                  </h3>

                  <div>
                    <Label htmlFor="special_requests">
                      Solicitudes Especiales (Opcional)
                    </Label>
                    <Textarea
                      id="special_requests"
                      value={formData.special_requests}
                      onChange={(e) =>
                        setFormData({ ...formData, special_requests: e.target.value })
                      }
                      placeholder="Equipaje extra, silla de bebé, tabla de surf, etc."
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Máximo 1000 caracteres
                    </p>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Volver
                  </Button>

                  <Button
                    onClick={handleSaveAndContinue}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : currentTripIndex + 1 < trips.length ? (
                      <>
                        Guardar y Siguiente
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Continuar a Pago
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
  );
}

/**
 * ==================== COMPONENTE PRINCIPAL (CON SUSPENSE) ====================
 */

export default function BookingDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      }
    >
      <BookingDetailsContent />
    </Suspense>
  );
}