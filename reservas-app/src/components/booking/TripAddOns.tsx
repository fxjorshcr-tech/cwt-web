// src/components/booking/TripAddOns.tsx
// ✅ FINAL CORREGIDO: Sin nota morada + paréntesis en Free Reschedule

'use client';

import React from 'react';
import { Clock, Gift, Sparkles, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface AddOn {
  id: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  icon: any;
  popular?: boolean;
  badge?: string;
}

export const AVAILABLE_ADDONS: AddOn[] = [
  {
    id: 'flex_protection',
    name: 'Travel Flex',
    description: '',
    details: [
      '**Pickup time change:** Adjust up to 2 hours later, even last minute',
      '**Free reschedule** for flight delays/cancellations (only airport pickups apply)',
    ],
    price: 59,
    icon: Clock,
    popular: true,
    badge: 'POPULAR',
  },
  {
    id: 'explorer_upgrade',
    name: 'Explorer Upgrade',
    description: 'Turn your transfer into an adventure',
    details: [
      '⭐ **All Flex Protection:** Includes all Flex Protection benefits',
      '🏞️ **Scenic Stops:** Add 3 hours to your trip to stop at waterfalls, scenic viewpoints, restaurants, or souvenir shops along your route',
      '🧊 **Complimentary Cooler:** Cooler with National Beers, San Pellegrino, Sodas & Snacks',
    ],
    price: 195,
    icon: Gift,
    popular: false,
    badge: 'DELUXE',
  },
];

interface TripAddOnsProps {
  selectedAddOns: string[];
  onAddOnsChange: (addOnIds: string[]) => void;
}

export function TripAddOns({ selectedAddOns, onAddOnsChange }: TripAddOnsProps) {
  const handleToggleAddOn = (addOnId: string) => {
    // Si selecciona Explorer Upgrade, reemplazar todo con Explorer (incluye Flex)
    if (addOnId === 'explorer_upgrade' && !selectedAddOns.includes(addOnId)) {
      onAddOnsChange(['explorer_upgrade']);
    }
    // Si deselecciona Explorer Upgrade, quitar todo
    else if (addOnId === 'explorer_upgrade' && selectedAddOns.includes(addOnId)) {
      onAddOnsChange([]);
    }
    // Si selecciona Flex Protection (y Explorer NO está activo)
    else if (addOnId === 'flex_protection' && !selectedAddOns.includes('explorer_upgrade')) {
      if (selectedAddOns.includes('flex_protection')) {
        onAddOnsChange([]);
      } else {
        onAddOnsChange(['flex_protection']);
      }
    }
  };

  // ✅ Calcular precio correcto: Si Explorer está seleccionado, solo contar Explorer
  const totalAddOnsPrice = selectedAddOns.includes('explorer_upgrade')
    ? 195  // Solo Explorer
    : selectedAddOns.includes('flex_protection')
    ? 59   // Solo Flex
    : 0;   // Ninguno

  // Helper para renderizar texto con negrita
  const renderDetail = (detail: string) => {
    const parts = detail.split('**');
    return (
      <>
        {parts.map((part, idx) => 
          idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
        )}
      </>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 notranslate overflow-hidden" translate="no">
      <CardHeader className="pb-3 px-3 sm:px-6">
        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2 text-blue-900">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          Enhance Your Experience
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 px-3 sm:px-6">
        {/* Social Proof Banner */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <Users className="h-4 w-4 text-green-600 flex-shrink-0" />
          <p className="text-xs md:text-sm text-green-800 font-medium">
            <span className="font-bold">95% of travelers</span> add Travel Flex for peace of mind
          </p>
        </div>

        {AVAILABLE_ADDONS.map((addon) => {
          const isExplorerSelected = selectedAddOns.includes('explorer_upgrade');
          const isSelected = selectedAddOns.includes(addon.id) || 
                           (addon.id === 'flex_protection' && isExplorerSelected);
          const Icon = addon.icon;
          const isDisabled = addon.id === 'flex_protection' && isExplorerSelected;

          return (
            <div
              key={addon.id}
              onClick={() => !isDisabled && handleToggleAddOn(addon.id)}
              className={`
                relative p-3 md:p-4 rounded-lg border-2 transition-all
                ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                ${isSelected 
                  ? 'border-blue-500 bg-white shadow-md' 
                  : 'border-blue-200 bg-white/50 hover:border-blue-300 hover:bg-white'
                }
              `}
            >
              {/* Badge */}
              {addon.badge && (
                <div className={`
                  absolute -top-2 right-2 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-lg z-10
                  ${addon.badge === 'POPULAR'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                  }
                `}>
                  {addon.badge}
                </div>
              )}

              <div className="flex items-start gap-2">
                {/* Checkbox */}
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) handleToggleAddOn(addon.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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
                  {/* Title y Precio */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-semibold text-sm md:text-base ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {addon.name}
                    </h4>
                    <div className={`
                      text-base md:text-lg font-bold whitespace-nowrap flex-shrink-0
                      ${isSelected ? 'text-blue-600' : 'text-gray-600'}
                    `}>
                      +${addon.price}
                    </div>
                  </div>

                  {/* Details con emojis y títulos en negrita */}
                  <ul className="space-y-1">
                    {addon.details.map((detail, idx) => (
                      <li key={idx} className="text-xs md:text-sm text-gray-600 leading-relaxed">
                        {renderDetail(detail)}
                      </li>
                    ))}
                  </ul>
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

// ✅ Helper corregido: Si Explorer está seleccionado, solo contar Explorer
export function calculateAddOnsPrice(addOnIds: string[]): number {
  if (addOnIds.includes('explorer_upgrade')) {
    return 195;  // Solo Explorer (incluye Flex)
  } else if (addOnIds.includes('flex_protection')) {
    return 59;   // Solo Flex
  }
  return 0;
}

// Helper to get add-on names for display
export function getAddOnNames(addOnIds: string[]): string[] {
  return AVAILABLE_ADDONS
    .filter(addon => addOnIds.includes(addon.id))
    .map(addon => addon.name);
}