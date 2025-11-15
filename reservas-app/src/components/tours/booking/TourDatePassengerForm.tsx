// src/components/tours/booking/TourDatePassengerForm.tsx
import { Users, AlertCircle } from 'lucide-react';
import { ModernDatePicker } from '@/components/forms/ModernDatePicker';
import { PassengerSelector } from './PassengerSelector';

interface TourDatePassengerFormProps {
  selectedDate?: Date;
  adults: number;
  children: number;
  maxPassengers: number;
  minPassengers: number;
  minAge: number;
  showPassengerPicker: boolean;
  errors: Record<string, string>;
  isValidPassengerCount: boolean;
  onDateChange: (date: Date | null) => void;
  onAdultsChange: (increment: boolean) => void;
  onChildrenChange: (increment: boolean) => void;
  onTogglePassengerPicker: () => void;
  onClosePassengerPicker: () => void;
}

export function TourDatePassengerForm({
  selectedDate,
  adults,
  children,
  maxPassengers,
  minPassengers,
  minAge,
  showPassengerPicker,
  errors,
  isValidPassengerCount,
  onDateChange,
  onAdultsChange,
  onChildrenChange,
  onTogglePassengerPicker,
  onClosePassengerPicker,
}: TourDatePassengerFormProps) {
  const totalPassengers = adults + children;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Tour Date & Passengers</h2>
      </div>

      <div className="p-6 md:p-8 space-y-5">
        <div>
          <ModernDatePicker
            value={selectedDate || null}
            onChange={onDateChange}
            label="Travel Date"
            className={errors.date ? 'border-red-300 bg-red-50' : ''}
          />
          {errors.date && (
            <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
              <AlertCircle className="h-4 w-4" />
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passengers <span className="text-red-500">*</span>
          </label>

          <button
            type="button"
            onClick={onTogglePassengerPicker}
            className={`w-full h-14 px-4 text-left rounded-xl border-2 transition-all flex items-center justify-between ${
              errors.passengers
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <span className="text-base font-medium text-gray-900">
                  {adults} {adults === 1 ? 'Adult' : 'Adults'}
                  {children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                {totalPassengers} total
              </span>
            </div>
          </button>

          {showPassengerPicker && (
            <PassengerSelector
              adults={adults}
              children={children}
              maxPassengers={maxPassengers}
              minAge={minAge}
              onAdultsChange={onAdultsChange}
              onChildrenChange={onChildrenChange}
              onClose={onClosePassengerPicker}
            />
          )}

          <div
            className={`mt-3 p-3 rounded-lg ${
              isValidPassengerCount
                ? 'bg-green-50 border border-green-200'
                : 'bg-amber-50 border border-amber-200'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isValidPassengerCount ? 'text-green-700' : 'text-amber-700'
              }`}
            >
              {isValidPassengerCount ? (
                <>✓ Valid passenger count</>
              ) : (
                <>⚠ Tour requires {minPassengers}-{maxPassengers} passengers</>
              )}
            </p>
          </div>

          {errors.passengers && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.passengers}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
