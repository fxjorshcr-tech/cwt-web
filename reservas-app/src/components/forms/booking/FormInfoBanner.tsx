// src/components/forms/booking/FormInfoBanner.tsx
import React from 'react';
import { Users, MessageCircle } from 'lucide-react';

export function FormInfoBanner() {
  const whatsappNumber = '50670658058';
  const message = encodeURIComponent('Hello! I cannot find my route on the booking form.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
      <div className="flex items-start gap-3 text-sm text-gray-600">
        <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-gray-900">Up to 12 passengers</span> with one large suitcase per person
        </p>
      </div>
      
      <div className="flex items-start gap-3">
        <MessageCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">Cannot find your route?</span>
          </p>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-all"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
