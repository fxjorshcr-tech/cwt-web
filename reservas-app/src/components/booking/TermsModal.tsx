// src/components/booking/TermsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { sanitizeHtml } from '@/lib/sanitize-html';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [termsContent, setTermsContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTerms();
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  async function loadTerms() {
    try {
      setLoading(true);
      setError(false);
      const supabase = createClient();
      
      const { data, error: fetchError } = await supabase
        .from('legal_pages')
        .select('content')
        .eq('slug', 'terms-and-conditions')
        .single();

      if (fetchError) throw fetchError;

      // Sanitize HTML content to prevent XSS
      setTermsContent(sanitizeHtml(data?.content || ''));
    } catch (err) {
      console.error('Error loading terms:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4">
        {/* Modal Content */}
        <div
          className="relative bg-white w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-4xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Terms & Conditions</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-4 sm:p-6">
              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm">Loading terms...</p>
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Unable to load terms
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please try again or contact us for assistance.
                  </p>
                  <button
                    onClick={loadTerms}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && termsContent && (
                <div className="space-y-4">
                  <style dangerouslySetInnerHTML={{__html: `
                    .terms-content h2 {
                      font-size: 1.5rem !important;
                      font-weight: 700 !important;
                      color: #111827 !important;
                      margin-top: 2rem !important;
                      margin-bottom: 1rem !important;
                      padding-bottom: 0.75rem !important;
                      border-bottom: 2px solid #e5e7eb !important;
                    }
                    
                    .terms-content h2:first-child {
                      margin-top: 0 !important;
                    }
                    
                    .terms-content h3 {
                      font-size: 1.25rem !important;
                      font-weight: 600 !important;
                      color: #111827 !important;
                      margin-top: 1.5rem !important;
                      margin-bottom: 0.75rem !important;
                    }
                    
                    .terms-content p {
                      margin-bottom: 1rem !important;
                      line-height: 1.75 !important;
                      color: #374151 !important;
                    }
                    
                    .terms-content ul {
                      list-style-type: disc !important;
                      padding-left: 2rem !important;
                      margin-bottom: 1.25rem !important;
                      margin-top: 0.75rem !important;
                    }
                    
                    .terms-content ul li {
                      margin-bottom: 0.75rem !important;
                      line-height: 1.7 !important;
                      color: #374151 !important;
                    }
                    
                    .terms-content strong {
                      font-weight: 700 !important;
                      color: #111827 !important;
                    }
                    
                    .terms-content a {
                      color: #2563eb !important;
                      text-decoration: underline !important;
                    }
                    
                    .terms-content em {
                      font-style: italic !important;
                      color: #6b7280 !important;
                    }
                  `}} />
                  <div 
                    className="terms-content"
                    dangerouslySetInnerHTML={{ __html: termsContent }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}