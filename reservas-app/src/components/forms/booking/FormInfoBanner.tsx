import React from 'react';
import { Users, AlertCircle } from 'lucide-react';

export function FormInfoBanner() {
  return (
    <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
      <div className="flex items-start gap-3 text-sm text-gray-600">
        <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-gray-900">Up to 12 passengers</span> with one large suitcase per person
        </p>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-600">
        <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-gray-900">Cannot find your route?</span> Contact us on WhatsApp
        </div>
      </div>
    </div>
  );
}
