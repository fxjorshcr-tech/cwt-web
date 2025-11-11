// src/components/booking/TripAddOns.tsx
// ✅ MOBILE-OPTIMIZED - Checkbox arreglado, diseño compacto

'use client';

import React from 'react';
import { Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: any;
  popular?: boolean;
}

export const AVAILABLE_ADDONS: AddOn[] = [
  {
    id: 'tico_time',
    name: 'Tico Time Upgrade',
    description: 'Add 3 extra hours to explore Costa Rica! Stop at scenic viewpoints, enjoy a traditional casado lunch, visit local attractions, or capture stunning photos at hidden gems along the way.',
    price: 160,
    icon: Clock,
    popular: true,
  },
  {
    id: 'flex_time',
    name: 'Flex Time Protection',
    description: 'Life happens! Get up to 2 hours of flexibility if your plans change. Perfect for late checkouts, unexpected delays, or simply wanting to enjoy that last swim.',
    price: 45,
    icon: Shield,
  },
];

interface TripAddOnsProps {
  selectedAddOns: string[];
  onAddOnsChange: (addOnIds: string[]) => void;
}

export function TripAddOns({ selectedAddOns, onAddOnsChange }: TripAddOnsProps) {
  const handleToggleAddOn = (addOnId: string) => {
    if (selectedAddOns.includes(addOnId)) {
      onAddOnsChange(selectedAddOns.filter(id => id !== addOnId));
    } else {
      onAddOnsChange([...selectedAddOns, addOnId]);
    }
  };

  const totalAddOnsPrice = AVAILABLE_ADDONS
    .filter(addon => selectedAddOns.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0);

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg flex items-center gap-2 text-blue-900">
          <Clock className="h-5 w-5" />
          Enhance Your Experience
        </CardTitle>
        <p className="text-xs md:text-sm text-blue-700">
          Make the most of your journey with our exclusive add-ons
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        {AVAILABLE_ADDONS.map((addon) => {
          const isSelected = selectedAddOns.includes(addon.id);
          const Icon = addon.icon;

          return (
            <div
              key={addon.id}
              onClick={() => handleToggleAddOn(addon.id)}
              className={`
                relative p-3 md:p-4 rounded-lg border-2 transition-all cursor-pointer
                ${isSelected 
                  ? 'border-blue-500 bg-white shadow-md' 
                  : 'border-blue-200 bg-white/50 hover:border-blue-300 hover:bg-white'
                }
              `}
            >
              {/* Badge POPULAR */}
              {addon.popular && (
                <div className="absolute -top-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-lg z-10">
                  POPULAR
                </div>
              )}

              <div className="flex items-start gap-2 md:gap-3">
                {/* ✅ CHECKBOX - IZQUIERDA, BIEN POSICIONADO */}
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleAddOn(addon.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Icon */}
                <div className={`
                  h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'bg-blue-100' : 'bg-blue-50'}
                `}>
                  <Icon className={`h-4 w-4 md:h-5 md:w-5 ${isSelected ? 'text-blue-600' : 'text-blue-400'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-2">
                  {/* Title y Precio en la misma línea */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-semibold text-sm md:text-base ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {addon.name}
                    </h4>
                    {/* ✅ PRECIO - DERECHA, SIN OVERLAP */}
                    <div className={`
                      text-base md:text-lg font-bold whitespace-nowrap flex-shrink-0
                      ${isSelected ? 'text-blue-600' : 'text-gray-600'}
                    `}>
                      +${addon.price}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {addon.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Total add-ons */}
        {totalAddOnsPrice > 0 && (
          <div className="pt-2">
            <div className="flex justify-between items-center bg-blue-100 rounded-lg p-3">
              <span className="font-semibold text-sm md:text-base text-blue-900">
                Add-ons Total:
              </span>
              <span className="text-lg md:text-xl font-bold text-blue-600">
                +${totalAddOnsPrice}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper to calculate add-ons price
export function calculateAddOnsPrice(addOnIds: string[]): number {
  return AVAILABLE_ADDONS
    .filter(addon => addOnIds.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0);
}

// Helper to get add-on names for display
export function getAddOnNames(addOnIds: string[]): string[] {
  return AVAILABLE_ADDONS
    .filter(addon => addOnIds.includes(addon.id))
    .map(addon => addon.name);
}