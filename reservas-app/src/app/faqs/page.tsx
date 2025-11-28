// src/app/faqs/page.tsx
// ✅ UPDATED: Categorías actualizadas con las 15 nuevas categorías
'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import BookingNavbar from '@/components/booking/BookingNavbar';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
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

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFAQs();
  }, []);

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

  // Filtrar FAQs
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === null || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Agrupar por categoría
  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  // Obtener solo las categorías que existen en los FAQs filtrados
  const availableCategories = Object.keys(CATEGORY_LABELS).filter(category => 
    faqs.some(faq => faq.category === category)
  );

  return (
    <>
      {/* ✅ Navbar */}
      <BookingNavbar />
      
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image
          src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/puerto-viejo-costa-rica-beach.webp"
          alt="Costa Rica Beach"
          fill
          className="object-cover"
          style={{ objectPosition: '50% 65%' }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 text-white drop-shadow-lg" />
            <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl drop-shadow-md">
              Everything you need to know about our services
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-base"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
                }`}
              >
                All Categories
              </button>
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-8">
              {/* Category Skeleton */}
              {[1, 2, 3].map((category) => (
                <div key={category}>
                  <div className="h-8 w-48 bg-gray-200 rounded-lg mb-4 animate-pulse" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                      >
                        <div className="px-6 py-4 flex items-center justify-between">
                          <div className="h-5 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredFAQs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* FAQs by Category */}
          {!loading && Object.keys(groupedFAQs).length > 0 && (
            <div className="space-y-8">
              {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    {CATEGORY_LABELS[category] || category}
                  </h2>

                  <div className="space-y-3">
                    {categoryFAQs.map((faq) => {
                      const isOpen = openItems.has(faq.id);

                      return (
                        <div
                          key={faq.id}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-all"
                        >
                          <button
                            onClick={() => toggleItem(faq.id)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 pr-4">
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
                                isOpen ? 'transform rotate-180' : ''
                              }`}
                            />
                          </button>

                          {isOpen && (
                            <div className="px-6 pb-4 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
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

          {/* Contact CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 border-2 border-blue-200 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-700 mb-6">
              We're here to help! Contact us directly and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/50685962438"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp Us
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}