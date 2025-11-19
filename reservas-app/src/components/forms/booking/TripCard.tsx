// src/components/forms/booking/TripCard.tsx
import { X, ChevronDown } from 'lucide-react';
import { LocationAutocomplete } from '../LocationAutocomplete';
import { ModernDatePicker } from '../ModernDatePicker';
import { PassengerSelector } from '../PassengerSelector';
import { TripRouteInfo } from './TripRouteInfo';
import { formatDateToString, parseDateFromString } from '@/utils/timeHelpers';

interface Route {
  id: number;
  origen: string;
  destino: string;
  alias: string | null;
  precio1a6: number;
  precio7a9: number;
  precio10a12: number;
  precio13a18: number;
  kilometros: number;
  duracion: string;
}

interface TripData {
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  calculatedPrice: number;
  selectedRoute: Route | null;
}

interface TripCardProps {
  trip: TripData;
  index: number;
  totalTrips: number;
  routes: Route[];
  disabled: boolean;
  showRemove: boolean;
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
}

export function TripCard({
  trip,
  index,
  totalTrips,
  routes,
  disabled,
  showRemove,
  onUpdate,
  onRemove,
}: TripCardProps) {
  return (
    <div className="space-y-3">
      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        {index === 0 && totalTrips === 1 ? (
          <div className="mb-4">
            <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 px-5 py-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 text-center">
                Start Your Journey
              </h3>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Trip {index + 1}</h3>
                <p className="text-xs text-gray-500">
                  {trip.selectedRoute ? 'Route selected' : 'Configure your trip'}
                </p>
              </div>
            </div>
            {showRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="h-9 w-9 rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          <LocationAutocomplete
            label="Pick-up Location"
            placeholder="Where are you traveling from?"
            value={trip.from_location}
            onChange={(value) => onUpdate('from_location', value)}
            routes={routes}
            filterByDestination={trip.to_location}
            disabled={disabled}
            type="origin"
          />

          <LocationAutocomplete
            label="Drop-off Location"
            placeholder={!trip.from_location ? 'Select origin first' : 'Where are you going?'}
            value={trip.to_location}
            onChange={(value) => onUpdate('to_location', value)}
            routes={routes}
            filterByOrigin={trip.from_location}
            disabled={!trip.from_location || disabled}
            type="destination"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <ModernDatePicker
            value={trip.date ? parseDateFromString(trip.date) : null}
            onChange={(date) => onUpdate('date', formatDateToString(date))}
            label="Travel Date"
          />

          <PassengerSelector
            adults={trip.adults}
            children={trip.children}
            onPassengersChange={(adults, children) => {
              onUpdate('adults', adults);
              onUpdate('children', children);
            }}
            label="Passengers"
          />
        </div>

        {trip.selectedRoute && (
          <TripRouteInfo route={trip.selectedRoute} price={trip.calculatedPrice} />
        )}
      </div>

      {index < totalTrips - 1 && (
        <div className="flex justify-center py-2">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      )}
    </div>
  );
}