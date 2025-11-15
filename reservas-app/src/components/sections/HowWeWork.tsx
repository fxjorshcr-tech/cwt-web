// src/components/home/HowWeWork.tsx
'use client';

import { Heart, CheckCircle2 } from 'lucide-react';

export default function HowWeWork() {
  return (
    <section className="py-12 sm:py-16 bg-white overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-blue-100 shadow-xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-full mb-3 sm:mb-4 shadow-md">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-blue-700 font-bold text-xs sm:text-sm uppercase tracking-wide">
                How We Work
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              We Only Sell What We Operate
            </h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 text-center px-2">
              At Can't Wait Travel, we focus on <strong>quality over quantity</strong>. That's why 
              we only offer services that <strong className="text-blue-600">we personally operate and control</strong>.
            </p>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-blue-100">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">What We Do</h3>
                    <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                      <li>✅ Operate our own private shuttles</li>
                      <li>✅ Run our own private tours</li>
                      <li>✅ Employ and train our drivers directly</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-red-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 font-bold text-xs sm:text-sm">✕</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">What We Don't Do</h3>
                    <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                      <li>❌ Resell tours from other companies</li>
                      <li>❌ Contract out to third parties</li>
                      <li>❌ Offer services we don't control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-xl border-2 border-blue-200">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
                <strong className="text-blue-600">Why does this matter?</strong> When you book with us, 
                you're working with the people who actually provide the service. Every driver is our employee. 
                Every vehicle is maintained by our team. We're accountable for every detail because 
                <strong> it's our operation from start to finish</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}