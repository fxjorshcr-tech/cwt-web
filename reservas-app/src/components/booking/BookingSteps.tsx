// src/components/booking/BookingSteps.tsx
// PROFESSIONAL VERSION - Modern, clean, and visually stunning

'use client';

import { 
  Search,
  ClipboardList,
  CheckSquare,
  CreditCard,
  Sparkles
} from 'lucide-react';

export default function BookingSteps() {
  const steps = [
    { 
      icon: Search, 
      number: '01',
      title: 'Search', 
      description: 'Pick your origin & destination',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      glow: 'group-hover:shadow-blue-500/50'
    },
    { 
      icon: ClipboardList, 
      number: '02',
      title: 'Details', 
      description: 'Pickup time & passenger info',
      gradient: 'from-purple-500 via-purple-600 to-pink-600',
      glow: 'group-hover:shadow-purple-500/50'
    },
    { 
      icon: CheckSquare, 
      number: '03',
      title: 'Review', 
      description: 'Confirm trip & pricing',
      gradient: 'from-orange-500 via-orange-600 to-red-600',
      glow: 'group-hover:shadow-orange-500/50'
    },
    { 
      icon: CreditCard, 
      number: '04',
      title: 'Payment', 
      description: 'Secure checkout via Stripe',
      gradient: 'from-green-500 via-green-600 to-emerald-600',
      glow: 'group-hover:shadow-green-500/50'
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full mb-6 shadow-lg shadow-blue-500/30">
            <Sparkles className="h-4 w-4" />
            <span className="font-bold text-sm uppercase tracking-wider">
              Quick & Easy
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Your Journey in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From search to confirmation in under 3 minutes
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connecting line between steps (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0" />
              )}

              {/* Step Card */}
              <div className={`group relative bg-white rounded-3xl p-8 border border-gray-200 transition-all duration-500 hover:border-transparent hover:-translate-y-2 hover:shadow-2xl ${step.glow}`}>
                
                {/* Step Number - Top Right Corner */}
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  {step.number}
                </div>

                {/* Icon Container with Gradient */}
                <div className="relative mb-6">
                  <div className={`relative h-20 w-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <step.icon className="h-10 w-10 text-white" strokeWidth={2.5} />
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`} />
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-900">Average booking time:</span>
            </div>
            <span className="text-sm font-bold text-blue-600">3 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}