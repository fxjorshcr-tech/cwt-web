// src/components/booking/BookingSteps.tsx
// Minimal + Blue/Orange Palette - Creative & Professional

'use client';

import { 
  Search,
  FileText,
  Eye,
  Lock,
  Shield,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function BookingSteps() {
  const steps = [
    { icon: Search, title: 'Select', subtitle: 'Your Route', color: 'blue' },
    { icon: FileText, title: 'Fill', subtitle: 'Details', color: 'blue' },
    { icon: Eye, title: 'Review', subtitle: 'Booking', color: 'orange' },
    { icon: Lock, title: 'Pay', subtitle: 'Securely', color: 'orange' },
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-30 -z-10"></div>

      <div className="container mx-auto px-6 max-w-6xl relative">
        
        {/* Header with accent */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-1 w-8 bg-blue-500 rounded-full"></div>
            <Sparkles className="h-4 w-4 text-orange-500" />
            <div className="h-1 w-8 bg-orange-500 rounded-full"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Book in 4 Simple Steps
          </h2>
          <p className="text-gray-600">Fast, easy, and secure booking process</p>
        </div>

        {/* Steps Timeline */}
        <div className="relative mb-12">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-orange-200 to-orange-300 mx-24"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Card */}
                <div className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 relative">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 h-8 w-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
                    {idx + 1}
                  </div>

                  <div className="flex flex-col items-center text-center">
                    {/* Icon with color accent */}
                    <div className={`relative mb-4 ${
                      step.color === 'blue' 
                        ? 'bg-blue-500 group-hover:bg-blue-600' 
                        : 'bg-orange-500 group-hover:bg-orange-600'
                    } h-16 w-16 rounded-xl flex items-center justify-center transition-colors shadow-md`}>
                      <step.icon className="h-8 w-8 text-white" />
                      {/* Corner accent */}
                      <div className={`absolute -bottom-1 -right-1 h-3 w-3 ${
                        step.color === 'blue' ? 'bg-orange-400' : 'bg-blue-400'
                      } rounded-sm`}></div>
                    </div>

                    {/* Text */}
                    <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Section - Clean & Minimal */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 border-gray-200 rounded-2xl p-8 relative overflow-hidden">
            {/* Decorative corner accents */}
            <div className="absolute top-0 right-0 h-20 w-20 bg-orange-500/10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 h-20 w-20 bg-blue-500/10 rounded-tr-full"></div>

            <div className="relative">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Secure Payment Platform
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    We use the same secure payment technology trusted by industry giants like{' '}
                    <span className="font-bold text-blue-600">Netflix</span> and{' '}
                    <span className="font-bold text-orange-600">HBO</span>.
                  </p>
                </div>
              </div>

              {/* Payment Methods - Simple List */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 text-center hover:border-blue-300 transition-colors">
                  <p className="font-semibold text-gray-900 text-sm">Credit Card</p>
                  <p className="text-xs text-gray-600">Visa, Mastercard</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 text-center hover:border-blue-300 transition-colors">
                  <p className="font-semibold text-gray-900 text-sm">Bank Transfer</p>
                  <p className="text-xs text-gray-600">Wire, ACH</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 text-center hover:border-blue-300 transition-colors">
                  <p className="font-semibold text-gray-900 text-sm">Direct Debit</p>
                  <p className="text-xs text-gray-600">SEPA, BACS</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 text-center hover:border-blue-300 transition-colors">
                  <p className="font-semibold text-gray-900 text-sm">More Options</p>
                  <p className="text-xs text-gray-600">iDEAL, PayTo</p>
                </div>
              </div>

              {/* Trust Badges - Inline with color accents */}
              <div className="flex flex-wrap justify-center items-center gap-6 pt-5 border-t border-gray-300">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}