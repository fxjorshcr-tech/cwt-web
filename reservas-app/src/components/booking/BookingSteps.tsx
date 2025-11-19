// src/components/booking/BookingSteps.tsx
// PROFESSIONAL VERSION - Con colores sutiles pero vibrante

'use client';

import { 
  Search,
  ClipboardList,
  CheckSquare,
  CreditCard,
  Clock
} from 'lucide-react';

export default function BookingSteps() {
  const steps = [
    { 
      icon: Search, 
      number: '01',
      title: 'Search', 
      description: 'Enter your pickup and drop-off locations',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    { 
      icon: ClipboardList, 
      number: '02',
      title: 'Details', 
      description: 'Add pickup time, passengers, and special requests',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    { 
      icon: CheckSquare, 
      number: '03',
      title: 'Review', 
      description: 'Confirm your trip details and pricing',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    { 
      icon: CreditCard, 
      number: '04',
      title: 'Payment', 
      description: 'Complete secure checkout via Stripe',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600'
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-gray-50 to-blue-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 rounded-full mb-6 shadow-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-sm text-blue-600 uppercase tracking-wide">
              Quick & Easy
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book Your Transfer in 4 Simple Steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow the instructions
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              
              {/* Connecting line (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0" />
              )}

              {/* Step Card */}
              <div className={`relative bg-white rounded-2xl p-6 border-2 ${step.border} hover:shadow-xl transition-all duration-300 group`}>
                
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                  {step.number}
                </div>

                {/* Icon with gradient background */}
                <div className="mb-6">
                  <div className={`h-16 w-16 ${step.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <step.icon className="h-8 w-8 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className={`font-bold ${step.color} text-lg mb-2`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${step.iconBg} rounded-b-2xl`} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-green-200 rounded-xl shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Average booking time:</span>
            </div>
            <span className="text-sm font-bold text-green-600">Under 3 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}