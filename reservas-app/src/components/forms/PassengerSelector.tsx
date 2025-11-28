// src/components/forms/PassengerSelector.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Users, Plus, Minus, AlertTriangle } from 'lucide-react';

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

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleAdultsChange = (delta: number) => {
    const newAdults = Math.max(1, Math.min(12, adults + delta));
    if (newAdults + children <= 12) {
      onPassengersChange(newAdults, children);
    }
  };

  const handleChildrenChange = (delta: number) => {
    const newChildren = Math.max(0, Math.min(12, children + delta));
    if (adults + newChildren <= 12) {
      onPassengersChange(adults, newChildren);
    }
  };

  const getPassengerText = () => {
    const parts = [];
    if (adults > 0) {
      parts.push(`${adults} ${adults === 1 ? 'Adult' : 'Adults'}`);
    }
    if (children > 0) {
      parts.push(`${children} ${children === 1 ? 'Child' : 'Children'}`);
    }
    return parts.join(', ');
  };

  return (
    <div ref={containerRef} className={`relative notranslate ${className}`} translate="no">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Main Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select number of passengers"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className="text-gray-900">{getPassengerText()}</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {totalPassengers} total
          </span>
        </div>
      </button>

      {/* Passenger Dropdown */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-full min-w-[260px] sm:min-w-[280px] max-w-[calc(100vw-2rem)]"
          role="dialog"
          aria-label="Passenger selector"
        >
          
          {/* Adults */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div>
              <p className="font-semibold text-gray-900">Adults</p>
              <p className="text-xs text-gray-500">Age 13+</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleAdultsChange(-1)}
                disabled={adults <= 1}
                aria-label="Decrease number of adults"
                className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
              >
                <Minus className="h-4 w-4 text-gray-600" aria-hidden="true" />
              </button>
              
              <span 
                className="w-8 text-center font-semibold text-lg"
                aria-label={`${adults} adults`}
                role="status"
              >
                {adults}
              </span>
              
              <button
                type="button"
                onClick={() => handleAdultsChange(1)}
                disabled={totalPassengers >= 12}
                aria-label="Increase number of adults"
                className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
              >
                <Plus className="h-4 w-4 text-gray-600" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Children</p>
              <p className="text-xs text-gray-500">Age 0-12</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChildrenChange(-1)}
                disabled={children <= 0}
                aria-label="Decrease number of children"
                className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
              >
                <Minus className="h-4 w-4 text-gray-600" aria-hidden="true" />
              </button>
              
              <span 
                className="w-8 text-center font-semibold text-lg"
                aria-label={`${children} children`}
                role="status"
              >
                {children}
              </span>
              
              <button
                type="button"
                onClick={() => handleChildrenChange(1)}
                disabled={totalPassengers >= 12}
                aria-label="Increase number of children"
                className="h-8 w-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white"
              >
                <Plus className="h-4 w-4 text-gray-600" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Limit Warning */}
          {totalPassengers >= 12 && (
            <div className="mt-4 pt-4 border-t border-orange-200 bg-orange-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-orange-900 mb-1">
                    Maximum 12 passengers per trip
                  </p>
                  <p className="text-xs text-orange-700">
                    For groups of 13+, please contact us on WhatsApp
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Done Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}