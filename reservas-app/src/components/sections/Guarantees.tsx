// src/components/sections/Guarantees.tsx
'use client';

import { Shield, Clock, Plane, DollarSign } from 'lucide-react';

export default function Guarantees() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 to-blue-700">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Shield className="h-5 w-5 text-white" />
            <span className="text-white font-bold text-sm uppercase tracking-wide">
              Our Promise to You
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Book With Confidence
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
            Real guarantees that protect your reservation and give you peace of mind
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Free Cancellation */}
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Free Cancellation
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Cancel up to <strong className="text-green-600">48 hours</strong> before your transfer for a full refund. Plans change—we understand.
            </p>
          </div>

          {/* Flight Delay Protection */}
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Flight Delay Protection
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              We track your flight automatically. <strong className="text-blue-600">Optional travel insurance available</strong> for added protection against delays and cancellations. Ask us about coverage options!
            </p>
          </div>

          {/* On-Time Guarantee */}
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              On-Time Pickup Guarantee
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              We'll be there at the agreed time. If we're late without notice, <strong className="text-purple-600">you get a refund.</strong>
            </p>
          </div>

          {/* Price Guarantee */}
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Price You See = Price You Pay
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-orange-600">Transparent pricing, every time.</strong> The price on your booking is the final price. All-inclusive.
            </p>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-white text-base sm:text-lg max-w-2xl mx-auto">
            These aren't just words—they're written into our booking policy. Your peace of mind is our priority.
          </p>
        </div>

      </div>
    </section>
  );
}
