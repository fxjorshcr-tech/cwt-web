// src/components/booking/TripProgress.tsx
// ✅ MEJORADO: Estilo "Step by Step" más claro y menos confuso
'use client';

import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripProgressProps {
  currentTrip: number;
  totalTrips: number;
  completedTrips?: number[];
}

export const TripProgress: React.FC<TripProgressProps> = ({
  currentTrip,
  totalTrips,
  completedTrips = [],
}) => {
  if (totalTrips <= 1) return null;

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-5 border border-gray-200">
      {/* Header - Trip X of Y */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-gray-900">
          Trip {currentTrip + 1} of {totalTrips}
        </h3>
      </div>

      {/* Progress Bar with Dots */}
      <div className="relative mb-6">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
        
        {/* Completed Line (Green) */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ 
            width: totalTrips > 1 ? `${(currentTrip / (totalTrips - 1)) * 100}%` : '0%' 
          }}
        />

        {/* Progress Dots */}
        <div className="relative flex justify-between items-center">
          {Array.from({ length: totalTrips }).map((_, idx) => {
            const isCompleted = completedTrips.includes(idx);
            const isCurrent = idx === currentTrip;
            const isPending = idx > currentTrip && !isCompleted;

            return (
              <div
                key={idx}
                className={cn(
                  'w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-300',
                  isCompleted && 'bg-green-500 border-green-500',
                  isCurrent && 'bg-blue-500 border-blue-500 ring-4 ring-blue-100',
                  isPending && 'bg-white border-gray-300'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : isCurrent ? (
                  <Circle className="w-3 h-3 text-white fill-white" />
                ) : (
                  <Circle className="w-3 h-3 text-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels Below Dots */}
      <div className="flex justify-between items-start gap-2">
        {Array.from({ length: totalTrips }).map((_, idx) => {
          const isCompleted = completedTrips.includes(idx);
          const isCurrent = idx === currentTrip;
          const isPending = idx > currentTrip && !isCompleted;

          return (
            <div key={idx} className="flex-1 text-center">
              <p
                className={cn(
                  'text-sm font-medium transition-colors',
                  isCompleted && 'text-green-600',
                  isCurrent && 'text-blue-600',
                  isPending && 'text-gray-400'
                )}
              >
                {isCurrent && 'Completing '}
                {isCompleted && !isCurrent && '✓ '}
                Trip {idx + 1}
              </p>
              
              {isCurrent && (
                <p className="text-xs text-gray-500 mt-1">Current</p>
              )}
              {isCompleted && !isCurrent && (
                <p className="text-xs text-green-600 mt-1">Done</p>
              )}
              {isPending && (
                <p className="text-xs text-gray-400 mt-1">Next</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Text - More Descriptive */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Complete the details for <strong className="text-blue-600">Trip {currentTrip + 1}</strong>
          </p>
          
          {completedTrips.length > 0 && (
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
              {completedTrips.length} of {totalTrips} completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};