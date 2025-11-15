// src/components/home/FinalCTA.tsx
// MOBILE OPTIMIZED - Contact section before footer

'use client';

import { Phone, Mail, MessageSquare, Clock } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="text-center text-white mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Costa Rica Adventure?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Book your private shuttle and travel with confidence
          </p>
        </div>

        {/* CTA Button - Mobile First */}
        <div className="text-center mb-12">
          <button
            onClick={() => {
              const element = document.getElementById('booking-form');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            Book Your Shuttle Now
          </button>
        </div>

        {/* Contact Cards - Mobile Optimized */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          
          {/* WhatsApp */}
          <a
            href="https://wa.me/50685962438"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 mb-1 text-sm">WhatsApp</p>
                <p className="text-xs text-gray-600 mb-1">+506-8596-2438</p>
                <p className="text-xs text-green-600 font-medium">
                  Fastest response
                </p>
              </div>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:+50685962438"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 mb-1 text-sm">Phone</p>
                <p className="text-xs text-gray-600 mb-1">+506-8596-2438</p>
                <p className="text-xs text-blue-600 font-medium">
                  24/7 available
                </p>
              </div>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:info@cantwaittravelcr.com"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition-all group sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 mb-1 text-sm">Email</p>
                <p className="text-xs text-gray-600 mb-1 truncate">info@cantwaittravelcr.com</p>
                <p className="text-xs text-orange-600 font-medium">
                  2-hour response
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Service Hours - Compact */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Clock className="h-4 w-4 text-white" />
            <p className="text-white text-sm font-medium">
              We operate 24/7, every day of the year
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}