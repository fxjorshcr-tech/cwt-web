// src/components/sections/HomeFAQs.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How far in advance should I book my private transfer?",
    answer: "We recommend booking at least 48-72 hours in advance, especially during high season (December-April). However, we can often accommodate last-minute bookings if we have availability. Contact us via WhatsApp for urgent requests."
  },
  {
    question: "What happens if my flight is delayed?",
    answer: "We track all flights automatically. If your flight is delayed, we'll adjust your pickup time accordingly at no extra charge. You won't be stranded—we'll wait for you."
  },
  {
    question: "Is the price per person or for the whole group?",
    answer: "All our prices are for the entire vehicle, not per person. Whether you're 1 person or 8 people, you pay the same price. This makes private transfers very cost-effective for families and groups."
  },
  {
    question: "Can I cancel or modify my reservation?",
    answer: "Yes! You can cancel up to 24 hours before your transfer for a full refund. If you need to modify your booking (change date, time, or pickup location), just contact us via WhatsApp and we'll make the adjustments."
  },
  {
    question: "Do you provide car seats for children?",
    answer: "Yes, we provide free car seats and booster seats for children. Just let us know the ages of your children when booking so we can prepare the appropriate seats."
  },
  {
    question: "How much luggage can we bring?",
    answer: "Our vehicles have plenty of space for luggage. Typically, we can accommodate 2-3 large suitcases plus carry-ons for up to 6 passengers. If you're traveling with surfboards, bikes, or extra-large items, let us know in advance and we'll make arrangements."
  },
  {
    question: "Are your drivers bilingual?",
    answer: "Yes, all our drivers speak English and Spanish. They're also happy to share local knowledge and recommendations about Costa Rica during your journey."
  },
  {
    question: "What if I need to stop along the way (bathroom, food, ATM)?",
    answer: "No problem! We can make reasonable stops along the route at your request. Just let your driver know. Common stops include bathrooms, restaurants, ATMs, or grocery stores."
  },
  {
    question: "How do I pay for my transfer?",
    answer: "We accept credit/debit cards (Visa, Mastercard, American Express) through our secure online payment system. You can also pay cash (USD or Costa Rican colones) directly to the driver."
  },
  {
    question: "What's the difference between your service and a shared shuttle?",
    answer: "Private transfers go direct from point A to point B with no stops for other passengers. Shared shuttles pick up multiple groups, making 4-6+ stops, which can turn a 3-hour trip into 6 hours. With us, you save time, get privacy, and control your schedule."
  }
];

export default function HomeFAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleFAQ(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full mb-6">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
              Common Questions
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about booking private transfers with Can't Wait Travel
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900 text-base sm:text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl text-center">
          <p className="text-gray-700 text-base sm:text-lg mb-3">
            Still have questions?
          </p>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            WhatsApp us directly and we'll answer within minutes
          </p>
          <a
            href="https://wa.me/50689361553"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact Us on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
