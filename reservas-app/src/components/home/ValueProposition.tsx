// src/components/home/ValueProposition.tsx
// Value propositions and guarantees

'use client';

import {
  Zap,
  DollarSign,
  Plane,
  XCircle,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function ValueProposition() {
  const values = [
    {
      icon: Zap,
      title: 'Instant Confirmation',
      description: 'Booking confirmed in seconds, not hours',
      detail: 'Receive your confirmation email immediately after payment with all trip details and driver contact',
      color: 'blue'
    },
    {
      icon: DollarSign,
      title: 'No Hidden Fees',
      description: 'What you see is what you pay',
      detail: 'All taxes, tolls, and fees included upfront. No surprise charges at pickup or destination',
      color: 'orange'
    },
    {
      icon: Plane,
      title: 'Flight Monitoring',
      description: 'We track your flight automatically',
      detail: 'Late arrival? No problem. We monitor all flights in real-time and adjust pickup accordingly',
      color: 'blue'
    },
    {
      icon: XCircle,
      title: 'Flexible Cancellation',
      description: 'Cancel up to 48 hours before',
      detail: 'Plans change - we understand. Free cancellation up to 48 hours before scheduled pickup time',
      color: 'orange'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Travelers Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hassle-free private transportation across Costa Rica with unmatched service quality
          </p>
        </div>

        {/* Value Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {values.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 h-14 w-14 rounded-xl ${
                  item.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                } flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees Section */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Our Commitments to You
              </h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Every Costa Rica private shuttle booking comes with these guarantees
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-orange-300" />
                <div>
                  <h4 className="font-bold mb-1">On-Time Pickup Guarantee</h4>
                  <p className="text-sm text-blue-100">
                    Your driver will be ready at the scheduled time or you'll receive a discount on your next trip
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-orange-300" />
                <div>
                  <h4 className="font-bold mb-1">Clean Vehicle Guarantee</h4>
                  <p className="text-sm text-blue-100">
                    All vehicles sanitized before each trip with A/C and comfortable seating for your journey
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-orange-300" />
                <div>
                  <h4 className="font-bold mb-1">English-Speaking Driver</h4>
                  <p className="text-sm text-blue-100">
                    All our drivers are bilingual (English/Spanish) with excellent communication skills
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-orange-300" />
                <div>
                  <h4 className="font-bold mb-1">Satisfaction Promise</h4>
                  <p className="text-sm text-blue-100">
                    Not satisfied with your service? Contact us within 24 hours for a resolution
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-blue-100">
                * Subject to our{' '}
                <a href="/terms" className="underline hover:text-white">
                  Terms & Conditions
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}