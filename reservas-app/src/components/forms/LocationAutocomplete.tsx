// src/components/home/LocationAutocomplete.tsx
// ✅ CORREGIDO: Sin usar alias (campo null en DB)
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Search, X } from 'lucide-react';

interface Route {
  id: number;
  origen: string;
  destino: string;
}

interface LocationAutocompleteProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  routes: Route[];
  filterByOrigin?: string;
  filterByDestination?: string;
  disabled?: boolean;
  type: 'origin' | 'destination';
  darkMode?: boolean;
}

export function LocationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  routes,
  filterByOrigin,
  filterByDestination,
  disabled = false,
  type,
  darkMode = false,
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync inputValue with value prop when it changes (e.g., from URL params)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Get all available locations (WITHOUT search filter here)
  const availableLocations = useMemo(() => {
    let filteredRoutes = routes;

    // SOLO filtrar por rutas conectadas si es necesario
    if (type === 'destination' && filterByOrigin) {
      // Destino: solo mostrar destinos conectados al origen seleccionado
      filteredRoutes = routes.filter((r) => r.origen === filterByOrigin);
    } else if (type === 'origin' && filterByDestination) {
      // Origen: solo mostrar orígenes conectados al destino seleccionado (raro pero posible)
      filteredRoutes = routes.filter((r) => r.destino === filterByDestination);
    }
    // Si no hay filtro, usar TODAS las rutas

    const locationSet = new Set<string>();
    filteredRoutes.forEach((route) => {
      const location = type === 'origin' ? route.origen : route.destino;
      if (location) {
        locationSet.add(location);
      }
    });

    return Array.from(locationSet).sort();
  }, [routes, type, filterByOrigin, filterByDestination]);

  // Filter locations based on what user is typing
  const filteredLocations = useMemo(() => {
    // Si no hay búsqueda, mostrar TODOS los disponibles
    if (!inputValue.trim()) {
      return availableLocations;
    }

    const searchLower = inputValue.toLowerCase().trim();

    // SOLO buscar en el nombre del location
    return availableLocations.filter((location) => {
      return location.toLowerCase().includes(searchLower);
    });
  }, [inputValue, availableLocations]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
  };

  const handleSelect = (location: string) => {
    setInputValue(location);
    onChange(location);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange('');
    setIsOpen(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="space-y-1.5 relative notranslate w-full overflow-visible" translate="no">
      {label && (
        <label className={`flex items-center gap-1.5 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <MapPin className={`h-3.5 w-3.5 ${type === 'origin' ? 'text-blue-500' : 'text-orange-500'}`} />
          {label}
        </label>
      )}

      <div className="relative w-full">
        <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none z-10 ${
          type === 'origin' ? 'text-blue-500' : 'text-orange-500'
        }`} />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-9 pr-9 py-3 text-[16px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:cursor-not-allowed ${
            darkMode
              ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400 disabled:bg-white/5 disabled:text-gray-500'
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400'
          }`}
          autoComplete="off"
        />
        {inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors z-10 ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Dropdown - always light background for readability */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
          >
            {filteredLocations.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No locations found
              </div>
            ) : (
              <ul className="py-1">
                {filteredLocations.map((location) => (
                  <li key={location}>
                    <button
                      type="button"
                      onClick={() => handleSelect(location)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 ${
                        value === location ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="flex-1">{location}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}