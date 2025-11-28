// src/components/booking/FAQsWidget.tsx
// ✅ Widget de FAQs destacados para mostrar en Summary
'use client';

import { useEffect, useState } from 'react';
import { HelpCircle, ChevronDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export function FAQsWidget() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFeaturedFAQs();
  }, []);

  async function loadFeaturedFAQs() {
    try {
      const supabase = createClient();
      
      // Cargar FAQs destacados (is_featured = true)
      const { data, error } = await supabase
        .from('faqs')
        .select('id, category, question, answer')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(5);

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return null; // No mostrar widget si no hay FAQs
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
        <div className="flex items-center gap-2 text-white">
          <HelpCircle className="h-6 w-6" />
          <h3 className="font-bold text-lg">Quick FAQs</h3>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          Common questions answered
        </p>
      </div>

      {/* FAQs List */}
      <div className="p-4 space-y-2">
        {faqs.map((faq) => {
          const isOpen = openItems.has(faq.id);

          return (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 transition-all"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-4 py-3 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-sm pr-2 leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5 transition-transform ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-3 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      <div className="p-4 pt-0">
        <Link
          href="/faqs"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm"
        >
          View All FAQs
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}