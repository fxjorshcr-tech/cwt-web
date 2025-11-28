// src/components/home/FAQ.tsx
// Frequently Asked Questions - SEO optimized

'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How far in advance should I book my Costa Rica private shuttle?',
      answer: 'We recommend booking at least 48 hours in advance, especially during high season (December-April). However, we often accommodate last-minute bookings based on availability. For airport pickups, booking 3-7 days ahead ensures your preferred time slot.'
    },
    {
      question: 'What happens if my flight to San José (SJO) or Liberia (LIR) is delayed?',
      answer: 'Don\'t worry! We monitor all incoming flights in real-time. If your flight is delayed, we automatically adjust your pickup time at no extra charge. Your driver will be waiting when you arrive, no matter what time that is.'
    },
    {
      question: 'How much luggage can I bring on the shuttle?',
      answer: 'Each passenger can bring up to 2 large suitcases plus carry-on bags. We have ample space for surfboards, golf clubs, and other sports equipment - just let us know during booking so we can prepare the right vehicle.'
    },
    {
      question: 'Are child car seats included in the Costa Rica transfer service?',
      answer: 'Yes! We provide child car seats and booster seats free of charge. Simply indicate the ages of your children during booking, and we\'ll have the appropriate seats installed before pickup.'
    },
    {
      question: 'What routes do you cover in Costa Rica?',
      answer: 'We cover all major Costa Rica destinations including: San José (SJO) Airport, Liberia (LIR) Airport, La Fortuna (Arenal Volcano), Manuel Antonio, Monteverde, Tamarindo, Papagayo, Puerto Viejo, Jaco, Santa Teresa, Uvita, and more. If you don\'t see your destination, contact us - we likely service it!'
    },
    {
      question: 'Is the driver bilingual? Will they speak English?',
      answer: 'Yes! All our drivers are bilingual, speaking both English and Spanish fluently. They\'re also trained to provide excellent customer service and can share local tips about Costa Rica during your journey.'
    },
    {
      question: 'What\'s included in the private shuttle price?',
      answer: 'Everything! Our prices include: professional bilingual driver, fuel, all tolls, parking fees, airport meet & greet service, flight monitoring, bottled water, and vehicle insurance. No hidden fees or surprise charges.'
    },
    {
      question: 'Can I make stops along the way to my destination?',
      answer: 'Absolutely! One complimentary 1-hour stop is included (perfect for lunch, groceries, or sightseeing). Additional stops can be arranged for a small fee. Popular stops include Carara National Park, crocodile bridge, and local restaurants.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Free cancellation up to 48 hours before scheduled pickup time with full refund. Cancellations within 48 hours are subject to a 50% charge. No-shows are non-refundable. We recommend purchasing travel insurance for maximum flexibility.'
    },
    {
      question: 'How do I pay for the Costa Rica private transportation?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex), bank transfers, ACH, SEPA Direct Debit, and other secure payment methods through our secure online payment platform.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Got Questions?
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about our Costa Rica shuttle service
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4 pt-2 text-gray-700 leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Still Have Questions?
          </h3>
          <p className="text-gray-700 mb-4">
            Our team is ready to help with your Costa Rica travel plans
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/50600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp Us
            </a>
            <a
              href="mailto:info@cantwaittravel.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}