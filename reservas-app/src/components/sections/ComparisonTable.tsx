// src/components/sections/ComparisonTable.tsx
'use client';

import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

export default function ComparisonTable() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compare Your Transportation Options
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            See why private transfers with Can't Wait Travel are the best choice for moving between destinations in Costa Rica
          </p>
        </div>

        {/* Comparison Table - Responsive */}
        <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-200">
          <table className="w-full bg-white">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-4 sm:p-6 font-bold text-gray-700 text-sm sm:text-base min-w-[160px]">Feature</th>
                <th className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l border-r-2 border-blue-300">
                  <div className="font-bold text-blue-900 text-base sm:text-lg">Private Transfer</div>
                  <div className="text-xs sm:text-sm text-blue-700 font-semibold">(Can't Wait Travel)</div>
                </th>
                <th className="p-4 sm:p-6 text-center">
                  <div className="font-bold text-gray-700 text-sm sm:text-base">Shared Shuttle</div>
                </th>
                <th className="p-4 sm:p-6 text-center">
                  <div className="font-bold text-gray-700 text-sm sm:text-base">Rental Car</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Privacy */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">Privacy</td>
                <td className="p-4 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block">Just your group</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">10+ strangers</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block">Private</span>
                </td>
              </tr>

              {/* Direct Route */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">Direct Route</td>
                <td className="p-4 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block font-bold">Direct + strategic stops</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">4-6+ stops</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block">Direct</span>
                </td>
              </tr>

              {/* Travel Time */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">Travel Time</td>
                <td className="p-4 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block font-bold">3-4 hours typical</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">6+ hours with stops</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <MinusCircle className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">If you know the way</span>
                </td>
              </tr>

              {/* Luggage Space */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">Luggage Space</td>
                <td className="p-4 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block">Plenty of room</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <MinusCircle className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">Limited</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <MinusCircle className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">Depends on car</span>
                </td>
              </tr>

              {/* No Driving Stress */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">No Driving Stress</td>
                <td className="p-4 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block font-bold">Relax & enjoy</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block">Relax</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">Stressful navigation</span>
                </td>
              </tr>

              {/* Airport Pickup */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">Airport Pickup</td>
                <td className="p-4 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block font-bold">We find you</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <MinusCircle className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">Meeting point</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">Shuttle to rental lot</span>
                </td>
              </tr>

              {/* Flight Monitoring */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">Flight Monitoring</td>
                <td className="p-4 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block font-bold">We track delays</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">Miss it = pay again</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">N/A</span>
                </td>
              </tr>

              {/* Local Knowledge */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 sm:p-6 font-semibold text-gray-900 text-sm sm:text-base">Local Knowledge</td>
                <td className="p-4 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-700 mt-1 block font-bold">30+ years experience</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <MinusCircle className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">Depends on driver</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-xs sm:text-sm text-gray-600 mt-1 block">GPS only</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
