// src/components/booking/FAQModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, Search, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
}

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  booking: '📅 Booking & Reservations',
  pricing: '💳 Pricing & Payment',
  cancellation: '❌ Cancellation & Refunds',
  pickup: '🚐 Pickup & Dropoff',
  luggage: '🧳 Luggage & Space',
  car_seats: '👶 Car Seats & Children',
  vehicles: '🚗 Vehicles & Comfort',
  drivers: '👨‍✈️ Drivers & Service',
  routes: '🗺️ Travel Time & Routes',
  safety: '🛡️ Safety & Insurance',
  add_ons: '⭐ Special Add-Ons',
  groups: '👥 Groups & Special Requests',
  airports: '✈️ Airports Specific',
  travel_tips: '🌴 Costa Rica Travel Tips',
  website: '💻 Technical & Website',
};

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadFAQs();
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  async function loadFAQs() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

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

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === null || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const availableCategories = Object.keys(CATEGORY_LABELS).filter(category =>
    faqs.some(faq => faq.category === category)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
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
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">FAQs</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="flex-shrink-0 p-4 bg-gray-50 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filters - Horizontal Scroll */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-2 p-4 min-w-max">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                All
              </button>
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-4">
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-4 text-gray-600 text-sm">Loading...</p>
                </div>
              )}

              {!loading && filteredFAQs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
                  <p className="text-sm text-gray-600 mb-4">Try adjusting your search</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {!loading && Object.keys(groupedFAQs).length > 0 && (
                <div className="space-y-6">
                  {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
                    <div key={category}>
                      <h3 className="text-base font-bold text-gray-900 mb-3">
                        {CATEGORY_LABELS[category] || category}
                      </h3>

                      <div className="space-y-2">
                        {categoryFAQs.map((faq) => {
                          const isOpen = openItems.has(faq.id);
                          return (
                            <div
                              key={faq.id}
                              className="bg-white rounded-lg border border-gray-200"
                            >
                              <button
                                onClick={() => toggleItem(faq.id)}
                                className="w-full px-4 py-3 flex items-center justify-between text-left"
                              >
                                <span className="font-semibold text-gray-900 pr-4 text-sm">
                                  {faq.question}
                                </span>
                                <ChevronDown
                                  className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
                                    isOpen ? 'rotate-180' : ''
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-600 text-center">
                Still have questions?{' '}
                <a
                  href="https://wa.me/50685962438"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  WhatsApp us
                </a>
              </p>
              <button
                onClick={onClose}
                className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}