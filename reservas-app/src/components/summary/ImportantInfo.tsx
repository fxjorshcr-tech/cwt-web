// src/components/summary/ImportantInfo.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function ImportantInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-100/50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900">Important Information</span>
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-start gap-2 text-xs">
            <span className="text-blue-600 mt-0.5">🧳</span>
            <span className="text-gray-700">1 large bag + 1 carry-on per person</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-orange-600 mt-0.5">⏱️</span>
            <span className="text-gray-700">One complimentary 1-hour stop</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-green-600 mt-0.5">👶</span>
            <span className="text-gray-700">Baby car seats & boosters free</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-red-600 mt-0.5">🚫</span>
            <span className="text-gray-700">No refund within 48h of pickup</span>
          </div>
        </div>
      )}
    </div>
  );
}
