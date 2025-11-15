import React from 'react';
import { MessageSquare } from 'lucide-react';

export function LargeGroupNotice() {
  return (
    <div className="mb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-5 shadow-lg">
      <div className="flex items-start gap-4">
        <MessageSquare className="h-7 w-7 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-base font-bold text-blue-900 mb-2">Large Group? We would Love to Help!</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            For groups of 13 or more passengers, please contact us for a custom quote.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all">
            <MessageSquare className="h-4 w-4" />
            Request Custom Quote
          </a>
        </div>
      </div>
    </div>
  );
}
