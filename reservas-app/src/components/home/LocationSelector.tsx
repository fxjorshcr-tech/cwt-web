'use client';

import * as React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface LocationSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  locations: string[];
  placeholder?: string;
  label?: string;
  className?: string;
}

export function LocationSelector({
  value,
  onValueChange,
  locations,
  placeholder = 'Seleccionar ubicación...',
  label,
  className,
}: LocationSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // Filtrar ubicaciones basado en la búsqueda
  const filteredLocations = React.useMemo(() => {
    if (!search) return locations;
    
    const searchLower = search.toLowerCase();
    return locations.filter(location =>
      location.toLowerCase().includes(searchLower)
    );
  }, [locations, search]);

  // Formatear el texto mostrado
  const displayText = value || placeholder;

  const handleSelect = (location: string) => {
    onValueChange(location);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium">{label}</Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between font-normal hover:bg-gray-50 transition-colors',
              !value && 'text-muted-foreground',
              className
            )}
          >
            <span className="truncate text-left flex-1">
              {displayText}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-2" align="start">
          <div className="space-y-2">
            {/* Campo de búsqueda */}
            <div className="flex items-center border-b pb-2">
              <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Buscar ubicación..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 focus:ring-0 p-0"
              />
            </div>
            
            {/* Lista de ubicaciones */}
            <div className="max-h-[300px] overflow-y-auto">
              {filteredLocations.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No se encontraron ubicaciones
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredLocations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleSelect(location)}
                      className={cn(
                        'w-full text-left px-2 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
                        value === location && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{location}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}