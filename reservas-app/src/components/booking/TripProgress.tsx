// src/components/booking/TripProgress.tsx
// English version with Grand Total

'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripProgressProps {
  currentTrip: number;
  totalTrips: number;
  completedTrips?: number[];
  grandTotal?: number;
  totalPassengers?: number;
}

export const TripProgress: React.FC<TripProgressProps> = ({
  currentTrip,
  totalTrips,
  completedTrips = [],
  grandTotal,
  totalPassengers,
}) => {
  if (totalTrips <= 1) return null;

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            Completing trip {currentTrip + 1} of {totalTrips}
          </p>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            {completedTrips.length}/{totalTrips} completed
          </span>
        </div>
        
        {/* Grand Total - Compact */}
        {grandTotal && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-200">
            <div className="text-right">
              <p className="text-xs text-gray-600 font-medium">Total Booking</p>
              <p className="text-sm text-gray-500">
                {totalTrips} transfers • {totalPassengers} pax
              </p>
            </div>
            <div className="text-right border-l border-blue-300 pl-3">
              <p className="text-2xl font-bold text-blue-600">
                ${grandTotal.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        {Array.from({ length: totalTrips }).map((_, idx) => {
          const isCompleted = completedTrips.includes(idx);
          const isCurrent = idx === currentTrip;
          const isPending = idx > currentTrip;

          return (
            <div
              key={idx}
              className={cn(
                'flex-1 h-2 rounded-full relative transition-all duration-300',
                isCompleted && 'bg-green-500',
                isCurrent && 'bg-blue-500',
                isPending && 'bg-gray-200'
              )}
            >
              {isCompleted && (
                <CheckCircle
                  className="absolute -top-3 -right-1 text-green-500"
                  size={18}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        {Array.from({ length: totalTrips }).map((_, idx) => {
          const isCompleted = completedTrips.includes(idx);
          const isCurrent = idx === currentTrip;
          const isPending = idx > currentTrip;

          return (
            <div key={idx} className="flex-1 text-center">
              <p
                className={cn(
                  'text-xs transition-colors',
                  isCompleted && 'text-green-600 font-semibold',
                  isCurrent && 'text-blue-600 font-semibold',
                  isPending && 'text-gray-400'
                )}
              >
                Trip {idx + 1}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};