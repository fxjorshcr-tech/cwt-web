// src/components/home/PassengerSelector.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { Users, Plus, Minus } from 'lucide-react';

interface PassengerSelectorProps {
  adults: number;
  children: number;
  onPassengersChange: (adults: number, children: number) => void;
  label?: string;
  className?: string;
}

export function PassengerSelector({
  adults,
  children,
  onPassengersChange,
  label,
  className = '',
}: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPassengers = adults + children;

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdultsChange = (delta: number) => {
    const newAdults = Math.max(1, Math.min(18, adults + delta));
    if (newAdults + children <= 18) {
      onPassengersChange(newAdults, children);
    }
  };

  const handleChildrenChange = (delta: number) => {
    const newChildren = Math.max(0, Math.min(18, children + delta));
    if (adults + newChildren <= 18) {
      onPassengersChange(adults, newChildren);
    }
  };

  const getPassengerText = () => {
    const parts = [];
    if (adults > 0) {
      parts.push(`${adults} ${adults === 1 ? 'Adulto' : 'Adultos'}`);
    }
    if (children > 0) {
      parts.push(`${children} ${children === 1 ? 'Niño' : 'Niños'}`);
    }
    return parts.join(', ');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Botón Principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-gray-900">{getPassengerText()}</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {totalPassengers} total
          </span>
        </div>
      </button>

      {/* Dropdown de Pasajeros */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-full min-w-[280px]">
          
          {/* Adultos */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div>
              <p className="font-semibold text-gray-900">Adultos</p>
              <p className="text-xs text-gray-500">13+ años</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleAdultsChange(-1)}
                disabled={adults <= 1}
                className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
              >
                <Minus className="h-4 w-4 text-gray-600" />
              </button>
              
              <span className="w-8 text-center font-semibold text-lg">
                {adults}
              </span>
              
              <button
                type="button"
                onClick={() => handleAdultsChange(1)}
                disabled={totalPassengers >= 18}
                className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Niños */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Niños</p>
              <p className="text-xs text-gray-500">0-12 años</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChildrenChange(-1)}
                disabled={children <= 0}
                className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
              >
                <Minus className="h-4 w-4 text-gray-600" />
              </button>
              
              <span className="w-8 text-center font-semibold text-lg">
                {children}
              </span>
              
              <button
                type="button"
                onClick={() => handleChildrenChange(1)}
                disabled={totalPassengers >= 18}
                className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Info de Límite */}
          {totalPassengers >= 18 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-amber-600 text-center">
                ⚠️ Máximo 18 pasajeros por viaje
              </p>
            </div>
          )}

          {/* Botón Listo */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Listo
          </button>
        </div>
      )}
    </div>
  );
}