// src/components/tours/booking/PassengerSelector.tsx
import { Plus, Minus, AlertCircle } from 'lucide-react';

interface PassengerSelectorProps {
  adults: number;
  children: number;
  maxPassengers: number;
  minAge: number;
  onAdultsChange: (increment: boolean) => void;
  onChildrenChange: (increment: boolean) => void;
  onClose: () => void;
}

export function PassengerSelector({
  adults,
  children,
  maxPassengers,
  minAge,
  onAdultsChange,
  onChildrenChange,
  onClose,
}: PassengerSelectorProps) {
  const totalPassengers = adults + children;

  return (
    <div className="mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-200 p-5">
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-200">
        <div>
          <p className="font-semibold text-gray-900">Adults</p>
          <p className="text-sm text-gray-500">Age 13+</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onAdultsChange(false)}
            disabled={adults <= 1}
            className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
          >
            <Minus className="h-5 w-5 text-gray-600" />
          </button>

          <span className="w-8 text-center font-bold text-xl text-gray-900">{adults}</span>

          <button
            type="button"
            onClick={() => onAdultsChange(true)}
            disabled={totalPassengers >= maxPassengers}
            className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">Children</p>
          <p className="text-sm text-gray-500">Age {minAge}-12</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onChildrenChange(false)}
            disabled={children <= 0}
            className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
          >
            <Minus className="h-5 w-5 text-gray-600" />
          </button>

          <span className="w-8 text-center font-bold text-xl text-gray-900">{children}</span>

          <button
            type="button"
            onClick={() => onChildrenChange(true)}
            disabled={totalPassengers >= maxPassengers}
            className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {totalPassengers >= maxPassengers && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-amber-600 text-center flex items-center justify-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Maximum {maxPassengers} passengers per trip
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onClose}
        className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Done
      </button>
    </div>
  );
}
