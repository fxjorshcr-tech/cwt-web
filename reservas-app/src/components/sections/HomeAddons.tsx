// src/components/sections/HomeAddons.tsx
'use client';

import { Clock, Gift, Sparkles, Check } from 'lucide-react';

export default function HomeAddons() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full mb-6">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="text-purple-700 font-bold text-sm uppercase tracking-wide">
              Enhance Your Journey
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Make Your Transfer More Flexible
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Add peace of mind and convenience to your private transfer with our optional upgrades
          </p>
        </div>

        {/* Add-ons Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">

          {/* Flex Protection */}
          <div className="relative bg-white rounded-2xl shadow-xl border-2 border-orange-300 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
            {/* Popular Badge */}
            <div className="absolute -top-2 right-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-10">
              POPULAR
            </div>

            <div className="p-6 sm:p-8">
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-7 w-7 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    Flex Protection
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Perfect for travelers who want peace of mind
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-orange-600">
                    $59
                  </div>
                  <div className="text-xs text-gray-500">per transfer</div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mt-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Flex Time Pickup</p>
                    <p className="text-sm text-gray-600">Change your pickup time up to 2 hours later, even 1 hour before scheduled pickup</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Free Reschedule</p>
                    <p className="text-sm text-gray-600">Date/time if flight is delayed or cancelled (for airport pickups)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explorer Upgrade */}
          <div className="relative bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-xl border-2 border-purple-300 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
            {/* Deluxe Badge */}
            <div className="absolute -top-2 right-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-10">
              DELUXE
            </div>

            <div className="p-6 sm:p-8">
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gift className="h-7 w-7 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    Explorer Upgrade
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Turn your transfer into an adventure
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600">
                    $195
                  </div>
                  <div className="text-xs text-gray-500">per transfer</div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mt-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">All Flex Protection</p>
                    <p className="text-sm text-gray-600">Includes all Flex Protection benefits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Scenic Stops</p>
                    <p className="text-sm text-gray-600">Add 3 hours to your trip to stop at waterfalls, scenic viewpoints, restaurants, or souvenir shops along your route</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Complimentary Cooler</p>
                    <p className="text-sm text-gray-600">Cooler with National Beers, San Pellegrino, Sodas & Snacks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto">
            Both add-ons can be selected during your booking process. Prices are per transfer.
          </p>
        </div>

      </div>
    </section>
  );
}
