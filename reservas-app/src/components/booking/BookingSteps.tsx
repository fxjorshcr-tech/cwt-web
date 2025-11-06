// src/components/booking/BookingSteps.tsx
// BEAUTIFUL VERSION - Colorful steps with descriptive text, no trust badges

'use client';

import { 
  Search,
  FileText,
  Eye,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function BookingSteps() {
  const steps = [
    { 
      icon: Search, 
      number: 1,
      title: 'Select Your Route', 
      description: 'Choose from 1,000+ destinations across Costa Rica',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400'
    },
    { 
      icon: FileText, 
      number: 2,
      title: 'Fill Details', 
      description: 'Add pickup time, location & passenger info',
      gradient: 'from-indigo-500 to-indigo-600',
      bgLight: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      hoverBorder: 'hover:border-indigo-400'
    },
    { 
      icon: Eye, 
      number: 3,
      title: 'Review Booking', 
      description: 'Confirm your trip details and pricing',
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverBorder: 'hover:border-orange-400'
    },
    { 
      icon: Lock, 
      number: 4,
      title: 'Pay Securely', 
      description: 'Safe payment with bank-level encryption',
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverBorder: 'hover:border-green-400'
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
              Simple Process
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Book in 4 Easy Steps
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fast, secure, and hassle-free booking in under 5 minutes
          </p>
        </div>

        {/* Steps Grid - Beautiful & Descriptive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`group relative bg-white rounded-2xl border-2 ${step.borderColor} ${step.hoverBorder} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -right-4 h-10 w-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10">
                {step.number}
              </div>

              {/* Icon with Gradient */}
              <div className={`relative mb-6`}>
                <div className={`h-16 w-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                {/* Decorative corner accent */}
                <div className={`absolute -bottom-2 -right-2 h-6 w-6 ${step.bgLight} rounded-lg`}></div>
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow indicator for next step (except last) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 z-20">
                  <ArrowRight className="h-6 w-6 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            ⚡ Average booking time: <span className="font-bold text-gray-900">3 minutes</span>
          </p>
        </div>
      </div>
    </section>
  );
}