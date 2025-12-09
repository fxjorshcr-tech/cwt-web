// src/components/summary/IncludedFeatures.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function IncludedFeatures() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-blue-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-cyan-100/50 transition-colors"
      >
        <span className="text-sm font-semibold text-cyan-900">What&apos;s Included?</span>
        <ChevronDown className={`h-4 w-4 text-cyan-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-start gap-2 text-xs">
            <span className="text-cyan-600 mt-0.5">🚐</span>
            <span className="text-gray-700">Spacious Van with Full A/C</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-cyan-600 mt-0.5">👥</span>
            <span className="text-gray-700">Personalized Meet & Greet</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-cyan-600 mt-0.5">🚪</span>
            <span className="text-gray-700">Door-to-Door Private Service</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-cyan-600 mt-0.5">📶</span>
            <span className="text-gray-700">Free Wi-Fi & Bottled Water</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-cyan-600 mt-0.5">👨‍✈️</span>
            <span className="text-gray-700">Professional Bilingual Driver</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-cyan-600 mt-0.5">💎</span>
            <span className="text-gray-700">All-Inclusive, No Hidden Fees</span>
          </div>
        </div>
      )}
    </div>
  );
}
