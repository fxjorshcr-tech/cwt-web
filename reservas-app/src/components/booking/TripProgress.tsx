// src/components/booking/TripProgress.tsx

'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props para el componente TripProgress
 */
interface TripProgressProps {
  currentTrip: number;      // Índice del viaje actual (0-based)
  totalTrips: number;       // Número total de viajes
  completedTrips?: number[]; // Array de índices de viajes completados
}

/**
 * Componente TripProgress
 * Muestra una barra de progreso visual para múltiples viajes
 * Compatible con Tailwind CSS
 */
export const TripProgress: React.FC<TripProgressProps> = ({
  currentTrip,
  totalTrips,
  completedTrips = [],
}) => {
  // Si solo hay un viaje, no mostrar el progreso
  if (totalTrips <= 1) return null;

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      {/* Header con información textual */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          Completando viaje {currentTrip + 1} de {totalTrips}
        </p>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          {completedTrips.length}/{totalTrips} completados
        </span>
      </div>

      {/* Barra de progreso visual */}
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
              {/* Icono de check para viajes completados */}
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

      {/* Etiquetas de los viajes */}
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
                Viaje {idx + 1}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};