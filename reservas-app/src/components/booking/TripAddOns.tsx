// src/components/booking/TripAddOns.tsx
// Add-ons selector for trips - Tico Time Upgrade & Flex Time Protection

'use client';

import React from 'react';
import { Clock, Shield, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Simple Checkbox component (si no tienes @/components/ui/checkbox)
function SimpleCheckbox({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: () => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        e.stopPropagation(); // Evitar doble trigger
        onCheckedChange();
      }}
      onClick={(e) => e.stopPropagation()} // Evitar que el click se propague al card
      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
    />
  );
}

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
    id: 'tico-time',
    name: 'Tico Time Upgrade',
    description: 'Add 3 extra hours to explore Costa Rica! Stop at scenic viewpoints, enjoy a traditional casado lunch, visit local attractions, or capture stunning photos at hidden gems along the way.',
    price: 160,
    icon: Clock,
    popular: true,
  },
  {
    id: 'flex-time',
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
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
          <Clock className="h-5 w-5" />
          Enhance Your Experience
        </CardTitle>
        <p className="text-sm text-blue-700">
          Make the most of your journey with our exclusive add-ons
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {AVAILABLE_ADDONS.map((addon) => {
          const isSelected = selectedAddOns.includes(addon.id);
          const Icon = addon.icon;

          return (
            <div
              key={addon.id}
              onClick={() => handleToggleAddOn(addon.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all cursor-pointer
                ${isSelected 
                  ? 'border-blue-500 bg-white shadow-md' 
                  : 'border-blue-200 bg-white/50 hover:border-blue-300 hover:bg-white'
                }
              `}
            >
              {addon.popular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  POPULAR
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="mt-1">
                  <SimpleCheckbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleAddOn(addon.id)}
                  />
                </div>

                {/* Icon */}
                <div className={`
                  h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'bg-blue-100' : 'bg-blue-50'}
                `}>
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-blue-400'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {addon.name}
                    </h4>
                    <div className={`
                      text-lg font-bold whitespace-nowrap
                      ${isSelected ? 'text-blue-600' : 'text-gray-600'}
                    `}>
                      +${addon.price}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {addon.description}
                  </p>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Total add-ons */}
        {totalAddOnsPrice > 0 && (
          <div className="pt-3 border-t border-blue-200">
            <div className="flex justify-between items-center bg-blue-100 rounded-lg p-3">
              <span className="font-semibold text-blue-900">
                Add-ons Total:
              </span>
              <span className="text-xl font-bold text-blue-600">
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