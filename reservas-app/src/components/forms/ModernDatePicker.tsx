// src/components/home/ModernDatePicker.tsx
// ✅ FIXED: Timezone bug corregido - Retorna fechas normalizadas
// ✅ UPDATED: 12-hour advance booking cutoff support

'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { getNowInCostaRica } from '@/utils/timeHelpers';

interface ModernDatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  className?: string;
  enforceMinimumAdvance?: boolean; // Enable 12-hour cutoff (blocks today if past noon CR time)
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
export function ModernDatePicker({
  value,
  onChange,
  label,
  className = '',
  enforceMinimumAdvance = false,
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate if today is blocked due to 12-hour advance booking requirement
  const isTodayBlocked = useMemo(() => {
    if (!enforceMinimumAdvance) return false;
    const crNow = getNowInCostaRica();
    // If it's past noon (12:00) in Costa Rica, today is blocked for bookings
    return crNow.getHours() >= 12;
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

    // Check if this is today and today is blocked
    const isToday =
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();

    const isBlocked = (isToday && isTodayBlocked) || selectedDate < today || selectedDate > maxDate;

    if (!isBlocked) {
      onChange(selectedDate);
      setIsOpen(false);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Render each day
    for (let day = 1; day <= totalDays; day++) {
      // ✅ FIXED: Crear fecha normalizada
      const date = normalizeDateToLocal(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      // Check if this is today
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const isPast = date < today;
      const isFuture = date > maxDate;
      const isTodayAndBlocked = isToday && isTodayBlocked;
      const isDisabled = isPast || isFuture || isTodayAndBlocked;
      
      const isSelected = value && 
        date.getDate() === value.getDate() &&
        date.getMonth() === value.getMonth() &&
        date.getFullYear() === value.getFullYear();

      let buttonClass = 'h-10 w-full rounded-lg text-sm font-medium transition-colors ';
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select travel date"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value 
              ? format(value, 'EEEE, MMMM d, yyyy', { locale: enUS })
              : 'Select a date'
            }
          </span>
        </div>
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80"
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
                className="h-10 flex items-center justify-center text-xs font-medium text-gray-500"
                aria-label={day}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1" role="grid">
            {renderCalendarDays()}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              You can book up to one year in advance
            </p>
          </div>
        </div>
      )}
    </div>
  );
}