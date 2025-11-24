// src/components/tours/booking/PickupLocationForm.tsx
import { MapPin, AlertCircle } from 'lucide-react';

interface PickupLocationFormProps {
  hotel: string;
  specialRequests: string;
  pickupTime: string;
  errors: Record<string, string>;
  onHotelChange: (value: string) => void;
  onSpecialRequestsChange: (value: string) => void;
}

export function PickupLocationForm({
  hotel,
  specialRequests,
  pickupTime,
  errors,
  onHotelChange,
  onSpecialRequestsChange,
}: PickupLocationFormProps) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-600" />
        Pickup Location
      </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="hotel" className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Name or Address <span className="text-red-500">*</span>
          </label>
          <input
            id="hotel"
            type="text"
            placeholder="Enter your hotel name or full address in La Fortuna"
            value={hotel}
            onChange={(e) => onHotelChange(e.target.value)}
            className={`w-full h-14 px-4 text-base rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.hotel ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {errors.hotel && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.hotel}
            </p>
          )}
          {/* Pickup Time Badge - Pequeño y elegante */}
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
            <MapPin className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-sm text-gray-700">
              Pickup: <span className="font-semibold text-blue-600">{pickupTime}</span>
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            placeholder="Any dietary restrictions, accessibility needs, or special requests..."
            value={specialRequests}
            onChange={(e) => onSpecialRequestsChange(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 text-base rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
