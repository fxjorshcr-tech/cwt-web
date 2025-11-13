// src/components/travel-guide/TravelGuideClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, MapPin, ArrowRight } from 'lucide-react';
import type { Destination } from '@/lib/supabase-destinations';

interface Zone {
  id: string;
  name: string;
  icon: string;
}

interface TravelGuideClientProps {
  destinations: Destination[];
  zones: Zone[];
}

export default function TravelGuideClient({ destinations, zones }: TravelGuideClientProps) {
  const [activeZone, setActiveZone] = useState('all');
  const [openDestinations, setOpenDestinations] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const destinationId = window.location.hash.slice(1);
      setOpenDestinations(new Set([destinationId]));
      setTimeout(() => {
        document.getElementById(destinationId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const filteredDestinations = activeZone === 'all' 
    ? destinations 
    : destinations.filter(d => d.zone === activeZone);

  const toggleDestination = (id: string) => {
    const newOpen = new Set(openDestinations);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenDestinations(newOpen);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <>
      {/* Sticky Filter Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-semibold transition-all ${
                  activeZone === zone.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-base">{zone.icon}</span>
                <span className="text-sm">{zone.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations Accordion */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Intro Box */}
          <div className="mb-10 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-bold text-blue-700">💡 How to use this guide:</span> Click any destination below to expand complete details. 
              Each guide includes insider tips, top experiences, and booking links. Multiple destinations can be open simultaneously.
            </p>
          </div>

          <div className="space-y-4">
            {filteredDestinations.map((dest) => {
              const isOpen = openDestinations.has(dest.slug);
              
              return (
                <div
                  key={dest.id}
                  id={dest.slug}
                  className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all"
                >
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleDestination(dest.slug)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">{dest.subtitle}</p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-6 w-6 text-gray-400 transition-transform flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Expandable Content */}
                  {isOpen && (
                    <div className="border-t border-gray-200">
                      {/* Mini Hero Image */}
                      <div className="relative h-52 md:h-64">
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          className="object-cover"
                          quality={65}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      <div className="p-6 md:p-8 space-y-6">
                        {/* Intro */}
                        <p className="text-lg text-gray-700 leading-relaxed">
                          {dest.intro}
                        </p>

                        {/* Highlights */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span>✨</span> Quick Highlights
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {dest.highlights.map((h, i) => (
                              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Insider Tips */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span>💡</span> Insider Tips
                          </h4>
                          <div className="space-y-2">
                            {dest.tips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="text-green-600 mt-1 flex-shrink-0">•</span>
                                <span className="text-sm leading-relaxed">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Top Experiences */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span>⭐</span> Top Experiences
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {dest.experiences.map((exp, i) => (
                              <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  <span className="font-semibold text-gray-900">{exp.split(':')[0]}:</span>
                                  {exp.split(':')[1]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Getting There */}
                        {dest.getting_there && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                              <span>🚗</span> Getting There
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                              {dest.getting_there}
                            </p>
                          </div>
                        )}

                        {/* Best Time to Visit */}
                        {dest.best_time_to_visit && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                              <span>🌤️</span> Best Time to Visit
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-200">
                              {dest.best_time_to_visit}
                            </p>
                          </div>
                        )}

                        {/* How Many Days */}
                        {dest.how_many_days && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                              <span>📅</span> How Many Days?
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border border-green-200">
                              {dest.how_many_days}
                            </p>
                          </div>
                        )}

                        {/* Budget Tips */}
                        {dest.budget_tips && dest.budget_tips.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                              <span>💰</span> Budget Tips
                            </h4>
                            <div className="space-y-2">
                              {dest.budget_tips.map((tip, i) => (
                                <div key={i} className="flex items-start gap-2 text-gray-700">
                                  <span className="text-amber-600 mt-1 flex-shrink-0">$</span>
                                  <span className="text-sm leading-relaxed">{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CTAs */}
                        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                          <Link
                            href="/transfers#booking-form"
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <span>Book Shuttle</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <Link
                            href="/contact"
                            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-center rounded-lg font-semibold border-2 border-gray-300 transition-colors"
                          >
                            Ask Questions
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}