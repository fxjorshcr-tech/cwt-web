// src/components/payment/TilopayModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TilopayModalProps {
  isOpen: boolean;
  paymentUrl: string | null;
  onClose: () => void;
}

export default function TilopayModal({ isOpen, paymentUrl, onClose }: TilopayModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && paymentUrl) {
      setLoading(true);
      setError(null);
    }
  }, [isOpen, paymentUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('Unable to load payment form. Please try again.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Secure Payment</h2>
              <p className="text-white/80 text-xs">Powered by Tilopay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative" style={{ height: '600px' }}>
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 text-sm">Loading secure payment form...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-6">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-600 font-medium mb-2">Payment Form Error</p>
              <p className="text-gray-600 text-sm text-center mb-6">{error}</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (paymentUrl) {
                    window.open(paymentUrl, '_blank');
                  }
                }}>
                  Open in New Tab
                </Button>
              </div>
            </div>
          )}

          {paymentUrl && !error && (
            <iframe
              src={paymentUrl}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="payment"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            256-bit SSL encryption
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
