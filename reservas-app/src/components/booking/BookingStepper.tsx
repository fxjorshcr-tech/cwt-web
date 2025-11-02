// src/components/booking/BookingStepper.tsx
// MINIMALIST TAB-STYLE STEPPER - Professional & Compact
// 100% Shadcn/ui + Tailwind CSS

'use client';

import React from 'react';
import { Check } from 'lucide-react';

// Shadcn/ui helper para combinar clases
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface BookingStepperProps {
  currentStep: number; // 0: Search, 1: Booking Details, 2: Summary, 3: Payment
}

const steps = [
  { id: 0, label: 'Search' },
  { id: 1, label: 'Booking Details' },
  { id: 2, label: 'Summary' },
  { id: 3, label: 'Payment' },
];

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center gap-1">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div
                key={step.id}
                className={cn(
                  'flex-1 relative py-4 px-6 text-center font-medium text-sm transition-all cursor-default',
                  isCompleted && 'text-green-600 bg-green-50',
                  isCurrent && 'text-blue-600 bg-blue-50 border-b-2 border-blue-600',
                  isPending && 'text-gray-400 bg-gray-50'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  {isCompleted ? (
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold',
                        isCurrent && 'bg-blue-600 text-white',
                        isPending && 'bg-gray-300 text-gray-600'
                      )}
                    >
                      {step.id + 1}
                    </div>
                  )}
                  <span>{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Simplified */}
        <div className="md:hidden py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs text-gray-500">{steps[currentStep].label}</span>
          </div>
          
          <div className="flex gap-1">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex-1 h-1.5 rounded-full transition-all',
                    isCompleted && 'bg-green-500',
                    isCurrent && 'bg-blue-600',
                    !isCompleted && !isCurrent && 'bg-gray-200'
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}