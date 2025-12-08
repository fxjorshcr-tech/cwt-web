// src/components/booking/BookingStepper.tsx
// ✅ SIMPLIFIED - 4 steps (Search → Trip Details → Checkout → Done)

'use client';

import React from 'react';
import { Check } from 'lucide-react';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface BookingStepperProps {
  currentStep: number; // 0: Search, 1: Trip Details, 2: Checkout, 3: Confirmation
}

const steps = [
  { id: 0, label: 'Search' },
  { id: 1, label: 'Trip Details' },
  { id: 2, label: 'Checkout' },
  { id: 3, label: 'Done' },
];

// Get motivational message based on progress
function getProgressMessage(step: number): string {
  switch (step) {
    case 0: return 'Start your journey';
    case 1: return 'Almost there!';
    case 2: return 'Final step!';
    case 3: return 'Complete!';
    default: return '';
  }
}

export default function BookingStepper({ currentStep }: BookingStepperProps) {
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);
  const progressMessage = getProgressMessage(currentStep);

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
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-xs font-bold text-blue-600">
                ({progressPercent}%)
              </span>
            </div>
            <span className="text-xs text-green-600 font-medium">{progressMessage}</span>
          </div>

          {/* Progress bar with percentage fill */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step dots */}
          <div className="flex justify-between mt-2">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all',
                    isCompleted && 'bg-green-500',
                    isCurrent && 'bg-blue-600 ring-2 ring-blue-200',
                    !isCompleted && !isCurrent && 'bg-gray-300'
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