// src/components/forms/booking/LargeGroupNotice.tsx
import React from 'react';
import { Users, MessageCircle } from 'lucide-react';

export function LargeGroupNotice() {
  const whatsappNumber = '50670658058';
  const message = encodeURIComponent('Hello! I need a quote for a group of 13+ passengers.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="mb-4 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="bg-orange-200 p-2.5 rounded-full">
          <Users className="h-6 w-6 text-orange-700" />
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-orange-900 mb-2">
            Large Group? Let&apos;s Help You!
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            For groups of <span className="font-bold">13 or more passengers</span>, please contact us for a custom quote.
          </p>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-800 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Contact us on WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}