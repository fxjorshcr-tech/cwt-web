// src/components/home/TimePicker.tsx
// ✅ COMPLETE 24-HOUR TIME PICKER with Night Surcharge Notification

'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  className?: string;
  showNightSurchargeWarning?: boolean;
}

// Generate ALL time options (every 30 minutes, 24 hours)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      const timeValue = `${h}:${m}`;
      
      // Format for display (12-hour format)
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayTime = `${displayHour}:${m} ${period}`;
      
      // Check if it's night time (9 PM - 4 AM = 21:00 - 03:59)
      const isNightTime = hour >= 21 || hour < 4;
      
      times.push({ 
        value: timeValue, 
        label: displayTime,
        isNightTime 
      });
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

// Check if a time is in night surcharge period
const isNightSurchargeTime = (time: string): boolean => {
  if (!time) return false;
  const [hoursStr] = time.split(':');
  const hours = parseInt(hoursStr, 10);
  return hours >= 21 || hours < 4;
};

export function TimePicker({ 
  value, 
  onChange, 
  label, 
  className = '',
  showNightSurchargeWarning = true 
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const isNightTime = isNightSurchargeTime(value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Scroll to selected option when opening
  useEffect(() => {
    if (isOpen && selectedRef.current) {
      selectedRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [isOpen]);

  const getDisplayValue = () => {
    if (!value) return 'Select pickup time';
    
    const option = timeOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleSelect = (timeValue: string) => {
    onChange(timeValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select pickup time"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`w-full px-4 py-3 text-left bg-white border rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          isNightTime ? 'border-amber-300 bg-amber-50' : 'border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className={`h-5 w-5 ${isNightTime ? 'text-amber-600' : 'text-gray-400'}`} aria-hidden="true" />
            <span className={value ? 'text-gray-900' : 'text-gray-400'}>
              {getDisplayValue()}
            </span>
          </div>
          {isNightTime && (
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded">
              +$50
            </span>
          )}
        </div>
      </button>

      {/* Night Surcharge Warning */}
      {showNightSurchargeWarning && isNightTime && value && (
        <div className="flex items-start gap-2 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900">Night Surcharge Applied</p>
            <p className="text-amber-700">
              Pickups between <strong>9:00 PM - 3:59 AM</strong> include a <strong>$50</strong> surcharge
            </p>
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 max-h-80 overflow-y-auto"
          role="listbox"
          aria-label="Time options"
        >
          {/* Section Headers */}
          <div className="sticky top-0 bg-gradient-to-b from-blue-50 to-white px-4 py-2 border-b z-10">
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
              Select Pickup Time
            </p>
          </div>

          {/* Morning Section (12 AM - 11:59 AM) */}
          <div className="px-2 py-1">
            <div className="sticky top-8 bg-gray-50 px-2 py-1 mb-1">
              <p className="text-xs font-semibold text-gray-600">Morning (12 AM - 11:59 AM)</p>
            </div>
            {timeOptions.filter((opt) => {
              const hour = parseInt(opt.value.split(':')[0]);
              return hour >= 0 && hour < 12;
            }).map((option) => {
              const isSelected = value === option.value;
              
              return (
                <button
                  key={option.value}
                  ref={isSelected ? selectedRef : null}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors rounded-md flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-500 text-white font-semibold'
                      : option.isNightTime
                      ? 'text-amber-900 bg-amber-50 hover:bg-amber-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{option.label}</span>
                  {option.isNightTime && !isSelected && (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-200 px-2 py-0.5 rounded">
                      +$50
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Afternoon Section (12 PM - 5:59 PM) */}
          <div className="px-2 py-1">
            <div className="sticky top-8 bg-gray-50 px-2 py-1 mb-1">
              <p className="text-xs font-semibold text-gray-600">Afternoon (12 PM - 5:59 PM)</p>
            </div>
            {timeOptions.filter((opt) => {
              const hour = parseInt(opt.value.split(':')[0]);
              return hour >= 12 && hour < 18;
            }).map((option) => {
              const isSelected = value === option.value;
              
              return (
                <button
                  key={option.value}
                  ref={isSelected ? selectedRef : null}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors rounded-md ${
                    isSelected
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Evening Section (6 PM - 11:59 PM) */}
          <div className="px-2 py-1">
            <div className="sticky top-8 bg-gray-50 px-2 py-1 mb-1">
              <p className="text-xs font-semibold text-gray-600">Evening (6 PM - 11:59 PM)</p>
            </div>
            {timeOptions.filter((opt) => {
              const hour = parseInt(opt.value.split(':')[0]);
              return hour >= 18 && hour < 24;
            }).map((option) => {
              const isSelected = value === option.value;
              
              return (
                <button
                  key={option.value}
                  ref={isSelected ? selectedRef : null}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors rounded-md flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-500 text-white font-semibold'
                      : option.isNightTime
                      ? 'text-amber-900 bg-amber-50 hover:bg-amber-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{option.label}</span>
                  {option.isNightTime && !isSelected && (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-200 px-2 py-0.5 rounded">
                      +$50
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Helper */}
          <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 to-white px-4 py-3 border-t">
            <p className="text-xs text-gray-500 text-center">
              💡 Night surcharge applies to pickups between 9 PM - 4 AM
            </p>
          </div>
        </div>
      )}
    </div>
  );
}