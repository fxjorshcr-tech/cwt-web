// src/components/forms/ModernDatePicker.tsx
// ✅ UPDATED: Now includes integrated time picker
// ✅ FIXED: Timezone bug corregido - Retorna fechas normalizadas

'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { getNowInCostaRica } from '@/utils/timeHelpers';

interface ModernDatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  className?: string;
  enforceMinimumAdvance?: boolean; // Enable 12-hour cutoff (blocks today if past noon CR time)
  // New: Time picker props
  showTimePicker?: boolean;
  selectedTime?: string; // Format: "HH:mm" (e.g., "09:00")
  onTimeChange?: (time: string) => void;
  darkMode?: boolean; // Dark background styling for horizontal form
}

/**
 * ModernDatePicker
 * 
 * ✅ FIXED: Todas las fechas se normalizan a medianoche LOCAL
 * ✅ FIXED: No hay conversión UTC que cause pérdida de días
 * ✅ Calendario en inglés
 * ✅ Solo permite fechas futuras (hasta 1 año adelante)
 * ✅ Click outside para cerrar
 * ✅ Escape key para cerrar
 * ✅ Accesibilidad completa
 */
// Generate time options (every 30 minutes)
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  const time24 = `${hours.toString().padStart(2, '0')}:${minutes}`;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const time12 = `${hours12}:${minutes} ${period}`;
  return { value: time24, label: time12 };
});

export function ModernDatePicker({
  value,
  onChange,
  label,
  className = '',
  enforceMinimumAdvance = false,
  showTimePicker = false,
  selectedTime = '09:00',
  onTimeChange,
  darkMode = false,
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate minimum bookable date based on 12-hour advance booking requirement
  // - Today is ALWAYS blocked (no same-day bookings)
  // - If past noon CR time, tomorrow is ALSO blocked
  const minimumDaysAhead = useMemo(() => {
    if (!enforceMinimumAdvance) return 0; // No restriction
    const crNow = getNowInCostaRica();
    // If it's past noon (12:00) in Costa Rica, need to book 2+ days ahead
    // Otherwise, need to book 1+ day ahead (tomorrow minimum)
    return crNow.getHours() >= 12 ? 2 : 1;
  }, [enforceMinimumAdvance]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key to close
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

  /**
   * ✅ NUEVO: Normalizar fecha a medianoche LOCAL
   * Evita bug de timezone al crear Date con año/mes/día directamente
   */
  const normalizeDateToLocal = (year: number, month: number, day: number): Date => {
    const normalized = new Date(year, month, day, 0, 0, 0, 0);
    return normalized;
  };

  const daysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // ✅ Today normalizado a medianoche local
  const today = normalizeDateToLocal(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  // Max date: 1 año adelante
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  maxDate.setHours(23, 59, 59, 999);

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    if (newMonth <= maxDate) {
      setCurrentMonth(newMonth);
    }
  };

  const handleDateSelect = (day: number) => {
    // ✅ FIXED: Crear fecha normalizada a local
    const selectedDate = normalizeDateToLocal(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    // Calculate minimum allowed date based on minimumDaysAhead
    const minAllowedDate = new Date(today);
    minAllowedDate.setDate(today.getDate() + minimumDaysAhead);

    const isBlocked = selectedDate < minAllowedDate || selectedDate > maxDate;

    if (!isBlocked) {
      onChange(selectedDate);
      // If showTimePicker is enabled, keep popup open so user can select time
      // Otherwise close immediately
      if (!showTimePicker) {
        setIsOpen(false);
      }
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 sm:h-10" />);
    }

    // Render each day
    for (let day = 1; day <= totalDays; day++) {
      // ✅ FIXED: Crear fecha normalizada
      const date = normalizeDateToLocal(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      // Calculate minimum allowed date based on minimumDaysAhead
      const minAllowedDate = new Date(today);
      minAllowedDate.setDate(today.getDate() + minimumDaysAhead);

      const isTooSoon = date < minAllowedDate;
      const isFuture = date > maxDate;
      const isDisabled = isTooSoon || isFuture;
      
      const isSelected = value && 
        date.getDate() === value.getDate() &&
        date.getMonth() === value.getMonth() &&
        date.getFullYear() === value.getFullYear();

      let buttonClass = 'h-8 sm:h-10 w-full rounded-lg text-xs sm:text-sm font-medium transition-colors ';
      if (isDisabled) {
        buttonClass += 'text-gray-300 cursor-not-allowed';
      } else if (isSelected) {
        buttonClass += 'bg-blue-500 text-white hover:bg-blue-600';
      } else {
        buttonClass += 'hover:bg-blue-50 text-gray-700';
      }

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
          aria-label={`Select ${format(date, 'MMMM d, yyyy', { locale: enUS })}`}
          aria-pressed={isSelected ? true : undefined}
          className={buttonClass}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const canGoPrev = currentMonth > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1) <= maxDate;

  return (
    <div ref={containerRef} className={`relative notranslate ${className}`} translate="no">
      {label && (
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select travel date"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`w-full px-4 py-3 text-left rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          darkMode
            ? 'bg-white/10 border border-white/20 hover:border-white/40'
            : 'bg-white border border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value ? format(value, 'MMM d, yyyy', { locale: enUS }) : 'Select date'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-4 left-0 right-0 sm:left-auto sm:right-auto sm:w-80"
          role="dialog"
          aria-label="Date picker"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="font-semibold text-gray-900" aria-live="polite">
              {format(currentMonth, 'MMMM yyyy', { locale: enUS })}
            </div>
            
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={!canGoNext}
              aria-label="Next month"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="h-6 sm:h-10 flex items-center justify-center text-[10px] sm:text-xs font-medium text-gray-500"
                aria-label={day}
              >
                {day.slice(0, 2)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1" role="grid">
            {renderCalendarDays()}
          </div>

          {/* Time Picker Section - Simple dropdown */}
          {showTimePicker && (
            <div className={`mt-4 pt-4 border-t ${value ? 'bg-blue-50 -mx-4 px-4 pb-4 rounded-b-xl' : ''}`}>
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium flex items-center gap-2 ${value ? 'text-blue-800' : 'text-gray-700'}`}>
                  <Clock className={`h-4 w-4 ${value ? 'text-blue-600' : 'text-blue-500'}`} />
                  {value ? 'Select pickup time:' : 'Pickup Time'}
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => {
                    onTimeChange?.(e.target.value);
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!showTimePicker && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                You can book up to one year in advance
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}