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

        {/* Comparison Table - Responsive with sticky first column */}
        <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-200 -mx-4 sm:mx-0">
          <table className="w-full bg-white min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-3 sm:p-6 font-bold text-gray-700 text-xs sm:text-base w-[90px] sm:w-[160px] sticky left-0 bg-white z-10">Feature</th>
                <th className="p-3 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l border-r-2 border-blue-300 min-w-[120px] sm:min-w-[180px]">
                  <div className="font-bold text-blue-900 text-sm sm:text-lg">Private</div>
                  <div className="text-[10px] sm:text-sm text-blue-700 font-semibold hidden sm:block">(Can't Wait Travel)</div>
                </th>
                <th className="p-3 sm:p-6 text-center min-w-[100px] sm:min-w-[140px]">
                  <div className="font-bold text-gray-700 text-xs sm:text-base">Shared</div>
                </th>
                <th className="p-3 sm:p-6 text-center min-w-[100px] sm:min-w-[140px]">
                  <div className="font-bold text-gray-700 text-xs sm:text-base">Rental</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Privacy */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-3 sm:p-6 font-semibold text-gray-900 text-xs sm:text-base sticky left-0 bg-white">Privacy</td>
                <td className="p-3 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block">Your group</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <XCircle className="h-5 w-5 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">Strangers</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block">Private</span>
                </td>
              </tr>

              {/* Direct Route */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-3 sm:p-6 font-semibold text-gray-900 text-xs sm:text-base sticky left-0 bg-white">Direct</td>
                <td className="p-3 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block font-bold">Direct</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <XCircle className="h-5 w-5 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">4-6 stops</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block">Direct</span>
                </td>
              </tr>

              {/* Travel Time */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-3 sm:p-6 font-semibold text-gray-900 text-xs sm:text-base sticky left-0 bg-white">Time</td>
                <td className="p-3 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block font-bold">3-4 hrs</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <XCircle className="h-5 w-5 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">6+ hrs</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <MinusCircle className="h-5 w-5 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">Varies</span>
                </td>
              </tr>

              {/* Luggage Space */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-3 sm:p-6 font-semibold text-gray-900 text-xs sm:text-base sticky left-0 bg-white">Luggage</td>
                <td className="p-3 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block">Plenty</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <MinusCircle className="h-5 w-5 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">Limited</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <MinusCircle className="h-5 w-5 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">Depends</span>
                </td>
              </tr>

              {/* No Driving Stress */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-3 sm:p-6 font-semibold text-gray-900 text-xs sm:text-base sticky left-0 bg-white">Relax</td>
                <td className="p-3 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block font-bold">Enjoy</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block">Relax</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <XCircle className="h-5 w-5 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">Stressful</span>
                </td>
              </tr>

              {/* Airport Pickup */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-3 sm:p-6 font-semibold text-gray-900 text-xs sm:text-base sticky left-0 bg-white">Pickup</td>
                <td className="p-3 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block font-bold">We find you</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <MinusCircle className="h-5 w-5 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">Meet point</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <XCircle className="h-5 w-5 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">Shuttle</span>
                </td>
              </tr>

              {/* Flight Monitoring */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-3 sm:p-6 font-semibold text-gray-900 text-xs sm:text-base sticky left-0 bg-white">Flights</td>
                <td className="p-3 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block font-bold">Tracked</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <XCircle className="h-5 w-5 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">Miss=pay</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <XCircle className="h-5 w-5 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">N/A</span>
                </td>
              </tr>

              {/* Local Knowledge */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-3 sm:p-6 font-semibold text-gray-900 text-xs sm:text-base sticky left-0 bg-white">Local</td>
                <td className="p-3 sm:p-6 bg-blue-50/30 border-l border-r-2 border-blue-200 text-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-green-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-700 mt-1 block font-bold">30+ yrs</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <MinusCircle className="h-5 w-5 sm:h-7 sm:w-7 text-yellow-600 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">Varies</span>
                </td>
                <td className="p-3 sm:p-6 text-center">
                  <XCircle className="h-5 w-5 sm:h-7 sm:w-7 text-red-500 mx-auto" />
                  <span className="text-[10px] sm:text-sm text-gray-600 mt-1 block">GPS</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
