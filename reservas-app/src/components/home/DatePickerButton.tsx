// src/components/home/DatePickerButton.tsx
// FIXED: Removed invalid 'container' prop

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
 * CARACTERÍSTICAS:
 * - Calendario en español
 * - Solo permite fechas futuras (no pasadas)
 * - Integrado con Popover de shadcn/ui
 * - Z-index alto para aparecer sobre todo
 * - Funciona en mobile y desktop
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
  placeholder = 'Selecciona una fecha',
  className,
  disabled = false,
}: DatePickerButtonProps) {
  const [open, setOpen] = useState(false);

  /**
   * Manejar la selección de fecha
   * - Actualiza el estado
   * - Cierra el popover
   * - Notifica al componente padre
   */
  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setOpen(false); // Cerrar el popover después de seleccionar
  };

  /**
   * Obtener la fecha mínima permitida (hoy)
   * Esto previene que se seleccionen fechas pasadas
   */
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetear hora para comparación correcta

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
              format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
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
            disabled={(date) => date < today}
            locale={es}
            initialFocus
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}