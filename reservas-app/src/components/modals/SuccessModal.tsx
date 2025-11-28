'use client';

import { CheckCircle2, X, MessageSquare } from 'lucide-react';
import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  subMessage?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Message Sent Successfully!",
  message = "Thank you for contacting us. We've received your message and will get back to you within 2 hours.",
  subMessage = "A confirmation email has been sent to your inbox."
}: SuccessModalProps) {

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          <p className="text-gray-600 mb-2">
            {message}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {subMessage}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Got it!
          </button>

          <a
            href="https://wa.me/50685962438"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            Chat on WhatsApp for faster response
          </a>
        </div>
      </div>
    </div>
  );
}
