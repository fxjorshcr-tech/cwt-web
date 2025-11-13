// src/components/home/DatePickerButton.tsx
// ✅ FIXED: Timezone bug corregido + Cambiado a inglés

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface DatePickerButtonProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * COMPONENTE: DatePickerButton
 * 
 * Selector de fecha con calendario visual (shadcn/ui)
 * 
 * ✅ FIXED: Timezone bug - ahora normaliza fechas a medianoche LOCAL
 * ✅ FIXED: Idioma cambiado a inglés
 * 
 * CARACTERÍSTICAS:
 * - Calendario en inglés
 * - Solo permite fechas futuras (no pasadas)
 * - Integrado con Popover de shadcn/ui
 * - Z-index alto para aparecer sobre todo
 * - Funciona en mobile y desktop
 * - Fechas normalizadas a timezone local (sin conversión UTC)
 * 
 * @param date - Fecha actualmente seleccionada
 * @param onDateChange - Callback cuando cambia la fecha
 * @param label - Etiqueta del campo (opcional)
 * @param placeholder - Texto cuando no hay fecha seleccionada
 * @param className - Clases CSS adicionales
 * @param disabled - Si el selector está deshabilitado
 */
export function DatePickerButton({
  date,
  onDateChange,
  label,
  placeholder = 'Select a date',
  className,
  disabled = false,
}: DatePickerButtonProps) {
  const [open, setOpen] = useState(false);

  /**
   * ✅ NUEVO: Normalizar fecha a medianoche LOCAL (evita bug de timezone)
   * 
   * Problema anterior:
   * - Calendar devuelve: 2025-11-13T00:00:00.000Z (UTC)
   * - En Costa Rica (UTC-6): 2025-11-12T18:00:00 ❌
   * 
   * Solución:
   * - Crear fecha en timezone local usando año/mes/día
   * - Evitar conversión UTC automática
   */
  const normalizeDateToLocal = (date: Date): Date => {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return normalized;
  };

  /**
   * Manejar la selección de fecha
   * - Normaliza la fecha a medianoche local
   * - Actualiza el estado
   * - Cierra el popover
   * - Notifica al componente padre
   */
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const normalizedDate = normalizeDateToLocal(selectedDate);
      onDateChange(normalizedDate);
    } else {
      onDateChange(undefined);
    }
    setOpen(false);
  };

  /**
   * Obtener la fecha mínima permitida (hoy)
   * ✅ FIXED: También normalizada a medianoche local
   */
  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="space-y-2 relative">
      {label && (
        <Label htmlFor="date-picker" className="text-sm font-medium">
          {label}
        </Label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              // ✅ CHANGED: Formato en inglés
              format(date, "EEEE, MMMM d, yyyy")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-auto p-0 z-[9999]" 
          align="start"
          side="bottom"
          sideOffset={8}
          avoidCollisions={true}
          collisionPadding={20}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => {
              // ✅ FIXED: Comparar fechas normalizadas
              const normalizedDate = normalizeDateToLocal(date);
              return normalizedDate < normalizedToday;
            }}
            // ✅ REMOVED: locale={es} - Ahora usa inglés por defecto
            initialFocus
            className="rounded-md border min-w-[300px]"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}