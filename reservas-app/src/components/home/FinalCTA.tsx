// src/components/home/FinalCTA.tsx
// Final call-to-action before footer

'use client';

import { Phone, Mail, MessageSquare, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - CTA */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Your Costa Rica Adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-6 leading-relaxed">
              Book your private shuttle now and travel with confidence across Costa Rica's most beautiful destinations.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span className="text-blue-50">Instant confirmation in seconds</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <span className="text-blue-50">24/7 support in English & Spanish</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-blue-50">Service to all major Costa Rica destinations</span>
              </div>
            </div>

            <Link href="/booking">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Book Your Shuttle Now
              </Button>
            </Link>
          </div>

          {/* Right side - Contact info */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Us Anytime
            </h3>
            
            <div className="space-y-5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/50600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">WhatsApp (Fastest)</p>
                  <p className="text-sm text-gray-600">+506 XXXX-XXXX</p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Usually responds within 5 minutes
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+50600000000"
                className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Phone</p>
                  <p className="text-sm text-gray-600">+506 XXXX-XXXX</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    Available 24/7 for emergencies
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@cantwaittravel.com"
                className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
              >
                <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Email</p>
                  <p className="text-sm text-gray-600">info@cantwaittravel.com</p>
                  <p className="text-xs text-orange-600 font-medium mt-1">
                    Response within 2 hours during business hours
                  </p>
                </div>
              </a>
            </div>

            {/* Operating hours */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">
                    Service Hours
                  </p>
                  <p className="text-sm text-gray-600">
                    We operate 24/7, every day of the year including holidays. 
                    Your shuttle runs on your schedule, not ours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}